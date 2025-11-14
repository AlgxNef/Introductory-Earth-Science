'use client';

import Image from 'next/image';
import parse, { domToReact, Element } from 'html-react-parser';

interface MarkdownRendererProps {
  htmlString: string;
}

export const MarkdownRenderer = ({ htmlString }: MarkdownRendererProps) => {
  const options = {
    replace: (domNode: any) => {
      // domNodeがimg要素でない場合は何もしない
      if (domNode instanceof Element && domNode.tagName === 'img') {
        const { src, alt } = domNode.attribs;

        // Next.jsのImageコンポーネントに置き換える
        // widthとheightは必須だが、動的に取得するのは難しいためfillモードを使う
        return (
          <div className="relative my-6 overflow-hidden rounded-lg shadow-md" style={{ aspectRatio: '16 / 9' }}>
            <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit: 'contain' }} // or 'cover'
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        );
      }
    },
  };

  return <>{parse(htmlString, options)}</>;
};