'use client';

import { useState } from 'react';

/**
 * Admin Console - Operations Dashboard
 * Authority: D06 (P15-P17), D22 (Ops Admin)
 * Test ID: admin-page
 *
 * Tabs: Tasks, Users, Costs, Reviews, Complaints, Audit
 * All data masked per D18 RBAC rules.
 */

type Tab = 'tasks' | 'users' | 'costs' | 'reviews' | 'complaints' | 'audit' | 'health';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'tasks', label: '任务管理' },
    { key: 'users', label: '用户查询' },
    { key: 'costs', label: '模型成本' },
    { key: 'reviews', label: '人工复核' },
    { key: 'complaints', label: '投诉处理' },
    { key: 'audit', label: '审计日志' },
    { key: 'health', label: '系统健康' },
  ];

  return (
    <main data-testid="admin-page" className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">运营后台</h1>

        {/* Tab Navigation */}
        <nav className="flex gap-1 mb-6 bg-white rounded-lg shadow p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              data-testid={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded text-sm ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'tasks' && (
            <section data-testid="admin-tasks">
              <h2 className="text-lg font-semibold mb-4">任务列表</h2>
              {/* TODO: Fetch from adminListTasks, show status/cost/risk */}
              <p className="text-gray-500">加载中...</p>
            </section>
          )}

          {activeTab === 'users' && (
            <section data-testid="admin-users">
              <h2 className="text-lg font-semibold mb-4">用户列表</h2>
              {/* NOTE: Email/IP masked per D18 */}
              <p className="text-gray-500 text-sm">⚠️ 敏感信息已按权限脱敏</p>
            </section>
          )}

          {activeTab === 'costs' && (
            <section data-testid="admin-costs">
              <h2 className="text-lg font-semibold mb-4">模型成本统计</h2>
              {/* TODO: Show total cost, per-task cost, margin */}
              <p className="text-gray-500">加载中...</p>
            </section>
          )}

          {activeTab === 'reviews' && (
            <section data-testid="admin-reviews">
              <h2 className="text-lg font-semibold mb-4">人工复核工单</h2>
              {/* TODO: Show pending reviews with approve/reject actions */}
              <p className="text-gray-500">暂无待复核工单</p>
            </section>
          )}

          {activeTab === 'complaints' && (
            <section data-testid="admin-complaints">
              <h2 className="text-lg font-semibold mb-4">投诉处理</h2>
              {/* TODO: Show complaints with investigate/confirm/reject actions */}
              <p className="text-gray-500">暂无投诉</p>
            </section>
          )}

          {activeTab === 'audit' && (
            <section data-testid="admin-audit">
              <h2 className="text-lg font-semibold mb-4">审计日志</h2>
              {/* TODO: Show audit log entries with filters */}
              <p className="text-gray-500">加载中...</p>
            </section>
          )}

          {activeTab === 'health' && (
            <section data-testid="admin-health">
              <h2 className="text-lg font-semibold mb-4">系统健康状态</h2>
              {/* TODO: Show /health and /ready results */}
              <p className="text-gray-500">检查中...</p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
