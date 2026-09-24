import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FriendRequest } from '../models/friend-request.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class FriendService {
  constructor(private http: HttpClient) {}

  sendRequest(receiverId: number): Observable<FriendRequest> {
    return this.http.post<FriendRequest>(`${environment.apiUrl}/friend-requests`, { receiverId });
  }

  respond(requestId: number, action: 'accept' | 'reject'): Observable<FriendRequest> {
    return this.http.put<FriendRequest>(`${environment.apiUrl}/friend-requests/${requestId}`, { action });
  }

  listPending(): Observable<FriendRequest[]> {
    return this.http.get<FriendRequest[]>(`${environment.apiUrl}/friend-requests/pending`);
  }

  listFriends(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/friend-requests/friends`);
  }
}
