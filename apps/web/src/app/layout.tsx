export const metadata = {
  title: 'AI 短视频爆款增长引擎',
  description: 'AI-Powered Short Video Growth Engine - MVP1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
