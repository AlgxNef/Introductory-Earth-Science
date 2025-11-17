import type { Metadata } from 'next';
import Link from 'next/link';
// ★★★ ステップ1で作成したクライアントコンポーネントをインポート ★★★
import GeoscienceEducationAnalysis from '@/components/AboutChart';

// サーバーコンポーネントなので、metadataをエクスポートできる
export const metadata: Metadata = {
  title: 'このサイトについて',
};

// ページ本体 (サーバーコンポーネント)
export default function AboutPage() {
  return (
    <article className="prose lg:prose-xl max-w-none">
			<GeoscienceEducationAnalysis />
    </article>
  );
}