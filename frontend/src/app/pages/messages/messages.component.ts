import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageService } from '../../core/services/message.service';
import { FriendService } from '../../core/services/friend.service';
import { UserService } from '../../core/services/user.service';
import { SocketService } from '../../core/services/socket.service';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { Conversation, Message } from '../../core/models/message.model';
import { User } from '../../core/models/user.model';

interface Contact {
  user: User;
  lastMessage: Message | null;
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    RouterLink,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AvatarComponent,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private typingTimeout?: ReturnType<typeof setTimeout>;

  readonly loading = signal(true);
  readonly conversations = signal<Conversation[]>([]);
  readonly friends = signal<User[]>([]);
  readonly selectedUser = signal<User | null>(null);
  readonly messages = signal<Message[]>([]);
  readonly newMessageContent = signal('');
  readonly isTyping = signal(false);

  readonly contacts = computed<Contact[]>(() => {
    const byUserId = new Map<number, Contact>();

    for (const conv of this.conversations()) {
      byUserId.set(conv.user.id, { user: conv.user, lastMessage: conv.lastMessage });
    }
    for (const friend of this.friends()) {
      if (!byUserId.has(friend.id)) {
        byUserId.set(friend.id, { user: friend, lastMessage: null });
      }
    }

    return Array.from(byUserId.values()).sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });
  });

  constructor(
    private messageService: MessageService,
    private friendService: FriendService,
    private userService: UserService,
    private socket: SocketService,
    private route: ActivatedRoute,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loading.set(true);

    this.friendService.listFriends().subscribe((friends) => this.friends.set(friends));
    this.messageService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
        this.loading.set(false);
        this.selectFromQueryParam();
      },
      error: () => this.loading.set(false),
    });

    this.socket.messageNew
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => this.handleIncoming(message));
    this.socket.messageSent
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((message) => this.handleOwnSent(message));
    this.socket.messageTyping.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
      if (payload.senderId === this.selectedUser()?.id) {
        this.isTyping.set(true);
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => this.isTyping.set(false), 3000);
      }
    });
    this.socket.messageRead.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((payload) => {
      this.messages.set(
        this.messages().map((m) => (m.id === payload.messageId ? { ...m, read: true } : m))
      );
    });

    this.destroyRef.onDestroy(() => clearTimeout(this.typingTimeout));
  }

  private selectFromQueryParam(): void {
    const withId = Number(this.route.snapshot.queryParamMap.get('with'));
    if (!withId) {
      return;
    }

    const existing = this.contacts().find((c) => c.user.id === withId);
    if (existing) {
      this.selectContact(existing.user);
      return;
    }

    this.userService.getUserById(withId).subscribe((user) => this.selectContact(user));
  }

  selectContact(user: User): void {
    this.selectedUser.set(user);
    this.isTyping.set(false);
    this.messageService.getConversation(user.id).subscribe((messages) => {
      this.messages.set(messages);
      const myId = this.auth.currentUser()?.id;
      for (const message of messages) {
        if (message.receiverId === myId && !message.read) {
          this.socket.markRead(message.id);
        }
      }
    });
  }

  private handleIncoming(message: Message): void {
    if (message.senderId === this.selectedUser()?.id) {
      this.messages.set([...this.messages(), message]);
      this.socket.markRead(message.id);
    }
    this.refreshConversationPreview(message);
  }

  private handleOwnSent(message: Message): void {
    if (message.receiverId === this.selectedUser()?.id) {
      this.messages.set([...this.messages(), message]);
    }
    this.refreshConversationPreview(message);
  }

  private refreshConversationPreview(message: Message): void {
    const myId = this.auth.currentUser()?.id;
    const otherUser =
      message.senderId === myId
        ? this.contacts().find((c) => c.user.id === message.receiverId)?.user
        : this.contacts().find((c) => c.user.id === message.senderId)?.user;

    if (!otherUser) {
      this.messageService.getConversations().subscribe((conversations) => this.conversations.set(conversations));
      return;
    }

    const others = this.conversations().filter((c) => c.user.id !== otherUser.id);
    this.conversations.set([{ user: otherUser, lastMessage: message }, ...others]);
  }

  sendMessage(): void {
    const content = this.newMessageContent().trim();
    const receiver = this.selectedUser();
    if (!content || !receiver) {
      return;
    }

    this.socket.sendMessage(receiver.id, content);
    this.newMessageContent.set('');
  }

  onTyping(): void {
    const receiver = this.selectedUser();
    if (receiver) {
      this.socket.sendTyping(receiver.id);
    }
  }

  isMine(message: Message): boolean {
    return message.senderId === this.auth.currentUser()?.id;
  }

  isUnread(contact: Contact): boolean {
    const myId = this.auth.currentUser()?.id;
    return !!contact.lastMessage && contact.lastMessage.receiverId === myId && !contact.lastMessage.read;
  }
}
