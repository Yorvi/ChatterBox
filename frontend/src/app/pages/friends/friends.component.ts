import { Component, OnInit, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../core/services/user.service';
import { FriendService } from '../../core/services/friend.service';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { User } from '../../core/models/user.model';
import { FriendRequest } from '../../core/models/friend-request.model';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [
    RouterLink,
    MatTabsModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AvatarComponent,
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent implements OnInit {
  readonly loading = signal(true);
  readonly allUsers = signal<User[]>([]);
  readonly pendingRequests = signal<FriendRequest[]>([]);
  readonly friends = signal<User[]>([]);
  readonly sentRequestIds = signal<Set<number>>(new Set());

  readonly friendIds = computed(() => new Set(this.friends().map((f) => f.id)));
  readonly people = computed(() => {
    const myId = this.auth.currentUser()?.id;
    const friendIds = this.friendIds();
    return this.allUsers().filter((u) => u.id !== myId && !friendIds.has(u.id));
  });

  constructor(
    private userService: UserService,
    private friendService: FriendService,
    private router: Router,
    private snackBar: MatSnackBar,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading.set(true);
    this.userService.getAllUsers().subscribe((users) => this.allUsers.set(users));
    this.friendService.listPending().subscribe((requests) => this.pendingRequests.set(requests));
    this.friendService.listFriends().subscribe({
      next: (friends) => {
        this.friends.set(friends);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  hasSentRequest(userId: number): boolean {
    return this.sentRequestIds().has(userId);
  }

  sendRequest(user: User): void {
    this.friendService.sendRequest(user.id).subscribe({
      next: () => {
        this.sentRequestIds.set(new Set([...this.sentRequestIds(), user.id]));
        this.snackBar.open(`Friend request sent to ${user.username}`, 'Dismiss', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Could not send friend request.', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  respond(request: FriendRequest, action: 'accept' | 'reject'): void {
    this.friendService.respond(request.id, action).subscribe(() => {
      this.pendingRequests.set(this.pendingRequests().filter((r) => r.id !== request.id));
      if (action === 'accept' && request.sender) {
        this.friends.set([...this.friends(), request.sender]);
      }
    });
  }

  messageFriend(user: User): void {
    this.router.navigate(['/messages'], { queryParams: { with: user.id } });
  }
}
