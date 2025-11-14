'use client';

import { useEffect } from 'react';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

// コンポーネントが脚注データを受け取るように変更
interface FootnoteHandlerProps {
  footnotes: Record<string, string>;
}

export const FootnoteHandler = ({ footnotes }: FootnoteHandlerProps) => {
  useEffect(() => {
    // 脚注データが空なら何もしない
    if (Object.keys(footnotes).length === 0) {
      return;
    }

    // 脚注参照リンク (<sup><a>...</a></sup>) を探す
    const footnoteRefs = document.querySelectorAll('a[data-footnote-ref]');

    footnoteRefs.forEach((ref) => {
      // リンクのhrefからキーを取得 (例: #user-content-fn-1)
      const href = ref.getAttribute('href');
      if (!href) return;
      
      // キーを整形 (例: "1")
      const key = href.split('-').pop();
      if (!key) return;
      
      // footnotesオブジェクトから対応するコンテンツを取得
      const content = footnotes[key];
      if (!content) return;

      // Tippy.jsを初期化
      tippy(ref, {
        content: content, // サーバーから渡されたテキストをそのまま表示
        allowHTML: true,
        interactive: true,
        theme: 'light-border',
        placement: 'bottom',
      });
    });
  }, [footnotes]); // footnotesデータが変わったら再実行

  return null;
};