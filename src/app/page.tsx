import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="prose lg:prose-xl max-w-none">
      <h1>理系地学入門へようこそ</h1>
      <p>
        このサイトは、Webで読める理系地学の集大成です。断片的な知識の寄せ集めではなく、物理・化学の法則を縦糸に、広大なスケールと先人の知恵を横糸に、宇宙138億年、地球46億年の物語を編んでいきます。
      </p>
      <p>
        左側の目次から、興味のある項目を選択して学習を始めてください。
      </p>
      <p>
        <Link href="/1/1/1/1/1" className="text-blue-600 hover:underline">
          → まずは「古代の地球観」から読み始める
        </Link>
      </p>
    </div>
  );
}