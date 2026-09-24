import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient) {}

  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${environment.apiUrl}/comments/${id}`);
  }
}
