"use client";

import { useState } from 'react';

type Props = {
  questionHtml: string;
  answerHtml: string;
};

export function ExerciseAccordion({ questionHtml, answerHtml }: Props) {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  const toggleAnswerVisibility = () => {
    setIsAnswerVisible(!isAnswerVisible);
  };

	/**
 * <h5>解法X</h5> の形式をTailwind CSSでデザインされた<div>に変換するロジック
 */
// <h5>解法X</h5> のパターンにマッチする正規表現
// Xは半角数字
// キャプチャグループ1: 解法X (例: 解法1)
const h5SolutionRegex = /<h5>(解法\d+)<\/h5>/g;

answerHtml = answerHtml.replace(h5SolutionRegex, (match, innerContent) => {
    // innerContent は "解法1", "解法2" など

    // 適用する Tailwind CSS クラス
    // 外部のコンテンツと区別するために、左ボーダーと背景色を適用
    const hClasses = "bg-white border-1 border-gray-500 w-fit px-2 mb-1 rounded-full";
    // 全体を新しい<div>構造で囲んで返す
    return `<h5 class="${hClasses}">${innerContent}</h5>`;
});

  return (
    <div className="prose lg:prose-xl max-w-none prose-h3:text-lg prose-h3:font-semibold prose-h4:text-base prose-h4:font-semibold">
      {/* --- 設問セクション --- */}
      <div className="p-4 border-1 border-gray-300" dangerouslySetInnerHTML={{ __html: questionHtml }} />

      {/* --- 解答・解説セクション --- */}
      {answerHtml && (
        <div className="">
          <button
            onClick={toggleAnswerVisibility}
            className="my-2 w-full px-4 py-2 text-left font-bold text-white bg-slate-600 hover:bg-slate-700 focus:outline-none flex justify-between items-center print:hidden"
          >
            <span>
              {isAnswerVisible ? '解答・解説を閉じる' : '解答・解説を見る'}
            </span>
            <svg
              className={`w-6 h-6 transform transition-transform duration-200 ${
                isAnswerVisible ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isAnswerVisible && (
					<div>
						<h3 className="px-2 py-1 !font-semibold text-gray-800 bg-white my-2 border-l-4 border-1 border-gray-300">解答・解説</h3>
            <div className="p-2 bg-gray-50 print:bg-white border border-gray-200 print:border-none">
              <div dangerouslySetInnerHTML={{ __html: answerHtml }} />
            </div>
					</div>
          )}
        </div>
      )}
    </div>
  );
}