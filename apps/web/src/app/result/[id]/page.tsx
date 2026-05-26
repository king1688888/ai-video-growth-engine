'use client';

/**
 * Result Page - Analysis Report + Deliverables
 * Authority: D06 (P10), D07, D09, D21 (AIGC Label)
 * Test ID: result-page
 *
 * Shows: Report, Content DNA, Scripts, Titles, Covers, Video Prompts
 * Enforces: AIGC label, risk status, export control
 */

export default function ResultPage({ params }: { params: { id: string } }) {
  // TODO: Fetch from apiClient.getReport(params.id) and apiClient.getDeliverables(params.id)
  const riskLevel = 'R0_PASS'; // From API
  const aigcLabeled = true;
  const canExport = riskLevel === 'R0_PASS' && aigcLabeled;

  return (
    <main data-testid="result-page" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* AIGC Label - ALWAYS visible per D21 */}
        <div data-testid="aigc-label" className="bg-blue-50 border border-blue-200 rounded p-3 mb-6 text-sm text-blue-700">
          🤖 本内容由 AI 辅助生成（AIGC），仅供参考。请结合自身情况使用。
        </div>

        <h1 className="text-2xl font-bold mb-6">视频拆解分析报告</h1>

        {/* Risk Warning if applicable */}
        {riskLevel !== 'R0_PASS' && (
          <div data-testid="risk-warning" className="bg-orange-50 border border-orange-200 rounded p-4 mb-6">
            <p className="font-semibold text-orange-700">⚠️ 风控提示</p>
            <p className="text-sm text-orange-600">部分内容存在风险，请注意修改后使用。</p>
          </div>
        )}

        {/* Report Section */}
        <section data-testid="report-section" className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">📊 拆解报告</h2>
          <div className="prose max-w-none">
            {/* TODO: Render Content DNA report from API */}
            <p className="text-gray-500">加载中...</p>
          </div>
        </section>

        {/* Scripts Section */}
        <section data-testid="scripts-section" className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">✍️ 原创脚本（5条）</h2>
          {/* TODO: Render 5 scripts from deliverables */}
          <p className="text-gray-500">加载中...</p>
        </section>

        {/* Titles Section */}
        <section data-testid="titles-section" className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">📝 标题建议（10条）</h2>
          <p className="text-gray-500">加载中...</p>
        </section>

        {/* Cover Suggestions */}
        <section data-testid="covers-section" className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">🎨 封面建议（3条）</h2>
          <p className="text-gray-500">加载中...</p>
        </section>

        {/* Video Prompts */}
        <section data-testid="video-prompts-section" className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">🎬 视频生成 Prompt（3条）</h2>
          <p className="text-gray-500">加载中...</p>
        </section>

        {/* Quality Score */}
        <section data-testid="quality-section" className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">⭐ 质量评分</h2>
          <p className="text-gray-500">加载中...</p>
        </section>

        {/* Export Button - ONLY if risk passed AND AIGC labeled */}
        <div className="sticky bottom-6">
          {canExport ? (
            <button
              data-testid="export-btn"
              className="w-full py-3 bg-green-600 text-white rounded-lg shadow-lg"
            >
              📥 导出报告（Markdown）
            </button>
          ) : (
            <div data-testid="export-blocked" className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg text-center">
              {!aigcLabeled ? '⚠️ AIGC 标识缺失，无法导出' : '⚠️ 风控未通过，无法导出'}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
