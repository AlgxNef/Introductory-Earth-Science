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
  const questionRegex = /(<h4>(問[０-９0-9]+)<\/h4>)([\s\S]*?)(?=<h[2-4]>|<\/div>|$)/g;

// $3（問の本文）の中で使う図版番号のカウンター
  // ※ファイル全体で連番にする場合はこの変数をreplaceの外に出してください
  let qFigCounter = 1;

  // Hタグ（ここではh4内のためh5, h6を想定）で分割するための正規表現
  const sectionSplitRegex = /(?=<h[5-6])/g;
  // 画像抽出用の正規表現
  const imgRegex = /<p[^>]*>\s*<img\s+src="([^"]+)"[^>]*>\s*<\/p>/g;

  return html.replace(questionRegex, (match, h4Tag, questionNum, contentBody) => {
    // contentBody が $3 に相当します

    // 1. コンテンツをHタグ（h5, h6等）区切りで分割
    // ※もしHタグがない場合は全体が1つのセクションになります
    const sections = contentBody.split(sectionSplitRegex);

    const processedBody = sections.map((sectionContent: string) => {
      if (!sectionContent.trim()) return "";

      // ヘッダー(h5/h6)と本文を分離
      let headerHtml = "";
      let bodyHtml = sectionContent;
      const headerMatch = sectionContent.match(/^(<h[5-6][^>]*>[\s\S]*?<\/h[5-6]>)([\s\S]*)$/i);

      if (headerMatch) {
        headerHtml = headerMatch[1];
        bodyHtml = headerMatch[2];
      }

      // 2. 画像の抽出処理
      const extractedImages: string[] = [];
      const textOnlyHtml = bodyHtml.replace(imgRegex, (imgMatch, src) => {
        const currentFigNum = qFigCounter++;
        
        // 画像HTMLの生成（ホバーなし、キャプションは図番号のみ）
        extractedImages.push(`
          <div class="mb-4">
            <img src="${src}" class="w-full h-auto" />
            <div class="text-center text-sm text-gray-600 mt-1 font-medium">図${currentFigNum}</div>
          </div>
        `);
        return ""; // 本文から画像を削除
      });

      // 3. レイアウト構築
      // 【変更点4】図がない場合は分割しない（元のHTMLをそのまま返す）
      if (extractedImages.length === 0) {
        return `
          <div class="mb-4">
            ${headerHtml}
            ${bodyHtml}
          </div>
        `;
      }

      // 図がある場合は左右分割（左テキスト、右画像）
      // 【変更点3】境界線（border）は削除
      return `
        <div class="mb-6">
          ${headerHtml}
          <div class="flex flex-col md:flex-row gap-4 mt-2">
            <!-- 左カラム：テキスト -->
            <div class="w-full md:w-[70%]">
              ${textOnlyHtml}
            </div>
            <!-- 右カラム：画像 -->
            <div class="w-full md:w-[30%]">
              ${extractedImages.join("")}
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <div class="flex gap-4 items-start mt-4 pl-4">
        <div class="font-serif font-medium">${questionNum}</div>
        <div class="flex-1">
          ${processedBody}
        </div>
      </div>
    `;
  });
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
                {postData.chapter && <span className="mx-1">&gt;</span>}
                {postData.chapter && <span>{postData.section}</span>}
                {postData.chapter && <span className="mx-1">&gt;</span>}
                {postData.chapter && <span>{postData.subsection}</span>}
              </p>
              {postData.updatedat && (
								<ul>
                <li>作成日: {postData.createdat}</li>
                <li>更新日: {postData.updatedat}</li>
								</ul>
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
            <section className="my-8">
              <h2 className="text-lg font-bold text-gray-800">
								<div className="w-fit px-3 bg-gray-300">
                演習問題
								</div>
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