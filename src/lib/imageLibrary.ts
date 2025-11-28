// 各図のソースコードを格納するオブジェクト
// キーはユニークなID (例: '1-1-1-1-1/0001')
const imageLibrary: Record<string, string> = {

  // 例として、1/1/1/1/1ページのid:0001の図を追加
  '1-1-1-1-1/0001': `circle(r=100, cx=0, cy=0, fill="none", stroke="#CCC")
polar_line(ox=0, oy=0, r=100, angle=40)
polar_line(ox=0, oy=0, r=100, angle=55)
arc(cx=0, cy=0, rx=100, startAngle=40, endAngle=55, strokeWidth=5, stroke="black")
axis2d(ox=0, oy=0, x1=-10, x2=120, y1=-10, y2=120, xLabel="x", yLabel="y")
angle(cx=0, cy=0, r=25, startAngle=0, endAngle=40, text="\\theta", textSize=35, textOffset=1.3)
angle(cx=0, cy=0, r=35, startAngle=40, endAngle=55, text="\\Delta\\theta", textSize=20, textOffset=1.2)
arc_fit_ellipse_polar(cx=0, cy=0, rx=100, ry=100, arg=40, icdy=1, iry=15, side="front", stroke="blue")
arc_fit_ellipse_polar(cx=0, cy=0, rx=100, ry=100, arg=55, icdy=1, iry=10, side="front", stroke="blue")
`.trim(),

  // 今後、他の図もここに追加していく
  // '1-1-1-1-2/0001': `...`,

};

// 指定されたIDのソースコードを取得する関数
export const getImageSourceById = (id: string): string | null => {
  return imageLibrary[id] || null;
};

// 全てのライブラリデータを取得する関数（imggenページ用）
export const getAllImageSources = () => {
  return imageLibrary;
};