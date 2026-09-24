import { Component, DestroyRef, OnInit, WritableSignal, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../core/services/user.service';
import { FriendService } from '../../core/services/friend.service';
import { AuthService } from '../../core/services/auth.service';
import { ReportService } from '../../core/services/report.service';
import { UploadService, validateUploadFile } from '../../core/services/upload.service';
import { AvatarComponent } from '../../shared/avatar/avatar.component';
import { ReportDialogComponent } from '../../shared/report-dialog/report-dialog.component';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    AvatarComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private friendService = inject(FriendService);
  private reportService = inject(ReportService);
  private uploadService = inject(UploadService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  readonly auth = inject(AuthService);

  readonly loading = signal(true);
  readonly profile = signal<User | null>(null);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly isFriend = signal(false);
  readonly requestSent = signal(false);
  readonly uploadingProfilePhoto = signal(false);
  readonly uploadingCoverPhoto = signal(false);

  readonly isOwnProfile = computed(() => this.profile()?.id === this.auth.currentUser()?.id);

  readonly form = this.fb.group({
    bio: [''],
    profilePhoto: [''],
    coverPhoto: [''],
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadProfile(id);
      }
    });
  }

  private loadProfile(id: number): void {
    this.loading.set(true);
    this.editing.set(false);
    this.requestSent.set(false);

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.profile.set(user);
        this.form.patchValue({
          bio: user.bio ?? '',
          profilePhoto: user.profilePhoto ?? '',
          coverPhoto: user.coverPhoto ?? '',
        });
        this.loading.set(false);
        if (id !== this.auth.currentUser()?.id) {
          this.checkFriendStatus(id);
        }
      },
      error: () => this.loading.set(false),
    });
  }

  private checkFriendStatus(id: number): void {
    this.friendService.listFriends().subscribe((friends) => {
      this.isFriend.set(friends.some((f) => f.id === id));
    });
  }

  startEditing(): void {
    this.editing.set(true);
  }

  cancelEditing(): void {
    const user = this.profile();
    if (user) {
      this.form.patchValue({
        bio: user.bio ?? '',
        profilePhoto: user.profilePhoto ?? '',
        coverPhoto: user.coverPhoto ?? '',
      });
    }
    this.editing.set(false);
  }

  onProfilePhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    this.uploadPhoto(file, 'profilePhoto', this.uploadingProfilePhoto);
    (event.target as HTMLInputElement).value = '';
  }

  onCoverPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }
    this.uploadPhoto(file, 'coverPhoto', this.uploadingCoverPhoto);
    (event.target as HTMLInputElement).value = '';
  }

  private uploadPhoto(file: File, controlName: 'profilePhoto' | 'coverPhoto', uploading: WritableSignal<boolean>): void {
    const validationError = validateUploadFile(file);
    if (validationError) {
      this.snackBar.open(validationError, 'Dismiss', { duration: 4000 });
      return;
    }

    uploading.set(true);
    this.uploadService.uploadFile(file).subscribe({
      next: (res) => {
        this.form.patchValue({ [controlName]: res.url });
        uploading.set(false);
      },
      error: (err) => {
        uploading.set(false);
        this.snackBar.open(err.error?.message ?? 'Upload failed.', 'Dismiss', { duration: 4000 });
      },
    });
  }

  save(): void {
    const user = this.profile();
    if (!user) {
      return;
    }

    this.saving.set(true);
    const { bio, profilePhoto, coverPhoto } = this.form.getRawValue();

    this.userService.updateProfile(user.id, { bio, profilePhoto, coverPhoto }).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.auth.updateStoredUser(updated);
        this.editing.set(false);
        this.saving.set(false);
        this.snackBar.open('Profile updated', 'Dismiss', { duration: 3000 });
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('Could not update profile.', 'Dismiss', { duration: 3000 });
      },
    });
  }

  sendFriendRequest(): void {
    const user = this.profile();
    if (!user) {
      return;
    }

    this.friendService.sendRequest(user.id).subscribe({
      next: () => {
        this.requestSent.set(true);
        this.snackBar.open(`Friend request sent to ${user.username}`, 'Dismiss', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Could not send friend request.', 'Dismiss', {
          duration: 3000,
        });
      },
    });
  }

  messageUser(): void {
    const user = this.profile();
    if (user) {
      this.router.navigate(['/messages'], { queryParams: { with: user.id } });
    }
  }

  reportUser(): void {
    const user = this.profile();
    if (!user) {
      return;
    }

    this.dialog
      .open(ReportDialogComponent, { data: { targetLabel: `${user.username}` } })
      .afterClosed()
      .subscribe((reason?: string) => {
        if (!reason) {
          return;
        }
        this.reportService.createReport('user', user.id, reason).subscribe({
          next: () => this.snackBar.open('User reported. Thanks for letting us know.', 'Dismiss', { duration: 3000 }),
          error: (err) =>
            this.snackBar.open(err.error?.message ?? 'Could not submit report.', 'Dismiss', { duration: 3000 }),
        });
      });
  }
}
