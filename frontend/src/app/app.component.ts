import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './core/services/auth.service';
import { SocketService } from './core/services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private destroyRef = inject(DestroyRef);

  constructor(
    readonly auth: AuthService,
    private socket: SocketService,
    private snackBar: MatSnackBar
  ) {
    this.socket.friendRequest.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((notification) => {
      this.snackBar.open(`${notification.from.username} sent you a friend request`, 'View', {
        duration: 5000,
      });
    });

    this.socket.friendRequestAccepted.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((notification) => {
      this.snackBar.open(`${notification.by.username} accepted your friend request`, 'Dismiss', {
        duration: 5000,
      });
    });
  }
}
