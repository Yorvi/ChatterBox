import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Report, ReportStatus } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${environment.apiUrl}/admin/reports`);
  }

  resolveReport(reportId: number, status: Extract<ReportStatus, 'resolved' | 'dismissed'>): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${environment.apiUrl}/admin/reports/${reportId}`, { status });
  }

  deletePost(postId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/admin/posts/${postId}`);
  }

  deleteComment(commentId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/admin/comments/${commentId}`);
  }

  deleteUser(userId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/admin/users/${userId}`);
  }
}
