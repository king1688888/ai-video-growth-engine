/**
 * Shared constants per D03/D16/D17
 */

/** Video upload constraints */
export const VIDEO_MAX_SIZE_BYTES = 200 * 1024 * 1024; // 200MB
export const VIDEO_MAX_DURATION_SECONDS = 180; // 3 minutes
export const VIDEO_ALLOWED_MIMES = ['video/mp4', 'video/quicktime', 'video/webm'];

/** Signed URL expiry */
export const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour

/** Credit defaults */
export const CREDIT_REGISTRATION_BONUS = 50;
export const CREDIT_TASK_ESTIMATE_MIN = 8;
export const CREDIT_TASK_ESTIMATE_MAX = 12;

/** Queue names per D17 */
export const QUEUES = {
  TASK_ORCHESTRATE: 'task.orchestrate',
  VIDEO_METADATA: 'video.metadata',
  VIDEO_NORMALIZE: 'video.normalize',
  VIDEO_AUDIO: 'video.audio',
  VIDEO_ASR: 'video.asr',
  VIDEO_FRAMES: 'video.frames',
  VIDEO_OCR: 'video.ocr',
  VIDEO_SHOTS: 'video.shots',
  AI_EVIDENCE_PACK: 'ai.evidence_pack',
  AI_VIDEO_UNDERSTANDING: 'ai.video_understanding',
  AI_CONTENT_DNA: 'ai.content_dna',
  AI_CREATIVE_IR: 'ai.creative_ir',
  AI_DELIVERABLES: 'ai.deliverables',
  RISK_QUALITY: 'risk.quality',
  RISK_SIMILARITY: 'risk.similarity',
  RISK_COMPLIANCE: 'risk.compliance',
  RISK_DECISION: 'risk.decision',
  BILLING_SETTLE: 'billing.settle',
  EXPORT_GENERATE: 'export.generate',
  ASSET_LIFECYCLE: 'asset.lifecycle',
  ADMIN_MANUAL_REVIEW: 'admin.manual_review',
  DEAD_LETTER: 'dead_letter',
} as const;

/** Feature flags */
export const FEATURE_FLAGS = {
  VIDEO_LINK_INPUT: false, // P1, not MVP1
  VIDEO_GENERATION: false, // MVP3
  AUTO_PUBLISH: false, // Never in MVP1
  BATCH_ANALYSIS: false, // MVP2
} as const;
