import { MetadataRoute } from 'next';
import { getTableOfContents } from '@/lib/posts'; // posts.tsからヘルパーをインポート

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://i-earth.pages.dev';

  // 1. 動的な記事ページのURLリストを生成
  const toc = getTableOfContents();
  const postUrls: MetadataRoute.Sitemap = [];

  function traverse(nodes: any[]) { // anyで妥協
    nodes.forEach(node => {
      if (node.url) {
        postUrls.push({
          url: `${siteUrl}${node.url}`,
          lastModified: new Date(), // 本来は各ページのupdatedatを使うのが望ましい
          priority: 0.8,
        });
      }
      if (node.children?.length > 0) {
        traverse(node.children);
      }
    });
  }
  traverse(toc);

  // 2. 静的なページのURLリスト
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: siteUrl, // トップページ
      lastModified: new Date(),
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      priority: 0.5,
    },
    // ... 他の静的ページ（how-to-useなど）もここに追加
  ];

  // 3. すべてのURLを結合して返す
  return [...staticUrls, ...postUrls];
}