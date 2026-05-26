/**
 * Core shared types per D16/D17/D21 API contract.
 * These mirror Prisma enums for use in frontend and workers.
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
  total?: number;
}

/** User roles */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
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

/** Asset status per D17 */
export enum AssetStatus {
  PENDING_UPLOAD = 'PENDING_UPLOAD',
  UPLOADED = 'UPLOADED',
  SCANNING = 'SCANNING',
  AVAILABLE = 'AVAILABLE',
  PROCESSING = 'PROCESSING',
  DERIVED = 'DERIVED',
  GENERATED = 'GENERATED',
  QUARANTINED = 'QUARANTINED',
  BLOCKED = 'BLOCKED',
  PUBLISHED = 'PUBLISHED',
  EXPORT_READY = 'EXPORT_READY',
  EXPIRE_SCHEDULED = 'EXPIRE_SCHEDULED',
  DELETING = 'DELETING',
  DELETED = 'DELETED',
  TOMBSTONED = 'TOMBSTONED',
  FAILED = 'FAILED',
}

/** Asset type */
export enum AssetType {
  VIDEO_RAW = 'VIDEO_RAW',
  VIDEO_PROXY = 'VIDEO_PROXY',
  AUDIO = 'AUDIO',
  FRAME = 'FRAME',
  THUMBNAIL = 'THUMBNAIL',
  TRANSCRIPT = 'TRANSCRIPT',
  OCR_RESULT = 'OCR_RESULT',
  EVIDENCE_PACK = 'EVIDENCE_PACK',
  CONTENT_DNA_JSON = 'CONTENT_DNA_JSON',
  CREATIVE_IR_JSON = 'CREATIVE_IR_JSON',
  DELIVERABLE_PACK_JSON = 'DELIVERABLE_PACK_JSON',
  REPORT_EXPORT = 'REPORT_EXPORT',
  SYSTEM_INTERNAL = 'SYSTEM_INTERNAL',
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

/** Review status */
export enum ReviewStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ESCALATED = 'ESCALATED',
  CLOSED = 'CLOSED',
}

/** Credit transaction type per D19 */
export enum CreditTransactionType {
  GRANT = 'GRANT',
  PURCHASE = 'PURCHASE',
  HOLD = 'HOLD',
  CAPTURE = 'CAPTURE',
  REFUND = 'REFUND',
  COMPENSATE = 'COMPENSATE',
  EXPIRE = 'EXPIRE',
  ADMIN_ADJUST = 'ADMIN_ADJUST',
}

/** Export status */
export enum ExportStatus {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  READY = 'READY',
  DOWNLOADED = 'DOWNLOADED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

/** Prompt run status */
export enum PromptRunStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
}

/** Model call status */
export enum ModelCallStatus {
  PENDING = 'PENDING',
  CALLING = 'CALLING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',
}
