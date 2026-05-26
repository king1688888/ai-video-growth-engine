/**
 * Credit Service Tests
 * Authority: D19
 *
 * Tests:
 * 1. Registration bonus grant
 * 2. Credit estimation
 * 3. Hold idempotency
 * 4. Capture idempotency
 * 5. Refund on failure
 * 6. Balance cannot go negative
 * 7. Partial settlement
 */

import { CreditService, REGISTRATION_BONUS_CREDITS } from '../../packages/billing/src/credit-service';

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`);
}

async function testRegistrationBonus() {
  const service = new CreditService();
  await service.grantRegistrationBonus('user1');
  const balance = service.getBalance('user1');
  assert(balance.balance === REGISTRATION_BONUS_CREDITS, `Expected ${REGISTRATION_BONUS_CREDITS}, got ${balance.balance}`);
}

async function testCreditEstimation() {
  const service = new CreditService();
  assert(service.estimateCredits(30000) === 8, 'Short video should cost 8 credits');
  assert(service.estimateCredits(180000) === 12, 'Max duration should cost 12 credits');
}

async function testHoldIdempotency() {
  const service = new CreditService();
  await service.grantRegistrationBonus('user1');
  
  const tx1 = await service.holdCredits({ taskId: 't1', userId: 'user1', amount: 10, idempotencyKey: 'hold_t1' });
  const tx2 = await service.holdCredits({ taskId: 't1', userId: 'user1', amount: 10, idempotencyKey: 'hold_t1' });
  
  // Same idempotency key = same transaction returned
  assert(tx1.id === tx2.id, 'Idempotent hold should return same transaction');
  
  // Balance should only be affected once
  const balance = service.getBalance('user1');
  assert(balance.frozen === 10, `Expected frozen=10, got ${balance.frozen}`);
}

async function testCaptureIdempotency() {
  const service = new CreditService();
  await service.grantRegistrationBonus('user1');
  await service.holdCredits({ taskId: 't1', userId: 'user1', amount: 10, idempotencyKey: 'hold_t1' });
  
  const tx1 = await service.captureCredits({ taskId: 't1', userId: 'user1', amount: 10, idempotencyKey: 'capture_t1' });
  const tx2 = await service.captureCredits({ taskId: 't1', userId: 'user1', amount: 10, idempotencyKey: 'capture_t1' });
  
  assert(tx1.id === tx2.id, 'Idempotent capture should return same transaction');
  const balance = service.getBalance('user1');
  assert(balance.balance === 40, `Expected balance=40, got ${balance.balance}`);
}

async function testRefundOnFailure() {
  const service = new CreditService();
  await service.grantRegistrationBonus('user1');
  await service.holdCredits({ taskId: 't1', userId: 'user1', amount: 10, idempotencyKey: 'hold_t1' });
  
  await service.refundCredits({ taskId: 't1', userId: 'user1', amount: 10, reason: 'Task failed', idempotencyKey: 'refund_t1' });
  
  const balance = service.getBalance('user1');
  assert(balance.frozen === 0, `Expected frozen=0, got ${balance.frozen}`);
  assert(balance.balance === 50, `Expected balance=50 (refunded), got ${balance.balance}`);
}

async function testBalanceCannotGoNegative() {
  const service = new CreditService();
  await service.grantRegistrationBonus('user1');
  
  try {
    await service.holdCredits({ taskId: 't1', userId: 'user1', amount: 100, idempotencyKey: 'hold_too_much' });
    assert(false, 'Should have thrown CREDIT_INSUFFICIENT_BALANCE');
  } catch (e: any) {
    assert(e.message === 'CREDIT_INSUFFICIENT_BALANCE', `Expected CREDIT_INSUFFICIENT_BALANCE, got ${e.message}`);
  }
}

async function testCompensation() {
  const service = new CreditService();
  await service.grantRegistrationBonus('user1');
  await service.compensate('user1', 20, 'Service disruption', 'comp_001');
  
  const balance = service.getBalance('user1');
  assert(balance.balance === 70, `Expected 70, got ${balance.balance}`);
}

// Run all tests
async function runAll() {
  await testRegistrationBonus();
  await testCreditEstimation();
  await testHoldIdempotency();
  await testCaptureIdempotency();
  await testRefundOnFailure();
  await testBalanceCannotGoNegative();
  await testCompensation();
  console.log('All billing tests passed! (7/7)');
}

runAll().catch(e => { console.error(e); process.exit(1); });
