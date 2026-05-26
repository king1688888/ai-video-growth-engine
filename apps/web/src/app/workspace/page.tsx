'use client';

/**
 * Workspace - Main dashboard after login
 * Authority: D06 (P04)
 * Test ID: workspace-page
 *
 * Shows: credit balance, recent tasks, quick actions
 */
export default function WorkspacePage() {
  return (
    <main data-testid="workspace-page" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">工作台</h1>
          <div data-testid="credit-balance" className="text-sm bg-white px-4 py-2 rounded shadow">
            积分余额: <span className="font-bold">--</span>
          </div>
        </header>

        {/* Quick Action */}
        <section className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">开始分析</h2>
          <a
            data-testid="new-task-btn"
            href="/task/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            上传视频 · 开始拆解
          </a>
        </section>

        {/* Recent Tasks */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">最近任务</h2>
          <div data-testid="task-list-empty" className="text-gray-400 text-center py-8">
            暂无任务，上传视频开始第一次拆解
          </div>
          {/* TODO: Render task list from API */}
        </section>
      </div>
    </main>
  );
}
