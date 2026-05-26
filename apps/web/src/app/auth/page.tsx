'use client';

import { useState } from 'react';

/**
 * Auth Page - Login/Register
 * Authority: D06 (P00-P02)
 * Test ID: auth-page
 */
export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // TODO: Call apiClient.login or apiClient.register
      // On success: redirect to /onboarding or /workspace
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main data-testid="auth-page" className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === 'login' ? '登录' : '注册'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            data-testid="email-input"
            type="email" placeholder="邮箱" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border rounded" required
          />
          <input
            data-testid="password-input"
            type="password" placeholder="密码" value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border rounded" required
          />

          {error && <p data-testid="error-message" className="text-red-500 text-sm">{error}</p>}

          <button
            data-testid="submit-btn"
            type="submit" disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          {mode === 'login' ? '没有账号？' : '已有账号？'}
          <button
            data-testid="toggle-mode"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-600 ml-1"
          >
            {mode === 'login' ? '注册' : '登录'}
          </button>
        </p>
      </div>
    </main>
  );
}
