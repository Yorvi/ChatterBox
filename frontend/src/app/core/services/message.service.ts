import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Conversation, Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor(private http: HttpClient) {}

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${environment.apiUrl}/messages`);
  }

  getConversation(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/messages/${userId}`);
  }
}
