/**
 * API Client - Frontend ↔ Backend communication layer
 * Authority: D16 (API Contract)
 *
 * All API calls go through this client.
 * Handles: auth headers, error mapping, response unwrapping.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { request_id: string; timestamp: string; next_cursor?: string };
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) { this.token = token; }
  clearToken() { this.token = null; }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return res.json();
  }

  // --- Auth ---
  async register(email: string, password: string, displayName?: string) {
    return this.request<{ accessToken: string }>('POST', '/auth/register', { email, password, displayName });
  }
  async login(email: string, password: string) {
    return this.request<{ accessToken: string; refreshToken: string }>('POST', '/auth/login', { email, password });
  }
  async getMe() { return this.request<any>('GET', '/auth/me'); }

  // --- Profile ---
  async createProfile(data: any) { return this.request<any>('POST', '/profiles', data); }
  async getProfile(id: string) { return this.request<any>('GET', `/profiles/${id}`); }
  async updateProfile(id: string, data: any) { return this.request<any>('PATCH', `/profiles/${id}`, data); }

  // --- Asset ---
  async getUploadUrl(fileName: string, mimeType: string, sizeBytes: number) {
    return this.request<{ assetId: string; uploadUrl: string }>('POST', '/assets/upload-url', { fileName, mimeType, sizeBytes });
  }
  async confirmUpload(assetId: string) {
    return this.request<any>('POST', '/assets/confirm', { assetId });
  }

  // --- Task ---
  async createTask(sourceAssetId: string, profileId: string, idempotencyKey?: string) {
    return this.request<any>('POST', '/tasks', { sourceAssetId, profileId, idempotencyKey });
  }
  async getTask(id: string) { return this.request<any>('GET', `/tasks/${id}`); }
  async getTaskProgress(id: string) { return this.request<any>('GET', `/tasks/${id}/progress`); }
  async cancelTask(id: string) { return this.request<any>('POST', `/tasks/${id}/cancel`); }
  async listTasks(cursor?: string) { return this.request<any[]>('GET', `/tasks${cursor ? `?cursor=${cursor}` : ''}`); }

  // --- Billing ---
  async getBalance() { return this.request<{ balance: number; frozen: number }>('GET', '/billing/balance'); }
  async estimateCredits(sourceAssetId: string) { return this.request<{ estimatedCredits: number }>('POST', '/billing/estimate', { sourceAssetId }); }
  async getTransactions() { return this.request<any[]>('GET', '/billing/transactions'); }

  // --- Report ---
  async getReport(taskId: string) { return this.request<any>('GET', `/tasks/${taskId}/report`); }
  async getDeliverables(taskId: string) { return this.request<any>('GET', `/tasks/${taskId}/deliverables`); }

  // --- Export ---
  async createExport(taskId: string, format?: string) {
    return this.request<any>('POST', '/exports', { taskId, format });
  }
  async getExport(id: string) { return this.request<any>('GET', `/exports/${id}`); }

  // --- Admin ---
  async adminListTasks(status?: string) { return this.request<any[]>('GET', `/admin/tasks${status ? `?status=${status}` : ''}`); }
  async adminListUsers() { return this.request<any[]>('GET', '/admin/users'); }
  async adminGetCosts() { return this.request<any>('GET', '/admin/costs'); }
  async adminCompensate(userId: string, amount: number, reason: string, idempotencyKey: string) {
    return this.request<any>('POST', '/admin/compensate', { userId, amount, reason, idempotencyKey });
  }
  async adminListReviews(status?: string) { return this.request<any[]>('GET', `/admin/reviews${status ? `?status=${status}` : ''}`); }
  async adminResolveReview(id: string, decision: string, notes?: string) {
    return this.request<any>('PATCH', `/admin/reviews/${id}`, { decision, notes });
  }
  async adminGetAuditLogs(resource?: string) { return this.request<any[]>('GET', `/admin/audit-logs${resource ? `?resource=${resource}` : ''}`); }
}

export const apiClient = new ApiClient();
export default apiClient;
