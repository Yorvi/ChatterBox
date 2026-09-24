import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Report, ReportTargetType } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  createReport(targetType: ReportTargetType, targetId: number, reason: string): Observable<Report> {
    return this.http.post<Report>(`${environment.apiUrl}/reports`, { targetType, targetId, reason });
  }
}
