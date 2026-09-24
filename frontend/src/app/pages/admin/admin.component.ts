import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../core/services/admin.service';
import { PostService } from '../../core/services/post.service';
import { CommentService } from '../../core/services/comment.service';
import { UserService } from '../../core/services/user.service';
import { Report, ReportStatus } from '../../core/models/report.model';

interface PreviewState {
  status: 'loading' | 'loaded' | 'error';
  text?: string;
  authorUsername?: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DatePipe, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private postService = inject(PostService);
  private commentService = inject(CommentService);
  private userService = inject(UserService);
  private snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly reports = signal<Report[]>([]);
  readonly expandedId = signal<number | null>(null);
  readonly previews = signal<Record<number, PreviewState>>({});

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading.set(true);
    this.adminService.getReports().subscribe({
      next: (reports) => {
        this.reports.set(reports);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  togglePreview(report: Report): void {
    if (this.expandedId() === report.id) {
      this.expandedId.set(null);
      return;
    }
    this.expandedId.set(report.id);

    if (this.previews()[report.id]) {
      return;
    }

    this.previews.set({ ...this.previews(), [report.id]: { status: 'loading' } });
    const onError = () => this.previews.set({ ...this.previews(), [report.id]: { status: 'error' } });

    if (report.targetType === 'post') {
      this.postService.getPostById(report.targetId).subscribe({
        next: (post) =>
          this.previews.set({
            ...this.previews(),
            [report.id]: { status: 'loaded', text: post.content, authorUsername: post.author?.username },
          }),
        error: onError,
      });
    } else if (report.targetType === 'comment') {
      this.commentService.getCommentById(report.targetId).subscribe({
        next: (comment) =>
          this.previews.set({
            ...this.previews(),
            [report.id]: { status: 'loaded', text: comment.content, authorUsername: comment.author?.username },
          }),
        error: onError,
      });
    } else {
      this.userService.getUserById(report.targetId).subscribe({
        next: (user) =>
          this.previews.set({
            ...this.previews(),
            [report.id]: { status: 'loaded', authorUsername: user.username },
          }),
        error: onError,
      });
    }
  }

  isExpanded(report: Report): boolean {
    return this.expandedId() === report.id;
  }

  previewFor(reportId: number): PreviewState | undefined {
    return this.previews()[reportId];
  }

  resolve(report: Report, status: Extract<ReportStatus, 'resolved' | 'dismissed'>): void {
    this.adminService.resolveReport(report.id, status).subscribe(() => {
      this.reports.set(this.reports().map((r) => (r.id === report.id ? { ...r, status } : r)));
    });
  }

  deleteTarget(report: Report): void {
    if (!confirm(`Delete this ${report.targetType}? This cannot be undone.`)) {
      return;
    }

    const request$ =
      report.targetType === 'post'
        ? this.adminService.deletePost(report.targetId)
        : report.targetType === 'comment'
          ? this.adminService.deleteComment(report.targetId)
          : this.adminService.deleteUser(report.targetId);

    request$.subscribe({
      next: () => {
        this.adminService.resolveReport(report.id, 'resolved').subscribe(() => {
          this.reports.set(
            this.reports().map((r) => (r.id === report.id ? { ...r, status: 'resolved' } : r))
          );
        });
        this.snackBar.open(`${report.targetType} deleted.`, 'Dismiss', { duration: 3000 });
      },
      error: (err) =>
        this.snackBar.open(err.error?.message ?? `Could not delete ${report.targetType}.`, 'Dismiss', {
          duration: 3000,
        }),
    });
  }
}
