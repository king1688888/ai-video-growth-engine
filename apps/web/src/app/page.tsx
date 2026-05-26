export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">AI 短视频爆款增长引擎</h1>
      <p className="text-lg text-gray-600 mb-8">MVP1 - 视频拆解 + 原创脚本生成</p>
      <div className="text-sm text-gray-400">
        <p>Status: Engineering Scaffold</p>
        <p>API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}</p>
      </div>
    </main>
  );
}
