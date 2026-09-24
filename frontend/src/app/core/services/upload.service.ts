import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024; // must match backend/src/middlewares/upload.js
export const ALLOWED_UPLOAD_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${environment.apiUrl}/uploads`, formData);
  }
}

// Checked client-side too so the user gets instant feedback instead of waiting
// on a round trip - the backend enforces the same rules regardless.
export function validateUploadFile(file: File): string | null {
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, GIF, or WEBP images are allowed.';
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return 'Image must be 5MB or smaller.';
  }
  return null;
}
