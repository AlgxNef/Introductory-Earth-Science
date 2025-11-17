import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { getTableOfContents } from '@/lib/posts';
import { TableOfContents } from '@/components/TableOfContents';
import 'katex/dist/katex.min.css';
import { newCM10, newCMMath } from './fonts';
import Image from 'next/image';

// --- ★★★ 1. サイトのメタデータを新しいものに更新 ★★★ ---
export const metadata: Metadata = {
  title: {
    default: '理系地学入門',
    template: '%s｜理系地学入門',
  },
  // 長い方の説明文
  description: 'Webで読める理系地学に関わる知識本。物理・化学の法則をもとに、広大なスケールと先人の知恵を線でつなぎます。',
		icons: {
			icon: [
				{ url: '/icon/LogoWhite.svg', type: 'image/svg+xml' }
			],
		},
  openGraph: {
    title: '理系地学入門',
    // SNSシェア用には短い方の説明文
    description: 'Webで読める理系地学の知識本。物理・化学の法則をもとに、広大なスケールと先人の知恵を線でつなぎます。',
    url: 'https://i-earth.pages.dev/',
    siteName: '理系地学入門',
    locale: 'ja_JP',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tocData = getTableOfContents();
  return (
    <html lang="ja" className={`${newCM10.variable} ${newCMMath.variable}`}>
      <body className="text-black bg-white">
        <div className="flex">
          <aside className="absolute w-80 h-screen border-r fixed overflow-y-auto bg-gray-50 print:hidden">
            <div className="relative sticky top-0 p-2 border-b border-black bg-slate-700 text-white">
              <Link href="/" className="group">
                <div className="">
                  <h1 className="text-2xl font-semibold text-white text-center hover:font-bold transition-all duration-300">理系地学入門</h1>
                </div>
              </Link>
            </div>
            <TableOfContents tocData={tocData} />
            <nav className="relative sticky bottom-0 px-3 py-1 border-t border-black text-right">
              <ul>
                <li className="mt-1">
                  <Link href="/about" className="text-gray-600 hover:text-blue-600">
                    このサイトについて
                  </Link>
                </li>
                <li className="mt-1">
                  <Link href="/how-to-use" className="text-gray-600 hover:text-blue-600">
                    サイトの使い方
                  </Link>
                </li>
                <li className="mt-1">
                  <Link href="/references" className="text-gray-600 hover:text-blue-600">
                    引用ポリシー
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="ml-80 print:m-0 flex-1 p0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}