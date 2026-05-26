/**
 * Structured log context fields.
 * Every log entry should include these fields for traceability.
 *
 * Fields per D23/D17:
 * - request_id: unique per HTTP request
 * - trace_id: propagated across async jobs
 * - task_id: VideoAnalysisTask ID (when applicable)
 * - user_id: authenticated user
 * - organization_id: user's org
 */
export interface LogContext {
  request_id?: string;
  trace_id?: string;
  task_id?: string;
  user_id?: string;
  organization_id?: string;
  module?: string;
  action?: string;
}

export function formatLog(level: string, message: string, context: LogContext = {}): string {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  });
}
