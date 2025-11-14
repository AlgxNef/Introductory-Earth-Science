import Link from 'next/link';
import type { TocNode } from '@/lib/posts';

const TocList = ({ nodes }: { nodes: TocNode[] }) => {
  if (!nodes || nodes.length === 0) {
    return null;
  }

  return (
    <ul className="ml-2 list-none">
      {nodes.map((node) => (
        <li key={node.id} className="mt-1">
          {node.url ? (
            <Link href={node.url} className="hover:text-blue-600 transition-colors">
              {/* 変更点: title -> displayTitle */}
              {node.displayTitle}
            </Link>
          ) : (
            <span className="font-semibold text-gray-800">
              {/* 変更点: title -> displayTitle */}
              {node.displayTitle}
            </span>
          )}
          <TocList nodes={node.children} />
        </li>
      ))}
    </ul>
  );
};

export const TableOfContents = ({ tocData }: { tocData: TocNode[] }) => {
  return (
    <nav>
      {/* <ul>のスタイルを調整 */}
      <ul className="list-none">
        {tocData.map((node) => (
          <li key={node.id} className="mt-2">
            <span className="font-bold text-lg text-gray-900">{node.displayTitle}</span>
            <TocList nodes={node.children} />
          </li>
        ))}
      </ul>
    </nav>
  );
};