import type { Metadata } from 'next';
import { ImageGenerator } from '@/components/image-editor/ImageGenerator';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'SCIENCE to IMG',
  robots: {
    index: false,
    follow: false,
  },
};

// ローディング中に表示するシンプルなプレースホルダー
// スケルトンUIではなく、タイトルだけを表示する形にします
const LoadingFallback = () => {
  return (
    <div className="p-4 text-center text-gray-500">
      エディタを読み込んでいます...
    </div>
  );
};


export default function ImgGenPage() {
  return (
    <div className="h-full bg-white text-black">
      <Suspense fallback={<LoadingFallback />}>
        <ImageGenerator />
      </Suspense>

    </div>
  );
}