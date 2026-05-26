/**
 * Core shared types per D16 API contract.
 */

/** Unified API response wrapper */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiMeta {
  request_id: string;
  timestamp: string;
  next_cursor?: string;
}

/** Task status enum per D17 */
export enum VideoAnalysisTaskStatus {
  DRAFT = 'DRAFT',
  CREATED = 'CREATED',
  AWAITING_UPLOAD = 'AWAITING_UPLOAD',
  UPLOADED = 'UPLOADED',
  CONSENT_CONFIRMED = 'CONSENT_CONFIRMED',
  PRECHECK_BLOCKED = 'PRECHECK_BLOCKED',
  QUOTED = 'QUOTED',
  CREDIT_HELD = 'CREDIT_HELD',
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  WAITING_RETRY = 'WAITING_RETRY',
  DEGRADED_RUNNING = 'DEGRADED_RUNNING',
  WAITING_MANUAL_REVIEW = 'WAITING_MANUAL_REVIEW',
  BLOCKED_RISK = 'BLOCKED_RISK',
  PARTIAL_SUCCEEDED = 'PARTIAL_SUCCEEDED',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED',
  DELETED = 'DELETED',
}

/** Task step status per D17 */
export enum TaskStepStatus {
  PENDING = 'PENDING',
  SKIPPED = 'SKIPPED',
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  HEARTBEAT_LOST = 'HEARTBEAT_LOST',
  SUCCEEDED = 'SUCCEEDED',
  DEGRADED = 'DEGRADED',
  FAILED_RETRYABLE = 'FAILED_RETRYABLE',
  FAILED_FINAL = 'FAILED_FINAL',
  BLOCKED = 'BLOCKED',
  CANCELED = 'CANCELED',
  WAITING_MANUAL_REVIEW = 'WAITING_MANUAL_REVIEW',
}

/** Risk level per D21 */
export enum RiskLevel {
  R0_PASS = 'R0_PASS',
  R1_WARN = 'R1_WARN',
  R2_AUTO_REWRITE = 'R2_AUTO_REWRITE',
  R3_MANUAL_REVIEW = 'R3_MANUAL_REVIEW',
  R4_BLOCK = 'R4_BLOCK',
  R5_BLOCK_SANCTION = 'R5_BLOCK_SANCTION',
}
