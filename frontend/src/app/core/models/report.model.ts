export type ReportTargetType = 'post' | 'comment' | 'user';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface Report {
  id: number;
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  reporterId: number;
  reporter?: { id: number; username: string };
}
