import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  updateProfile(
    id: number,
    changes: { bio?: string | null; profilePhoto?: string | null; coverPhoto?: string | null }
  ): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${id}`, changes);
  }
}
