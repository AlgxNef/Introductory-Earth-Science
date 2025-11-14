import React from 'react';

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
    case '外語':
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

	// =================================================================
  // 【追加】変換ロジック0: <p>タグにクラスを追加
  // <p> -> <p class="mt-auto text-sm">
  // =================================================================
  transformed = transformed.replace(/<p>/g, '<p class="px-2 indent-[1em] leading-8">');
	transformed = transformed.replace(/<h3>/g, '<h3 class="py-1 px-2 my-3 bg-gray-300">');
	
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
  // 例: <p>[1]本文</p> → <p><span class="...">①</span>本文</p>
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
  // 【修正】変換ロジック3: <p>内の<img>を検出し、テキストと画像を分離してflexレイアウトに変換
  // 例: <p class="... A ...">テキスト <img src="..."></p>
  // ↓
  // <div class="flex items-start">
  //   <div class="w-[80%] pr-4"><p class="... A ...">テキスト</p></div>
  //   <div class="w-[20%]"><img src="..."></div>
  // </div>
  // =================================================================
  const pWithImgRegex = /<p([^>]*)>(.*?)<\/p>/gs; // 's'フラグで改行を含む内容にマッチ

  transformed = transformed.replace(pWithImgRegex, (match, pAttributes, innerContent) => {
    const imgTagRegex = /<img[^>]*>/g;

    // pタグ内にimgタグが含まれているかチェック
    if (imgTagRegex.test(innerContent)) {
      // マッチしたimgタグをすべて抽出
      const imgTags = innerContent.match(imgTagRegex);
      const allImages = imgTags ? imgTags.join('') : '';

      // imgタグを取り除いた残りのコンテンツ（テキストや他のHTMLタグ）
      const textContent = innerContent.replace(imgTagRegex, '').trim();

      // 新しいflexレイアウトのHTMLを構築
      // 元の<p>タグが持っていた属性(例: class="...")を新しい<p>タグに引き継ぐ
      return `<div class="flex items-start my-2">
  <div class="w-[80%] pr-4  flex flex-col justify-between leading-7" style="height: -webkit-fill-available;"><p${pAttributes}>${textContent}</p></div>
  <div class="w-[20%]">${allImages}</div>
</div>`;
    }
    
    // imgタグが含まれていないpタグは、そのまま変更せずに返す
    return match;
  });
	
	// =================================================================
  // 【追加】変換ロジック4: <figure>タグにクラスを追加
  // <figure> -> <figure class="mt-auto text-sm">
  // =================================================================
  transformed = transformed.replace(/<figure>/g, '<figure class="mt-auto text-sm text-right">');
	
  // =================================================================
  // 今後、新しい変換ロジックをここに追加できます
  // =================================================================

  return transformed;
};

/**
 * 変換されたHTML文字列を安全にレンダリングするためのコンポーネント
 * @param {{ htmlContent: string }} props
 */
export const TransformedContent: React.FC<{ htmlContent: string }> = ({ htmlContent }) => {
  const transformedHtml = transformContent(htmlContent);

  return (
    <div dangerouslySetInnerHTML={{ __html: transformedHtml }} />
  );
};