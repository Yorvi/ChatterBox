import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    @if (photoUrl) {
      <img class="avatar" [style.width.px]="size" [style.height.px]="size" [src]="photoUrl" alt="" />
    } @else {
      <div
        class="avatar placeholder"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.fontSize.px]="size / 2"
      >
        {{ initial }}
      </div>
    }
  `,
  styles: [
    `
      .avatar {
        border-radius: 50%;
        object-fit: cover;
        display: inline-block;
        flex-shrink: 0;
      }

      .placeholder {
        background: #5c6bc0;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }
    `,
  ],
})
export class AvatarComponent {
  @Input() username = '';
  @Input() photoUrl: string | null | undefined;
  @Input() size = 40;

  get initial(): string {
    return this.username ? this.username[0].toUpperCase() : '?';
  }
}
