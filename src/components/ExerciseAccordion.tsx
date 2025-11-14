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

  return (
    <div className="prose lg:prose-xl max-w-none prose-h3:text-lg prose-h3:font-semibold prose-h4:text-base prose-h4:font-semibold">
      {/* --- 設問セクション --- */}
      <h3 className="!text-xl !font-bold text-gray-800">設問</h3>
      <div dangerouslySetInnerHTML={{ __html: questionHtml }} />

      {/* --- 解答・解説セクション --- */}
      {answerHtml && (
        <div className="mt-8">
          <button
            onClick={toggleAnswerVisibility}
            className="w-full px-4 py-3 text-left font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex justify-between items-center"
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
            <div className="mt-4 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="!text-xl !font-bold text-gray-800 !mt-0">解答・解説</h3>
              <div dangerouslySetInnerHTML={{ __html: answerHtml }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}