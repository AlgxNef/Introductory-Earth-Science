import localFont from 'next/font/local';

// テキスト用のNew Computer Modernフォントを定義
export const newCM10 = localFont({
  src: '../fonts/NewCM10-Regular.otf',
  display: 'swap',
  variable: '--font-new-cm-10', // CSS変数として利用
});

// 数式用のNew Computer Modern Mathフォントを定義
export const newCMMath = localFont({
  src: '../fonts/NewCMMath-Regular.otf',
  display: 'swap',
  variable: '--font-new-cm-math', // CSS変数として利用
});