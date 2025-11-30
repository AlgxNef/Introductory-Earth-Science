import React, { useEffect, useState, useMemo } from 'react';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';

// MathJaxの初期化（一度だけ実行）
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const texInput = new TeX({ packages: AllPackages });
const svgOutput = new SVG({ fontCache: 'local' }); // 'local'にすることでパスをその場に展開
const htmlDocument = mathjax.document('', { InputJax: texInput, OutputJax: svgOutput });

interface VectorMathProps {
  latex: string;
  color?: string;
  scale?: number;
}

export const VectorMath: React.FC<VectorMathProps> = ({ latex, color = 'black', scale = 1 }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState<string>('0 0 100 100');
  const [width, setWidth] = useState<string>('100%');
  const [height, setHeight] = useState<string>('100%');

  useEffect(() => {
    try {
      // LaTeXをSVGノードに変換
      const node = htmlDocument.convert(latex, {
        display: true,
        em: 16,
        ex: 8,
        containerWidth: 80 * 16
      });

      // SVG要素自体を取得
      const svgElement = adaptor.firstChild(node) as any;
      
      if (svgElement) {
        // MathJaxが生成したSVGから属性を抽出
        const vb = adaptor.getAttribute(svgElement, 'viewBox');
        const w = adaptor.getAttribute(svgElement, 'width');
        const h = adaptor.getAttribute(svgElement, 'height');
        
        // 中身のパス（gタグ以下）を文字列として取得
        const innerHTML = adaptor.innerHTML(svgElement);
        
        setViewBox(vb);
        setWidth(w);
        setHeight(h);
        setSvgContent(innerHTML);
      }
    } catch (e) {
      console.error("MathJax Error:", e);
    }
  }, [latex]);

  if (!svgContent) return null;

  return (
    <svg
      viewBox={viewBox}
      width={width} // MathJaxが計算したサイズ
      height={height}
      style={{ 
        overflow: 'visible',
        fill: color, // 文字色
        stroke: 'none', // ★重要: 親からのstroke継承を断ち切る
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};