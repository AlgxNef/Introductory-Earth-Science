import type { Metadata } from 'next';
import Link from 'next/link';
import GeoscienceEducationAnalysis from '@/components/AboutChart';

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