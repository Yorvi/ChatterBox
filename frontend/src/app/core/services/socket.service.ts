import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message } from '../models/message.model';

export interface FriendRequestNotification {
  requestId: number;
  from: { id: number; username: string };
}

export interface FriendRequestAcceptedNotification {
  requestId: number;
  by: { id: number; username: string };
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;

  readonly messageNew = new Subject<Message>();
  readonly messageSent = new Subject<Message>();
  readonly messageTyping = new Subject<{ senderId: number }>();
  readonly messageRead = new Subject<{ messageId: number }>();
  readonly friendRequest = new Subject<FriendRequestNotification>();
  readonly friendRequestAccepted = new Subject<FriendRequestAcceptedNotification>();

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(environment.socketUrl, { auth: { token } });

    this.socket.on('message:new', (payload: Message) => this.messageNew.next(payload));
    this.socket.on('message:sent', (payload: Message) => this.messageSent.next(payload));
    this.socket.on('message:typing', (payload: { senderId: number }) => this.messageTyping.next(payload));
    this.socket.on('message:read', (payload: { messageId: number }) => this.messageRead.next(payload));
    this.socket.on('notification:friendRequest', (payload: FriendRequestNotification) =>
      this.friendRequest.next(payload)
    );
    this.socket.on('notification:friendRequestAccepted', (payload: FriendRequestAcceptedNotification) =>
      this.friendRequestAccepted.next(payload)
    );
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  sendMessage(receiverId: number, content: string): void {
    this.socket?.emit('message:send', { receiverId, content });
  }

  sendTyping(receiverId: number): void {
    this.socket?.emit('message:typing', { receiverId });
  }

  markRead(messageId: number): void {
    this.socket?.emit('message:read', { messageId });
  }
}
