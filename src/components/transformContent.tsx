"use client"
import React from 'react';
import { useEffect } from 'react';

/**
 * 整数を丸付き文字に変換する関数
 * @param {number} number 変換したい整数 (1から20を推奨)
 * @returns {string} 丸付き文字、または変換できない場合は元の数値の文字列
 */
function convertRLetter(num: number): string {
  // 1から50までの丸文字のマッピングを定義します。
  const marumojiMap = new Map<number, string>([
    [1, '❶'], [2, '❷'], [3, '❸'], [4, '❹'], [5, '❺'],
    [6, '❻'], [7, '❼'], [8, '❽'], [9, '❾'], [10, '❿'],
    [11, '⓫'], [12, '⓬'], [13, '⓭'], [14, '⓮'], [15, '⓯'],
    [16, '⓰'], [17, '⓱'], [18, '⓲'], [19, '⓳'], [20, '⓴'],
  ]);


  const result = marumojiMap.get(num);

  if (result) {
    return result;
  } else {
    console.warn(`Warning: Number ${num} is outside the supported 1-50 range for marumoji conversion.`);
    return String(num);
  }
}
/**
 * 整数を黒丸付き文字（白抜き文字）に変換する関数
 * @param {number} number 変換したい整数 (1から50を推奨)
 * @returns {string} 黒丸付き文字、または変換できない場合は元の数値の文字列
 */
function convertBlackRLetter(num: number): string {
  // 1から50までの黒丸文字（白抜き文字）のマッピングを定義します。
  // 21以降は環境によって表示が異なる場合がある特殊文字です。
  const kuroMarumojiMap = new Map<number, string>([
    [1, '①'], [2, '②'], [3, '③'], [4, '④'], [5, '⑤'],
    [6, '⑥'], [7, '⑦'], [8, '⑧'], [9, '⑨'], [10, '⑩'],
    [11, '⑪'], [12, '⑫'], [13, '⑬'], [14, '⑭'], [15, '⑮'],
    [16, '⑯'], [17, '⑰'], [18, '⑱'], [19, '⑲'], [20, '⑳'],
    [21, '㉑'],     [22, '㉒'],    [23, '㉓'],    [24, '㉔'],    [25, '㉕'],    [26, '㉖'],    [27, '㉗'],    [28, '㉘'],    [29, '㉙'],    [30, '㉚'],
    [31, '㉛'],    [32, '㉜'],    [33, '㉝'],    [34, '㉞'],    [35, '㉟'],    [36, '㊱'],    [37, '㊲'],    [38, '㊳'],    [39, '㊴'],    [40, '㊵'],
    [41, '㊶'],    [42, '㊷'],    [43, '㊸'],    [44, '㊹'],    [45, '㊺'],    [46, '㊻'],    [47, '㊼'],    [48, '㊽'],    [49, '㊾'],    [50, '㊿'],
  ]);


  const result = kuroMarumojiMap.get(num);

  if (result) {
    return result;
  } else {
    console.warn(`Warning: Number ${num} is outside the supported 1-50 range for kuro marumoji conversion.`);
    return String(num);
  }
}


/**
 * ラベルの文字列に応じて、適切なスタイルを持つspan要素のHTMLを返します。
 * @param label ラベルの文字列 (例: "補足")
 * @returns スタイルが適用されたHTML文字列
 */
const getLabelHtml = (label: string): string => {
  const trimmedLabel = label.trim();
  switch (trimmedLabel) {
    case '補足':
      return `<span class="p-0.5 px-2 mx-1 mr-2 font-semibold text-white bg-gray-700 rounded-md">${trimmedLabel}</span>`;
    case '解説':
      return `<span class="p-0.5 px-2 mx-1 mr-2 font-semibold text-gray-800 bg-gray-200 rounded-md">${trimmedLabel}</span>`;
    case '翻訳':
      return `<span class="p-0.5 px-2 mx-1 mr-2 font-semibold text-gray-800 bg-white border-0.5-black border">${trimmedLabel}</span>`;
    case '小話':
      return `<span class="p-0.5 px-2 mx-1 mr-2 font-semibold text-gray-800 bg-gray-200 border-[0.5px] border-gray-300 rounded-sm">${trimmedLabel}</span>`;
    default:
      // 定義されていないラベルの場合は、デフォルトのスタイルを適用
      return `<span class="p-0.5 px-2 mx-1 mr-2 font-semibold text-gray-800 bg-gray-200 rounded-md">${trimmedLabel}</span>`;
  }
};

/**
 * コンテンツ内の特定のHTML構造を変換します。
 * @param content 変換対象のHTML文字列
 * @returns 変換後のHTML文字列
 */
