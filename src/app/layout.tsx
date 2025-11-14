import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { getTableOfContents } from '@/lib/posts';
import { TableOfContents } from '@/components/TableOfContents';
import 'katex/dist/katex.min.css';
import { newCM10, newCMMath } from './fonts';

// --- ★★★ 1. サイトのメタデータを新しいものに更新 ★★★ ---
export const metadata: Metadata = {
  title: {
    default: '理系地学入門',
    template: '%s｜理系地学入門',
  },
  // 長い方の説明文
  description: 'Webで読める理系地学に関わる知識本。物理・化学の法則をもとに、広大なスケールと先人の知恵を線でつなぎます。',
  openGraph: {
    title: '理系地学集成',
    // SNSシェア用には短い方の説明文
    description: 'Webで読める理系地学に関わる知識本。物理・化学の法則をもとに、広大なスケールと先人の知恵を線でつなぎます。',
    url: 'https://i-earth.pages.dev/',
		icons: {
			icon: '/favicon.ico', // publicフォルダからのパス
		},
    siteName: '理系地学入門',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tocData = getTableOfContents();

  return (
    <html lang="ja" className={`${newCM10.variable} ${newCMMath.variable}`}>
      <body>
        <div className="flex">
          <aside className="w-80 h-screen p-4 border-r fixed overflow-y-auto bg-gray-50">
            {/* --- ★★★ 2. サイドバーのタイトルを新しいものに更新 ★★★ --- */}
            <div className="mb-6 pb-4 border-b">
              <Link href="/" className="group">
                <h1 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  理系地学入門
                </h1>
              </Link>
            </div>
            <TableOfContents tocData={tocData} />
          </aside>

          <main className="ml-80 flex-1 p0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}