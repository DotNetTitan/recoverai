'use client';
import { AI_STATUS_MESSAGES } from '@/utils/constants';

interface AiStatusProps {
  error: string | null;
  loading?: boolean;
  loadingClassName?: string;
  skeletonClassName?: string;
  skeletonHeight?: number;
  skeletonWidth?: string;
  supportText?: string;
}

export function AiStatus({
  error,
  loading = false,
  loadingClassName,
  skeletonClassName,
  skeletonHeight = 80,
  skeletonWidth = '100%',
  supportText = AI_STATUS_MESSAGES.LOADING,
}: AiStatusProps) {
  if (loading) {
    return (
      <div className={loadingClassName} aria-live="polite" aria-busy="true">
        <div className={skeletonClassName}>
          <div
            className="skeleton"
            style={{ height: skeletonHeight, width: skeletonWidth }}
          />
        </div>
        <span className="sr-only">{supportText}</span>
      </div>
    );
  }

  if (!error) return null;

  return (
    <div className="card" role="alert" aria-live="assertive">
      <p>{error}</p>
    </div>
  );
}
