import { getAllPostSlugs, getPostData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FootnoteHandler } from '@/components/FootnoteHandler';
import { TransformedContent } from '@/components/transformContent';
import { ExerciseAccordion } from '@/components/ExerciseAccordion'; // ★ 新しいコンポーネントをインポート
import '@fontsource-variable/noto-serif-jp';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPostData(slug);
    return { title: post.title };
  } catch (error) {
    return { title: 'Page Not Found' };
  }
}

export async function generateStaticParams() {
  return getAllPostSlugs();
}

// 設問部分のHTMLを変換する関数
function transformQuestions(html: string): string {
  // <h4>問◯</h4>（全角・半角数字対応）を開始点とする。
  // そこから、次に出現する <h4>, <h3>, <h2>, </div> または文字列の終端の
  // 直前までを一つの問題のコンテンツとしてマッチさせる正規表現。
  //
  // 詳細:
  // (<h4>(問[０-９0-9]+)</h4>) - キャプチャグループ1 & 2
  //   - <h4>問◯</h4> の部分をマッチさせ、"問◯" の部分をグループ2としてキャプチャする。
  //   - 数字は全角・半角の両方に対応 ([０-９0-9]+)。
  // ([\s\S]*?) - キャプチャグループ3
  //   - 問題の本文。改行を含むあらゆる文字にマッチする。
  //   - `*?` は非貪欲マッチ（non-greedy）を意味し、可能な限り短い文字列にマッチさせる。
  // (?=<h[2-4]>|</div>|$) - 肯定的先読み
  //   - この正規表現の核となる部分。
  //   - `(?=...)` は、その位置に `...` のパターンが続くことを確認するが、`...` 自体はマッチ結果に含めない。
  //   - `<h[2-4]>` : <h4>, <h3>, <h2> のいずれかの開始タグ
  //   - `</div>` : divの終了タグ
  //   - `$` : 文字列の終端
  //   - これらが出現する直前で、キャプチャグループ3のマッチを終了させる。
  const questionRegex = /(<h4>(問[０-９0-9]+)<\/h4>)([\s\S]*?)(?=<h[2-4]>|<\/div>|$)/g;

  // 置換後のHTML構造。
  // 問題の本文（$3）は、<p>だけでなく<ul>や<ol>など複数の要素を含む可能性があるため、
  // <p>タグではなく<div>タグで囲むように変更している。
  const replacement = `
    <div class="flex items-start mt-4 pl-4">
      <div class="mr-4 font-serif font-medium">$2</div>
      <div class="flex-1">$3</div>
    </div>
  `;

  return html.replace(questionRegex, replacement);
}


export default async function PostPage({ params }: Props) {
  try {
    const { slug } = await params;
    if (!slug?.length) notFound();

    const postData = await getPostData(slug);

    // --- 演習問題の処理ロジック ---
    const exerciseDelimiter = '<h2>演習問題</h2>';
    const contentParts = postData.contentHtml.split(exerciseDelimiter);
    const mainContent = contentParts[0];
    const exerciseHtml = contentParts.length > 1 ? contentParts[1] : null;

    let questionHtml: string | null = null;
    let answerHtml: string | null = null;

    if (exerciseHtml) {
      const answerDelimiter = '<h3>解答・解説</h3>';
      const exerciseParts = exerciseHtml.split(answerDelimiter);
      
      // 設問パートのHTMLを取得し、不要な見出しを削除
      const rawQuestionHtml = exerciseParts[0].replace('<h3>設問</h3>', '').trim();
      
      // ★ 要件に基づき設問HTMLを変換
      questionHtml = transformQuestions(rawQuestionHtml);
      
      // 解答パートのHTMLを取得
			const rawAnswerHtml = exerciseParts.length > 1 ? exerciseParts[1].trim() : '';
      answerHtml = transformQuestions(rawAnswerHtml);
    }
    // --- ここまで ---
    return (
      <div className="bg-white text-black min-h-screen p-4">
        <div className="mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-b-lg">
          <header className="mb-4 border-b pb-2">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <p className="font-medium">
                {postData.part && <span>{postData.part}</span>}
                {postData.chapter && <span className="mx-1">&gt;</span>}
                {postData.chapter && <span>{postData.chapter}</span>}
              </p>
              {postData.updatedat && (
                <p>更新日: {postData.updatedat}</p>
              )}
            </div>
            
						<section className="my-2 text-gray-900 tracking-tight leading-none">
              <h1 className="text-3xl font-bold">
                {postData.title}
              </h1>
              <div className="text-xs font-light my-1">
                {postData.titleen}
              </div>
						</section>
          </header>

					<TransformedContent htmlContent={mainContent} />
          {/* 演習問題セクション (クライアントコンポーネントを呼び出す) */}
          {questionHtml && answerHtml !== null && (
            <section className="mt-8 bg-slate-50 p-6 rounded-lg shadow-inner">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-2">
                演習問題
              </h2>
              <ExerciseAccordion
                questionHtml={questionHtml}
                answerHtml={answerHtml}
              />
            </section>
          )}

          <FootnoteHandler footnotes={postData.footnotes} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}