export const transformContent = (content: string): string => {
  let transformed = content;

	// Tailwind CSS クラスの定義
	const ulClasses = "list-none list-inside space-y-1 ml-2";
	const liClasses = "";
	const numSpanClasses = "mx-2";

	// 0, 1, 2, 10: 引用・参考文献セクション全体を抽出して置き換える正規表現
	// /s フラグ (dotAll) で . が改行にもマッチするようにする
	const referenceSectionRegex = /(<h3>引用・参考文献<\/h3>\s*)<ul[^>]*>(.*?)<\/ul>/s;

	transformed = transformed.replace(referenceSectionRegex, (match, header, ulInnerContent) => {
			// 2. ulタグにtailwindでデザインを整える
			let transformedUl = `<ul class="${ulClasses}">`;

			// 3. ulの中にliタグがある場合
			// 4. それぞれのliタグの中についてtailwindでデザインを整える
			// liタグを抽出するための正規表現
			const liRegex = /<li[^>]*>(.*?)<\/li>/gs;

			const transformedLis = ulInnerContent.replace(liRegex, (liMatch: string, liInnerContent: string) => {
					let content = liInnerContent.trim();

					// 5, 6: {1}のような波カッコの中の半角数字をconvertRLetterで置き換え
					const numRegex = /^\{(\d+)\}\s*/;
					const numMatch = content.match(numRegex);

					let convertedNumberHtml = '';
					if (numMatch) {
							const num = parseInt(numMatch[1], 10);
							// 6. convertBlackRLetter(num)でそれを置き換え
							convertedNumberHtml = `<span class="${numSpanClasses}">${convertBlackRLetter(num)}</span>`;
							
							// 波カッコの部分を削除し、後ろの文字列を抽出
							content = content.substring(numMatch[0].length).trim();
					}

					// 7, 8: 後ろの文字列についてリンク処理
					// 形式: [https://example.com] のように角カッコの中に文字列がある場合はそれをリンクとする
					// 末尾の [URL] を抽出する正規表現
					const linkRegex = /\s*\[(https?:\/\/[^\]]+)\]$/; 
					const linkMatch = content.match(linkRegex);

					let linkUrl = ''; // リンクが見つからない場合のデフォルト
					let textContent = content;

					if (linkMatch) {
							// 8. 角カッコの中の文字列をリンクとして抽出
							linkUrl = linkMatch[1]; 
							// 角カッコの部分を削除したテキスト
							textContent = content.substring(0, content.length - linkMatch[0].length).trim();
					}

					// 9. 角カッコ以外の部分について<cite><a>...</a></cite>の様に囲む
					// linkUrl が空文字かどうかで適用するクラスを定義します。
					let citeLinkHtml;

					if (linkUrl) {
							// linkUrl がある場合（空文字でない）、aタグで囲む
							citeLinkHtml = `<cite class="hover:text-gray-500 not-italic inline-block text-gray-900 transition duration-150 ease-in-out">
											<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="">
															${textContent}
											</a>
							</cite>`;
					} else {
							// linkUrl が空文字の場合、aタグで囲まず、text-gray-900を適用する
							// hover:text-gray-500は含まれない
							citeLinkHtml = `<cite class="not-italic inline-block text-gray-900 transition duration-150 ease-in-out">
											${textContent}
							</cite>`;
					}



					// 4. liタグにtailwindでデザインを整える
					return `<li class="${liClasses}">${convertedNumberHtml}${citeLinkHtml}</li>`;
			});

			transformedUl += transformedLis;
			transformedUl += `</ul>`;

			// headerと変換されたulを結合して返す (10. transformedに再代入)
			return header + transformedUl;
	});

	// =================================================================
  // 変換ロジック0: <p>タグにクラスを追加
  // <p> -> <p class="mt-auto text-sm">
  // =================================================================
  transformed = transformed.replace(/<p>/g, '<p class="px-2 indent-[1em] leading-8">');
	transformed = transformed.replace(/<h3>/g, '<h3 class="py-1 px-2 my-3 text-lg bg-gray-200">');
	
  // =================================================================
  // 変換ロジック1: <h4>[数字]ラベル｜説明文</h4> を <div>...</div> に変換
  // =================================================================
  const h4Regex = /<h4>(.*?)<\/h4>/g;
  transformed = transformed.replace(h4Regex, (match, innerContent) => {
    // h4タグの中身が `[数字]ラベル｜説明文` の形式にマッチするかチェック
    const innerPattern = /^\s*\[(\d+)\]([^｜]+)｜(.*)$/;
    const partsMatch = innerContent.trim().match(innerPattern);

    if (partsMatch) {
      // partsMatchの配列: [マッチした全体, 数字, ラベル, 説明文]
      const [, numStr, label, description] = partsMatch;

      // 数字を丸文字に変換
      const num = parseInt(numStr, 10);
      const numberSpan = `<span class="relative mx-0 text-black font-[Roboto]">${convertRLetter(num)}</span>`;

      // ラベルをスタイル付きspanに変換
      const labelSpan = getLabelHtml(label);

      // 説明文をpタグで囲む
      const descriptionP = `<p class="inline-block index-0">${numberSpan}${labelSpan}${description.trim()}</p>`;

      // 全てをdivで囲んで返す
      return `<div class="bg-gray-50 px-3 m-1 ml-2 py-2">${descriptionP}</div>`;
    }

    // パターンにマッチしないh4タグは、そのまま変更せずに返す
    return match;
  });

  // =================================================================
  // 変換ロジック2: <p>内の[数字]を丸文字に変換
  // 例: <p>[1]本文</p> → <p><span class="...">❶</span>本文</p>
  // =================================================================
  transformed = transformed.replace(/(<p.*?<\/p>)/g, (pTag) => {
    // 変換ロジック1で生成されたpタグは対象外にする
    if (pTag.startsWith('<p') && pTag.endsWith('</p>')) {
        // h4から変換されたdivの中のpタグは、このロジックの対象外
        // ただし、単純なreplaceでは区別が難しいため、現状はすべてのpタグ内の[数字]を変換する
        // もしh4からの説明文pタグ内の[数字]を変換したくない場合は、より複雑なDOMパーサーが必要になります。
        return pTag.replace(/\[(\d+)\]/g, (match, number) => {
            const num = parseInt(number, 10);
            return `<span class="relative top-[-0.3em] mx-0 text-sm text-black font-[Roboto]">${convertRLetter(num)}</span>`;
        });
    }
    return pTag;
  });
	
