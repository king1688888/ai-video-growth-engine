'use client';

import { useState } from 'react';

/**
 * New Task - Upload + Consent + Credit Confirm
 * Authority: D06 (P05-P08), D21 (Consent), D19 (Billing)
 * Test ID: new-task-page
 *
 * Flow: Upload → Consent → Estimate → Confirm → Create Task
 */

type Step = 'upload' | 'consent' | 'estimate' | 'processing';

export default function NewTaskPage() {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [consents, setConsents] = useState({ upload: false, aigc: false, prohibited: false });
  const [estimatedCredits, setEstimatedCredits] = useState(0);
  const [error, setError] = useState('');
  const [taskId, setTaskId] = useState('');

  const allConsentsConfirmed = consents.upload && consents.aigc && consents.prohibited;

  return (
    <main data-testid="new-task-page" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">视频拆解分析</h1>

        {/* Step Indicator */}
        <div data-testid="step-indicator" className="flex gap-2 mb-8">
          {['upload', 'consent', 'estimate', 'processing'].map(s => (
            <div key={s} className={`flex-1 h-2 rounded ${step === s ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === 'upload' && (
          <section data-testid="upload-step" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">上传视频</h2>
            <p className="text-sm text-gray-500 mb-4">支持 MP4/MOV/WebM，最大 200MB，最长 3 分钟</p>
            <input
              data-testid="file-input"
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="block w-full"
            />
            {file && (
              <div className="mt-4">
                <p className="text-sm">文件: {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)</p>
                <button
                  data-testid="next-to-consent"
                  onClick={() => setStep('consent')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
                >
                  下一步：授权确认
                </button>
              </div>
            )}
          </section>
        )}

        {/* Step 2: Consent (per D21) */}
        {step === 'consent' && (
          <section data-testid="consent-step" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">授权确认</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  data-testid="consent-upload"
                  type="checkbox" checked={consents.upload}
                  onChange={e => setConsents({ ...consents, upload: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm">我确认上传的视频为合法获取，仅用于学习其内容结构，不用于搬运、复制或侵权用途。</span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  data-testid="consent-aigc"
                  type="checkbox" checked={consents.aigc}
                  onChange={e => setConsents({ ...consents, aigc: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm">我了解系统生成的内容为 AI 辅助创作（AIGC），将标注 AIGC 标识，我将对最终使用负责。</span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  data-testid="consent-prohibited"
                  type="checkbox" checked={consents.prohibited}
                  onChange={e => setConsents({ ...consents, prohibited: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm">我了解本系统不提供搬运、克隆、仿脸、仿声、洗稿能力，不会用于上述目的。</span>
              </label>
            </div>
            <button
              data-testid="next-to-estimate"
              onClick={() => setStep('estimate')}
              disabled={!allConsentsConfirmed}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              下一步：积分预估
            </button>
          </section>
        )}

        {/* Step 3: Credit Estimate (per D19) */}
        {step === 'estimate' && (
          <section data-testid="estimate-step" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">积分预估</h2>
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p>预估消耗: <span data-testid="estimated-credits" className="font-bold text-blue-600">{estimatedCredits || 10} 积分</span></p>
              <p className="text-sm text-gray-500 mt-1">实际消耗根据视频时长和模型调用确定</p>
            </div>
            <button
              data-testid="confirm-and-start"
              onClick={() => { setStep('processing'); /* TODO: Call createTask API */ }}
              className="px-6 py-2 bg-green-600 text-white rounded"
            >
              确认并开始分析
            </button>
          </section>
        )}

        {/* Step 4: Processing (redirect to progress page) */}
        {step === 'processing' && (
          <section data-testid="processing-step" className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">任务已创建</h2>
            <p className="text-gray-500">正在处理中，请稍候...</p>
            <a href={`/task/${taskId || 'demo'}/progress`} className="mt-4 inline-block text-blue-600">
              查看进度 →
            </a>
          </section>
        )}

        {error && <p data-testid="error-message" className="mt-4 text-red-500">{error}</p>}
      </div>
    </main>
  );
}
