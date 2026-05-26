/**
 * Compliance Service Tests
 * Authority: D21
 *
 * Tests:
 * 1. Consent verification
 * 2. Input precheck blocks prohibited intents
 * 3. AIGC label generation
 * 4. Export blocked for risk content
 * 5. Export blocked without AIGC label
 * 6. Complaint creation and resolution
 */

import { ComplianceService } from '../../packages/risk/src/compliance-service';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

function testConsentVerification() {
  const service = new ComplianceService();
  
  // No consents = not confirmed
  const result1 = service.verifyConsents('user1');
  assert(!result1.allConfirmed, 'Should not be confirmed without consents');
  assert(result1.missing.length === 3, 'Should have 3 missing consents');
  
  // Record all consents
  service.recordConsent('user1', 'upload_authorization', true);
  service.recordConsent('user1', 'aigc_acknowledgment', true);
  service.recordConsent('user1', 'prohibited_capability_confirmation', true);
  
  const result2 = service.verifyConsents('user1');
  assert(result2.allConfirmed, 'Should be confirmed after all consents');
}

function testInputPrecheckBlocks() {
  const service = new ComplianceService();
  
  // Prohibited intents should be blocked
  const blocked = service.precheckInput('帮我克隆这个视频');
  assert(!blocked.passed, 'Clone intent should be blocked');
  assert(blocked.riskLevel === 'R4_BLOCK', 'Should be R4_BLOCK');
  
  // Legitimate intent should pass
  const passed = service.precheckInput('分析这个视频的结构，帮我生成原创脚本');
  assert(passed.passed, 'Legitimate intent should pass');
  assert(passed.riskLevel === 'R0_PASS', 'Should be R0_PASS');
}

function testAigcLabel() {
  const service = new ComplianceService();
  const label = service.generateAigcLabel();
  assert(label.labeled === true, 'Must be labeled');
  assert(label.labelType === 'both', 'Must be both visible and metadata');
}

function testExportBlockedForRisk() {
  const service = new ComplianceService();
  
  // Blocked content cannot export
  const result1 = service.canExport('R4_BLOCK', true);
  assert(!result1.allowed, 'Blocked content must not export');
  
  // Manual review pending cannot export
  const result2 = service.canExport('R3_MANUAL_REVIEW', true);
  assert(!result2.allowed, 'Manual review pending must not export');
  
  // Passed content can export
  const result3 = service.canExport('R0_PASS', true);
  assert(result3.allowed, 'Passed content should export');
}

function testExportBlockedWithoutAigcLabel() {
  const service = new ComplianceService();
  
  // No AIGC label = cannot export (even if risk passed)
  const result = service.canExport('R0_PASS', false);
  assert(!result.allowed, 'Must not export without AIGC label');
  assert(result.reason?.includes('AIGC'), 'Reason should mention AIGC');
}

function testComplaintFlow() {
  const service = new ComplianceService();
  
  // Create complaint
  const complaint = service.createComplaint('task1', 'user1', 'rights_holder', 'Copyright infringement');
  assert(complaint.status === 'received', 'Initial status should be received');
  
  // Resolve complaint - confirmed
  const resolved = service.resolveComplaint(complaint.id, 'confirmed', 'admin1');
  assert(resolved.status === 'confirmed', 'Should be confirmed');
  assert(resolved.derivedAssetsDeleted === true, 'Derived assets must be marked for deletion');
  
  // Audit trail
  assert(resolved.auditTrail.length >= 2, 'Should have audit entries');
  
  // System audit log
  const auditLog = service.getAuditLog();
  assert(auditLog.length >= 2, 'System audit log should have entries');
}

// Run all tests
testConsentVerification();
testInputPrecheckBlocks();
testAigcLabel();
testExportBlockedForRisk();
testExportBlockedWithoutAigcLabel();
testComplaintFlow();
console.log('All compliance tests passed! (6/6)');