// =================================================================
// 変換ロジック2.1: <p>, <li>, <ul> 内の[数字]を丸文字に変換（引用）
// 例: <p>[1]本文</p> → <p><span class="...">①</span>本文</p>
// 例: <li>[2]リストアイテム</li> → <li><span class="...">②</span>リストアイテム</li>
// 例: <ul><li>[3]リストアイテム</li></ul> → <ul><li><span class="...">③</span>リストアイテム</li></ul>
// =================================================================

// 対象とするタグの正規表現を定義します (p, li, ul)。大文字小文字を区別しない 'i' フラグを使用しています。
const targetTagsRegex = /(<p.*?<\/p>)/g;

transformed = transformed.replace(targetTagsRegex, (match) => {
  // マッチしたタグの内容（match）に対して、角括弧内の数字を丸文字に変換する処理を適用します。
  return match.replace(/\{(\d+)\}/g, (match, number) => {
    const num = parseInt(number, 10);
    // convertRLetter(num) は、丸文字を生成する既存の関数を想定しています。
    return `<span class="relative top-[-0.3em] mx-0 text-sm text-black font-[Roboto]">${convertBlackRLetter(num)}</span>`;
  });
});

// --- 実装開始 ---

// 1. 図版の通し番号用カウンタ
let figCounter = 1;

// 2. セクションごとの分割
// <h3>の手前で分割します
const sections = transformed.split(/(?=<h3)/g);

const processedSections = sections.map((sectionContent) => {
  // 空白のみの場合はスキップ
  if (!sectionContent.trim()) return "";

  // A. H3タグとそれ以外の本文(body)を分離する
  // 先頭が <h3...>...</h3> で始まっているかチェック
  let headerHtml = "";
  let bodyHtml = sectionContent;
  
  // 正規表現: 行頭にあるh3タグとその中身をキャプチャ($1)、それ以降を($2)とする
  const headerMatch = sectionContent.match(/^(<h3[^>]*>[\s\S]*?<\/h3>)([\s\S]*)$/i);
  
  if (headerMatch) {
    headerHtml = headerMatch[1];
    bodyHtml = headerMatch[2];
  }

  // B. 除外設定（「引用・参考文献」「画像引用元」）のチェック
  // これらの単語がヘッダーに含まれる場合、レイアウト分割せずそのまま返す
  if (headerHtml.includes("引用・参考文献") || headerHtml.includes("画像引用元") || headerHtml==="") {
    return `
      <div class="my-4">
        ${headerHtml}
        <div class="px-2 mt-4">
          ${bodyHtml}
        </div>
      </div>
    `;
  }

  // --- ここから通常セクション（70:30分割）の処理 ---

  // C. 画像の抽出処理
  const extractedImages: string[] = [];

  // 本文(bodyHtml)から画像を抜き出し、右カラム用に整形
  const contentText = bodyHtml.replace(
    /<p[^>]*>\s*<img\s+src="([^"]+)"\s+alt="([^"]+)"[^>]*>\s*<\/p>/g,
    (match, src, alt) => {
      const currentFigId = `fig-${figCounter}`;
      const currentFigNum = figCounter;
      figCounter++;

      // 右カラム用画像HTML
      const imageHtml = `
        <div class="mb-8" id="${currentFigId}">
          <img src="${src}" alt="${alt}" class="w-full h-auto border border-gray-200" />
          <div class="mt-2 text-sm text-gray-600 font-medium leading-snug">
            <span class="inline-block bg-gray-100 text-gray-800 px-1 rounded mr-1">図${currentFigNum}</span>
            ${alt}
          </div>
        </div>
      `;
      extractedImages.push(imageHtml);
      
      return ""; // 本文からは削除
    }
  );

  const rightColumnHtml = extractedImages.join("");

  // D. レイアウト構築
  // headerHtml（100%幅）の下に、flexコンテナ（70%:30%）を配置
  return `
    <div class="my-4 pb-8 last:border-0 last:pb-0">
      ${headerHtml}
      <section class="flex flex-col md:flex-row gap-6 mt-4">
        <!-- 左カラム: 本文 (70%) -->
        <div class="w-full md:w-[70%]">
          ${contentText}
        </div>
        
        <!-- 右カラム: 画像エリア (30%) -->
        <!-- 画像がなくても領域は確保（要件通り） -->
        <div class="w-full md:w-[30%] flex flex-col border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-4">
          ${rightColumnHtml}
        </div>
      </section>
    </div>
  `;
});

