import type { Metadata } from 'next';
import { ImageGenerator } from '@/components/image-editor/ImageGenerator';

export const metadata: Metadata = {
  title: 'SCIENCE to IMG',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ImgGenPage() {
  return (
    <div className="px-4">
			<section className="py-4 text-gray-900 tracking-tight leading-none flex flex-col">
				<h1 className="text-3xl font-bold text-center">
					SCIENCE to IMG
				</h1>
				<div className="text-xs font-light my-1 flex-1">
					
				</div>
			</section>
      <ImageGenerator />
    </div>
  );
}