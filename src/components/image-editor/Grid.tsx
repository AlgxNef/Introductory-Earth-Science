import React from 'react';
type UnitMode = 'absolute' | 'relative';

// 見やすい目盛りのステップを計算するヘルパー関数
const calculateTickStep = (range: number): number => {
  if (range <= 0) return 10;
  const exponent = Math.floor(Math.log10(range));
  const base = Math.pow(10, exponent);
  const normalizedRange = range / base;

  if (normalizedRange < 2) return base / 10; // e.g., range=150 -> base=100 -> norm=1.5 -> step=20
  if (normalizedRange < 5) return base / 4; // e.g., range=400 -> base=100 -> norm=4 -> step=50
  return base;                             // e.g., range=800 -> base=100 -> norm=8 -> step=100
};

interface GridProps {
  viewBox: string;
	unitMode: UnitMode;
}

export const Grid = ({ viewBox, unitMode }: GridProps) => {
  const [x, y, width, height] = viewBox.split(' ').map(Number);
  
  // viewBoxが無効な場合は何も描画しない
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return null;
  }

  const ticks = [];
  const scaleFactor = unitMode === 'relative' ? 100 : 1;
	
  // X軸の目盛りを計算
  const xStep = calculateTickStep(width);
  const startX = Math.ceil(x / xStep) * xStep;
  for (let i = startX; i < x + width; i += xStep) {
		const displayValue = i / scaleFactor;
    ticks.push(
      <React.Fragment key={`x-${i}`}>
        <line x1={i} y1={y} x2={i} y2={y + height} stroke="#e0e0e0" strokeWidth={height/1000} />
        <text x={i} y={y + height - (height/60)} fontSize={height/60} fill="#a0a0a0">{displayValue}</text>
      </React.Fragment>
    );
  }

  // Y軸の目盛りを計算
  const yStep = calculateTickStep(height);
  const startY = Math.ceil(y / yStep) * yStep;
  for (let i = startY; i < y + height; i += yStep) {
		const displayValue = -i / scaleFactor;
    ticks.push(
      <React.Fragment key={`y-${i}`}>
        <line x1={x} y1={i} x2={x + width} y2={i} stroke="#e0e0e0" strokeWidth={height/1000} />
        <text x={x + (width/60)} y={i} fontSize={height/60} fill="#a0a0a0">{displayValue}</text>
      </React.Fragment>
    );
  }

  // 0,0の原点に少し太い軸線を描画
  const origin = (
    <React.Fragment>
      <line x1={0} y1={y} x2={0} y2={y + height} stroke="#aaa" strokeWidth={width/1000} />
      <line x1={x} y1={0} x2={x + width} y2={0} stroke="#aaa" strokeWidth={height/1000} />
    </React.Fragment>
  );

  return (
    <g>
      {ticks}
      {origin}
    </g>
  );
};