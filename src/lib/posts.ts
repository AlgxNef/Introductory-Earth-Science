import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkMath from 'remark-math'; // remark-mathをインポート
import rehypeKatex from 'rehype-katex'; // rehype-katexをインポート
import rehypeStringify from 'rehype-stringify'; // HTML文字列に変換する
import remarkRehype from 'remark-rehype'; // remark -> rehype の変換に必要
import html from 'remark-html';
import remarkParse from 'remark-parse'; // 明示的にインポート
import { unified } from 'unified'; // unifiedを直接使う
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRubyDirective from 'remark-ruby-directive';

// --- posts.tsの役割 ---
// 1. Markdownファイルの中身を読み込む (getPostData)
// 2. サイトの目次構造を定義し、生成する (getTableOfContents)

const postsDirectory = path.join(process.cwd(), '_contents');

// 目次ノードの型定義（urlをオプショナルに変更）
export interface TocNode {
  id: string; // 例: "1-1-1"
  title: string; // 例: "地球の形と大きさ"
  displayTitle: string; // 例: "第1節 地球の形と大きさ"
  url?: string; // URLは階層の最下層にしか存在しない
  children: TocNode[];
}

// 目次データを定義するテキストブロック
const tocMarkdown = `
# 地球の概観
## 地球の形状
### 地球の形と大きさ
#### 地球のかたち
##### 古代の地球観
##### 地球球体説
##### 地球楕円体と論争
##### 扁平率
#### 地球の大きさ
##### エラトステネスの方法
##### 三角測量
##### 重力測量
##### 人工衛星による解析
#### 地球の正確な形
##### 赤道半径と極半径
##### ジオイド
##### 平均海水面
`;

// 目次テキストを解析して階層的なツリーデータを生成する関数
export function getTableOfContents(): TocNode[] {
  const lines = tocMarkdown.split('\n').filter((line) => line.trim().startsWith('#'));
  const root: TocNode[] = [];
  const parentStack: TocNode[] = [];
  const counters = [0, 0, 0, 0, 0]; // 部, 章, 節, 項, 目 のカウンター

  lines.forEach((line) => {
    const level = line.match(/^#+/)?.[0].length ?? 0; // #の数で階層レベルを判定
    if (level === 0) return;

    const title = line.replace(/^#+\s*/, '').trim();

    // カウンターの更新
    counters[level - 1]++;
    for (let i = level; i < counters.length; i++) {
      counters[i] = 0; // 下位の階層のカウンターをリセット
    }

    const id = counters.slice(0, level).join('-');
    const url = level === 5 ? `/${counters.slice(0, level).join('/')}` : undefined;

    let displayTitle = '';
    switch (level) {
      case 1: displayTitle = `第${counters[0]}部 ${title}`; break;
      case 2: displayTitle = `第${counters[1]}章 ${title}`; break;
      case 3: displayTitle = `第${counters[2]}節 ${title}`; break;
      case 4: displayTitle = `第${counters[3]}項 ${title}`; break;
      case 5: displayTitle = title; break; // '目'は番号を付けない
      default: displayTitle = title;
    }

    const newNode: TocNode = { id, title, displayTitle, url, children: [] };

    if (level === 1) {
      root.push(newNode);
    } else {
      const parent = parentStack[level - 2];
      parent.children.push(newNode);
    }
    parentStack[level - 1] = newNode;
  });

  return root;
}

// 全ての投稿のパス（slug）を生成する関数
export function getAllPostSlugs() {
  const toc = getTableOfContents();
  const paths: { slug: string[] }[] = []; // 型を明記

  function traverse(nodes: TocNode[]) {
    nodes.forEach(node => {
      // リンクを持つノード（level 5）のみを対象にする
      if (node.url && node.id) {
        // 'slug'というキーを持つオブジェクトを生成する
        paths.push({ 
          slug: node.id.split('-') 
        });
      }
      // 子ノードがあれば再帰的に探索
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  }
  
  traverse(toc);
  return paths; // 正しい形式の配列を返す
}

export interface PostData {
  slug: string[];
  contentHtml: string;
  title: string;
	titleen: string;
  part?: string;
  chapter?: string;
  section?: string;
  subsection?: string;
  createdat?: string;
  updatedat?: string;
	footnotes: Record<string, string>
}

export async function getPostData(slug: string[]): Promise<PostData> {
  const fileName = `${slug.join('-')}.md`;
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const file = await unified()
    .use(remarkParse)
		.use(remarkDirective)
		.use(remarkRubyDirective)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true }) 
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(matterResult.content);
    
  const contentHtml = String(file);

  const footnotes: Record<string, string> = {};
  if (file.data.footnotes) {
    for (const footnote of file.data.footnotes as any[]) {
      const key = footnote.identifier || footnote.label;
      const value = (footnote.children[0] as any)?.children[0]?.value || '';
      if(key && value) {
        footnotes[key] = value;
      }
    }
  }
	
  return {
    slug,
    contentHtml,
    footnotes,
    ...(matterResult.data as Omit<PostData, 'slug' | 'contentHtml' | 'footnotes'>),
  };
}