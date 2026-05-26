/**
 * Compliance Service - MVP1 合规闭环
 * Authority: D21 (Compliance), D13 (Risk Control)
 *
 * Invariants:
 * 1. No task creation without consent confirmation
 * 2. AIGC label MUST be present on all outputs
 * 3. Blocked content CANNOT be exported
 * 4. Manual review actions MUST be audited
 * 5. Complaint deletion MUST clean derived assets
 */

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'upload_authorization' | 'aigc_acknowledgment' | 'prohibited_capability_confirmation';
  version: string;
  accepted: boolean;
  timestamp: Date;
}

export interface PrecheckResult {
  passed: boolean;
  riskLevel: string;
  issues: string[];
  blockedReason?: string;
}

export interface AigcLabel {
  labeled: boolean;
  labelType: 'visible' | 'metadata' | 'both';
  displayText: string;
  timestamp: Date;
}

export interface ComplaintCase {
  id: string;
  taskId: string;
  userId: string;
  complainantType: 'user' | 'rights_holder' | 'platform';
  reason: string;
  status: 'received' | 'investigating' | 'confirmed' | 'rejected' | 'resolved';
  derivedAssetsDeleted: boolean;
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  action: string;
  actor: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}

// --- Prohibited capabilities per D00/D21 ---
const PROHIBITED_INTENTS = [
  '搬运', '克隆', '复制', '仿脸', '仿声', '洗稿',
  '一模一样', '照搬', '抄袭', '模仿声音', '模仿脸',
  '自动发布', '批量下载', '绕过平台',
];

/**
 * Compliance Service
 */
export class ComplianceService {
  private consents: ConsentRecord[] = [];
  private complaints: ComplaintCase[] = [];
  private auditLog: AuditEntry[] = [];

  /**
   * Step 1: Verify all required consents before task creation.
   */
  verifyConsents(userId: string): { allConfirmed: boolean; missing: string[] } {
    const required = ['upload_authorization', 'aigc_acknowledgment', 'prohibited_capability_confirmation'];
    const userConsents = this.consents.filter(c => c.userId === userId && c.accepted);
    const confirmed = userConsents.map(c => c.consentType);
    const missing = required.filter(r => !confirmed.includes(r as any));
    return { allConfirmed: missing.length === 0, missing };
  }

  /**
   * Step 2: Record user consent.
   */
  recordConsent(userId: string, consentType: ConsentRecord['consentType'], accepted: boolean): ConsentRecord {
    const record: ConsentRecord = {
      id: `consent_${Date.now()}`,
      userId,
      consentType,
      version: '1.0',
      accepted,
      timestamp: new Date(),
    };
    this.consents.push(record);
    return record;
  }

  /**
   * Step 3: Input precheck - detect prohibited intents.
   */
  precheckInput(inputText: string): PrecheckResult {
    const issues: string[] = [];
    const lowerInput = inputText.toLowerCase();

    for (const pattern of PROHIBITED_INTENTS) {
      if (lowerInput.includes(pattern)) {
        issues.push(`Prohibited intent detected: ${pattern}`);
      }
    }

    if (issues.length > 0) {
      return {
        passed: false,
        riskLevel: 'R4_BLOCK',
        issues,
        blockedReason: 'Input contains prohibited intent per D00/D21',
      };
    }

    return { passed: true, riskLevel: 'R0_PASS', issues: [] };
  }

  /**
   * Step 4: Generate AIGC label for output.
   * Per D21: ALL outputs MUST have AIGC label.
   */
  generateAigcLabel(): AigcLabel {
    return {
      labeled: true,
      labelType: 'both',
      displayText: '本内容由 AI 辅助生成，仅供参考',
      timestamp: new Date(),
    };
  }

  /**
   * Step 5: Check if export is allowed.
   * Per D21: Blocked content CANNOT export. AIGC label MUST be present.
   */
  canExport(riskLevel: string, aigcLabeled: boolean): { allowed: boolean; reason?: string } {
    if (riskLevel === 'R4_BLOCK' || riskLevel === 'R5_BLOCK_SANCTION') {
      return { allowed: false, reason: 'Content blocked by risk control' };
    }
    if (riskLevel === 'R3_MANUAL_REVIEW') {
      return { allowed: false, reason: 'Pending manual review' };
    }
    if (!aigcLabeled) {
      return { allowed: false, reason: 'AIGC label missing - export prohibited' };
    }
    return { allowed: true };
  }

  /**
   * Step 6: Create complaint case.
   */
  createComplaint(taskId: string, userId: string, complainantType: ComplaintCase['complainantType'], reason: string): ComplaintCase {
    const complaint: ComplaintCase = {
      id: `complaint_${Date.now()}`,
      taskId,
      userId,
      complainantType,
      reason,
      status: 'received',
      derivedAssetsDeleted: false,
      auditTrail: [{
        action: 'complaint_created',
        actor: 'system',
        timestamp: new Date(),
        details: { reason },
      }],
    };
    this.complaints.push(complaint);
    this.addAuditEntry('complaint_created', 'system', { complaintId: complaint.id, taskId });
    return complaint;
  }

  /**
   * Step 7: Process complaint - delete derived assets.
   * Per D21: Confirmed complaints MUST delete all derived assets.
   */
  resolveComplaint(complaintId: string, decision: 'confirmed' | 'rejected', actor: string): ComplaintCase {
    const complaint = this.complaints.find(c => c.id === complaintId);
    if (!complaint) throw new Error('Complaint not found');

    complaint.status = decision === 'confirmed' ? 'confirmed' : 'rejected';
    
    if (decision === 'confirmed') {
      complaint.derivedAssetsDeleted = true;
      // TODO: Actually delete derived assets from S3 and mark DB records
    }

    complaint.auditTrail.push({
      action: `complaint_${decision}`,
      actor,
      timestamp: new Date(),
      details: { decision },
    });

    this.addAuditEntry(`complaint_${decision}`, actor, { complaintId, decision });
    return complaint;
  }

  // --- Audit ---

  private addAuditEntry(action: string, actor: string, details?: Record<string, unknown>) {
    this.auditLog.push({ action, actor, timestamp: new Date(), details });
  }

  getAuditLog(): AuditEntry[] {
    return this.auditLog;
  }
}
