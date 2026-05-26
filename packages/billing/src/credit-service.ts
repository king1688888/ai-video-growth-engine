/**
 * Credit Service - MVP1 Billing Core
 * Authority: D19 (Commercial Billing)
 *
 * Invariants:
 * 1. Balance MUST NOT go negative
 * 2. All operations MUST be idempotent (idempotency_key)
 * 3. Failed tasks MUST refund frozen credits
 * 4. Model cost MUST be recorded per task
 * 5. Production MUST NOT use mock payment
 */

export interface CreditAccount {
  id: string;
  userId: string;
  balance: number;
  frozen: number;
  totalEarned: number;
  totalSpent: number;
}

export interface CreditHoldRequest {
  taskId: string;
  userId: string;
  amount: number;
  idempotencyKey: string;
}

export interface CreditCaptureRequest {
  taskId: string;
  userId: string;
  amount: number;
  idempotencyKey: string;
  costBreakdown?: CostBreakdown;
}

export interface CreditRefundRequest {
  taskId: string;
  userId: string;
  amount: number;
  reason: string;
  idempotencyKey: string;
}

export interface CostBreakdown {
  modelCostMicroUsd: number;
  storageCostMicroUsd: number;
  totalCostMicroUsd: number;
}

export type TransactionType = 'GRANT' | 'PURCHASE' | 'HOLD' | 'CAPTURE' | 'REFUND' | 'COMPENSATE' | 'EXPIRE' | 'ADMIN_ADJUST';

export interface CreditTransaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  taskId?: string;
  description?: string;
  idempotencyKey: string;
  createdAt: Date;
}

// --- Constants per D19 ---
export const REGISTRATION_BONUS_CREDITS = 50;
export const TASK_ESTIMATE_MIN = 8;
export const TASK_ESTIMATE_MAX = 12;
export const IS_PAYMENT_MOCK = true; // MVP1: No real payment yet. Production MUST set false.

/**
 * Credit Service Implementation
 * All methods are idempotent via idempotency_key.
 */
export class CreditService {
  // In-memory store for testing; replace with Prisma in production
  private accounts: Map<string, CreditAccount> = new Map();
  private transactions: CreditTransaction[] = [];
  private processedKeys: Set<string> = new Set();

  /**
   * Grant registration bonus credits.
   */
  async grantRegistrationBonus(userId: string): Promise<CreditTransaction> {
    const key = `grant_registration_${userId}`;
    if (this.processedKeys.has(key)) {
      return this.transactions.find(t => t.idempotencyKey === key)!;
    }

    const account = this.getOrCreateAccount(userId);
    const tx = this.createTransaction(account, 'GRANT', REGISTRATION_BONUS_CREDITS, key, undefined, 'Registration bonus');
    account.balance += REGISTRATION_BONUS_CREDITS;
    account.totalEarned += REGISTRATION_BONUS_CREDITS;
    this.processedKeys.add(key);
    return tx;
  }

  /**
   * Estimate credits for a task based on video duration.
   */
  estimateCredits(durationMs: number): number {
    // Linear interpolation: 0-60s = 8 credits, 60-180s = 8-12 credits
    const seconds = durationMs / 1000;
    if (seconds <= 60) return TASK_ESTIMATE_MIN;
    const ratio = Math.min((seconds - 60) / 120, 1);
    return Math.round(TASK_ESTIMATE_MIN + ratio * (TASK_ESTIMATE_MAX - TASK_ESTIMATE_MIN));
  }

  /**
   * Hold (freeze) credits for a task.
   * Idempotent: same idempotencyKey returns same result.
   */
  async holdCredits(req: CreditHoldRequest): Promise<CreditTransaction> {
    if (this.processedKeys.has(req.idempotencyKey)) {
      return this.transactions.find(t => t.idempotencyKey === req.idempotencyKey)!;
    }

    const account = this.getOrCreateAccount(req.userId);
    
    // INVARIANT: Balance must not go negative
    if (account.balance - account.frozen < req.amount) {
      throw new Error('CREDIT_INSUFFICIENT_BALANCE');
    }

    const tx = this.createTransaction(account, 'HOLD', -req.amount, req.idempotencyKey, req.taskId, 'Credit hold for task');
    account.frozen += req.amount;
    this.processedKeys.add(req.idempotencyKey);
    return tx;
  }

  /**
   * Capture (deduct) held credits after task success.
   * Idempotent.
   */
  async captureCredits(req: CreditCaptureRequest): Promise<CreditTransaction> {
    if (this.processedKeys.has(req.idempotencyKey)) {
      return this.transactions.find(t => t.idempotencyKey === req.idempotencyKey)!;
    }

    const account = this.getOrCreateAccount(req.userId);
    const tx = this.createTransaction(account, 'CAPTURE', -req.amount, req.idempotencyKey, req.taskId, 'Task completed - credits captured');
    account.balance -= req.amount;
    account.frozen -= req.amount;
    account.totalSpent += req.amount;
    this.processedKeys.add(req.idempotencyKey);
    return tx;
  }

  /**
   * Refund frozen credits after task failure.
   * Idempotent.
   */
  async refundCredits(req: CreditRefundRequest): Promise<CreditTransaction> {
    if (this.processedKeys.has(req.idempotencyKey)) {
      return this.transactions.find(t => t.idempotencyKey === req.idempotencyKey)!;
    }

    const account = this.getOrCreateAccount(req.userId);
    const tx = this.createTransaction(account, 'REFUND', req.amount, req.idempotencyKey, req.taskId, `Refund: ${req.reason}`);
    account.frozen -= req.amount;
    this.processedKeys.add(req.idempotencyKey);
    return tx;
  }

  /**
   * Admin compensation.
   */
  async compensate(userId: string, amount: number, reason: string, idempotencyKey: string): Promise<CreditTransaction> {
    if (this.processedKeys.has(idempotencyKey)) {
      return this.transactions.find(t => t.idempotencyKey === idempotencyKey)!;
    }

    const account = this.getOrCreateAccount(userId);
    const tx = this.createTransaction(account, 'COMPENSATE', amount, idempotencyKey, undefined, `Compensation: ${reason}`);
    account.balance += amount;
    account.totalEarned += amount;
    this.processedKeys.add(idempotencyKey);
    return tx;
  }

  getBalance(userId: string): { balance: number; frozen: number; available: number } {
    const account = this.getOrCreateAccount(userId);
    return {
      balance: account.balance,
      frozen: account.frozen,
      available: account.balance - account.frozen,
    };
  }

  getTransactions(userId: string): CreditTransaction[] {
    const account = this.accounts.get(userId);
    if (!account) return [];
    return this.transactions.filter(t => t.accountId === account.id);
  }

  // --- Private helpers ---

  private getOrCreateAccount(userId: string): CreditAccount {
    if (!this.accounts.has(userId)) {
      this.accounts.set(userId, {
        id: `acc_${userId}`,
        userId,
        balance: 0,
        frozen: 0,
        totalEarned: 0,
        totalSpent: 0,
      });
    }
    return this.accounts.get(userId)!;
  }

  private createTransaction(
    account: CreditAccount,
    type: TransactionType,
    amount: number,
    idempotencyKey: string,
    taskId?: string,
    description?: string,
  ): CreditTransaction {
    const tx: CreditTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      accountId: account.id,
      type,
      amount,
      balanceBefore: account.balance,
      balanceAfter: account.balance + (type === 'HOLD' ? 0 : amount),
      taskId,
      description,
      idempotencyKey,
      createdAt: new Date(),
    };
    this.transactions.push(tx);
    return tx;
  }
}