// 3. 文字列結合
transformed = processedSections.join("");

// 4. リンク作成 [図N] -> span
transformed = transformed.replace(
  /\[図(\d+)\]/g,
  '<span class="js-fig-ref mx-1 font-[Noto_Sans_JP] font-semibold cursor-pointer bg-gray-200 text-gray-800 px-1 rounded hover:bg-gray-300 transition-colors" data-fig-target="fig-$1">図$1</span>'
);

// 5. ホバー用Div追加
transformed += `
  <div id="fig-preview-tooltip" class="fixed z-50 pointer-events-none opacity-0 transition-opacity duration-200 bg-white p-2 border border-gray-300 shadow-xl rounded-lg w-64 hidden">
    <img id="fig-preview-img" src="" class="w-full h-auto mb-1 rounded" />
    <p id="fig-preview-caption" class="text-xs text-center font-bold text-gray-700"></p>
  </div>
`;

// --- 実装終了 ---

  return transformed;
};

/**
 * 変換されたHTML文字列を安全にレンダリングするためのコンポーネント
 * @param {{ htmlContent: string }} props
 */
export const TransformedContent: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const transformedHtml = transformContent(htmlContent);

  useEffect(() => {
    // 1. 図へのスクロール機能 (クリックイベント)
    const links = document.querySelectorAll('.js-fig-ref');
    const handleScroll = (e: Event) => {
      const targetId = (e.currentTarget as HTMLElement).dataset.figTarget;
      const targetElement = document.getElementById(targetId || '');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // 2. ホバープレビュー機能
    const tooltip = document.getElementById('fig-preview-tooltip');
    const tooltipImg = document.getElementById('fig-preview-img') as HTMLImageElement;
    const tooltipCap = document.getElementById('fig-preview-caption');

    const handleMouseEnter = (e: MouseEvent) => {
      const targetId = (e.currentTarget as HTMLElement).dataset.figTarget;
      const targetElement = document.getElementById(targetId || '');
      
      if (tooltip && targetElement && tooltipImg && tooltipCap) {
        // 元の画像のsrcとaltを取得
        const originalImg = targetElement.querySelector('img');
        if (originalImg) {
          tooltipImg.src = originalImg.src;
          tooltipCap.textContent = originalImg.alt;
          
          // ツールチップを表示
          tooltip.classList.remove('hidden');
          // 少し遅延させてopacityを変えることでフェードインさせる
          requestAnimationFrame(() => {
             tooltip.classList.remove('opacity-0');
          });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (tooltip) {
        // マウスの右下に追従させる
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
      }
    };

    const handleMouseLeave = () => {
      if (tooltip) {
        tooltip.classList.add('opacity-0');
        // フェードアウト後にhiddenにする（簡易的にはsetTimeout使用）
        setTimeout(() => tooltip.classList.add('hidden'), 200);
      }
    };

    // イベントリスナーの登録
    links.forEach(link => {
      link.addEventListener('click', handleScroll);
      link.addEventListener('mouseenter', handleMouseEnter as EventListener);
      link.addEventListener('mousemove', handleMouseMove as EventListener);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    // クリーンアップ関数
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleScroll);
        link.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        link.removeEventListener('mousemove', handleMouseMove as EventListener);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [transformedHtml]);

  return (
    <div dangerouslySetInnerHTML={{ __html: transformedHtml }} />
  );
};