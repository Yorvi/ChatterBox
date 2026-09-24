import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment, Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  getPosts(page = 1, limit = 20): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`, { params: { page, limit } });
  }

  createPost(content: string, mediaUrl?: string): Observable<Post> {
    return this.http.post<Post>(`${environment.apiUrl}/posts`, { content, mediaUrl });
  }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${environment.apiUrl}/posts/${postId}`);
  }

  deletePost(postId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/posts/${postId}`);
  }

  like(postId: number): Observable<{ liked: boolean; likeCount: number }> {
    return this.http.post<{ liked: boolean; likeCount: number }>(
      `${environment.apiUrl}/posts/${postId}/like`,
      {}
    );
  }

  unlike(postId: number): Observable<{ liked: boolean; likeCount: number }> {
    return this.http.delete<{ liked: boolean; likeCount: number }>(
      `${environment.apiUrl}/posts/${postId}/like`
    );
  }

  addComment(postId: number, content: string, parentId?: number): Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiUrl}/comments`, { postId, content, parentId });
  }
}
