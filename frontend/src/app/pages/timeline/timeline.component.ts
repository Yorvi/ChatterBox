import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostService } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';
import { Comment, Post } from '../../core/models/post.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements OnInit {
  readonly posts = signal<Post[]>([]);
  readonly loading = signal(true);
  readonly posting = signal(false);
  readonly newPostContent = signal('');

  readonly expandedPostIds = signal<Set<number>>(new Set());
  readonly commentsByPost = signal<Record<number, Comment[]>>({});
  readonly newCommentByPost = signal<Record<number, string>>({});

  constructor(
    private postService: PostService,
    readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  submitPost(): void {
    const content = this.newPostContent().trim();
    if (!content) {
      return;
    }

    this.posting.set(true);
    this.postService.createPost(content).subscribe({
      next: () => {
        this.newPostContent.set('');
        this.posting.set(false);
        this.loadPosts();
      },
      error: () => this.posting.set(false),
    });
  }

  deletePost(post: Post): void {
    this.postService.deletePost(post.id).subscribe(() => {
      this.posts.set(this.posts().filter((p) => p.id !== post.id));
    });
  }

  canDelete(post: Post): boolean {
    const user = this.auth.currentUser();
    return !!user && (user.id === post.userId || user.role === 'admin');
  }

  toggleLike(post: Post): void {
    const action = post.liked ? this.postService.unlike(post.id) : this.postService.like(post.id);
    action.subscribe((res) => {
      this.posts.set(
        this.posts().map((p) => (p.id === post.id ? { ...p, liked: res.liked, likeCount: res.likeCount } : p))
      );
    });
  }

  isExpanded(postId: number): boolean {
    return this.expandedPostIds().has(postId);
  }

  toggleComments(post: Post): void {
    const expanded = new Set(this.expandedPostIds());
    if (expanded.has(post.id)) {
      expanded.delete(post.id);
      this.expandedPostIds.set(expanded);
      return;
    }

    expanded.add(post.id);
    this.expandedPostIds.set(expanded);

    if (!this.commentsByPost()[post.id]) {
      this.commentsByPost.set({ ...this.commentsByPost(), [post.id]: post.comments ?? [] });
    }
  }

  commentsFor(postId: number): Comment[] {
    return this.commentsByPost()[postId] ?? [];
  }

  newCommentFor(postId: number): string {
    return this.newCommentByPost()[postId] ?? '';
  }

  setNewComment(postId: number, value: string): void {
    this.newCommentByPost.set({ ...this.newCommentByPost(), [postId]: value });
  }

  submitComment(post: Post): void {
    const content = this.newCommentFor(post.id).trim();
    if (!content) {
      return;
    }

    this.postService.addComment(post.id, content).subscribe((comment) => {
      this.commentsByPost.set({
        ...this.commentsByPost(),
        [post.id]: [...this.commentsFor(post.id), comment],
      });
      this.setNewComment(post.id, '');
      this.posts.set(
        this.posts().map((p) =>
          p.id === post.id ? { ...p, commentCount: (p.commentCount ?? 0) + 1 } : p
        )
      );
    });
  }
}
