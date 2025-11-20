// @/components/image-editor/ImageGenerator.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { parseCommands, Shape, UnitMode } from './parser'; 
import { Switch } from '@headlessui/react';
import { Grid } from './Grid';
import { LayerPanel } from './LayerPanel';

// --- 図形を描画するコンポーネント ---
const ShapeRenderer = ({ shape }: { shape: Shape }) => {
	if (!shape.visible) return null;
  switch (shape.type) {
    case 'circle':
      return (
        <circle 
          {...shape.props}
          fill={shape.props.fill || 'white'}
          stroke={shape.props.stroke || 'black'}
        />
      );
    case 'arrow': {
      const { x1, y1, x2, y2, headSize = 10, ...restProps } = shape.props;
      // 線のスタイルを決定
      const strokeColor = restProps.stroke || 'black';

      // 1. ベクトルの成分と長さを計算
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // ゼロ長のベクトルの場合は何も描画しない
      if (length === 0) return null;

      // 2. 角度を計算 (ラジアンと度)
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = angleRad * 180 / Math.PI;

      // 3. 矢印の頭の根本までの距離を計算
      // headSizeに応じて三角形をスケールするため、三角形の底辺のX座標(-12)もスケールされる
      const headBaseLength = 1.2 * headSize; // 12 * (headSize / 10) と同じ

      // 4. 新しい線の終点を計算
      // 矢印の頭の長さ分だけ、元の終点から始点方向にバックさせる
      const newX2 = x2 - headBaseLength * Math.cos(angleRad);
      const newY2 = y2 - headBaseLength * Math.sin(angleRad);
			
      return (
        <g {...restProps} stroke={strokeColor}>
          {/* 線の本体 */}
          <line x1={x1} y1={y1} x2={newX2} y2={newY2} />

          {/* 矢印の頭 (pathで三角形を描画) */}
          <path
            d="M0,0 L-12,-5 L-12,5 z" // 矢の先端が(0,0)に来るように三角形を定義
            fill={strokeColor}
            transform={
              `translate(${x2}, ${y2}) ` + // 1. 矢の先端を線の終点に移動
              `rotate(${angleDeg}) ` +      // 2. 線の角度に合わせて回転
              `scale(${headSize / 10})`     // 3. headSizeに応じて拡大・縮小
            }
          />
        </g>
      );
    }
    default:
      return null;
  }
};

export const ImageGenerator = () => {
  const [commandText, setCommandText] = useState('circle(r=40, cx=50, cy=50, fill="blue", stroke="black", strokeWidth=2, visible=true)');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [unitMode, setUnitMode] = useState<UnitMode>('absolute');
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [padding, setPadding] = useState(20);
  const [manualWidth, setManualWidth] = useState(200);
  const [manualHeight, setManualHeight] = useState(200);
  const [isZoomToFit, setIsZoomToFit] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [viewBox, setViewBox] = useState('0 0 100 100');
	
  // ★★★ shapesの更新をuseEffectに移動 ★★★
  useEffect(() => {
    const canvasSize = { width: manualWidth, height: manualHeight };
    const parsedShapes = parseCommands(commandText, unitMode, canvasSize);
    setShapes(parsedShapes);
  }, [commandText, unitMode, manualWidth, manualHeight]);
	
  // --- ★★★ useEffectでviewBoxを自動計算 ★★★ ---
  useEffect(() => {
    if (!isAutoFit || shapes.length === 0) {
      const width = manualWidth || 100;
      const height = manualHeight || 100;
      setViewBox(`0 0 ${width} ${height}`);
      return;
    }

    let totalBBox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    
    // 表示されている図形のみを対象にBBoxを計算
    const visibleShapes = shapes.filter(s => s.visible);
    if (visibleShapes.length === 0) {
      setViewBox('0 0 100 100'); // 表示されている図形がない場合はデフォルトに
      return;
    }

    visibleShapes.forEach(shape => {
      if (shape.type !== 'unknown') {
        totalBBox.minX = Math.min(totalBBox.minX, shape.boundingBox.minX);
        totalBBox.minY = Math.min(totalBBox.minY, shape.boundingBox.minY);
        totalBBox.maxX = Math.max(totalBBox.maxX, shape.boundingBox.maxX);
        totalBBox.maxY = Math.max(totalBBox.maxY, shape.boundingBox.maxY);
      }
    });

    const vbX = totalBBox.minX - padding;
    const vbY = totalBBox.minY - padding;
    const vbWidth = (totalBBox.maxX - totalBBox.minX) + (padding * 2);
    const vbHeight = (totalBBox.maxY - totalBBox.minY) + (padding * 2);
    
    setViewBox(`${vbX} ${vbY} ${vbWidth} ${vbHeight}`);
  }, [shapes, isAutoFit, padding]);
	
  // ★★★ レイヤーの表示/非表示を切り替えるハンドラ関数 ★★★
  const handleVisibilityChange = (id: number, visible: boolean) => {
    setShapes(currentShapes =>
      currentShapes.map(shape =>
        shape.id === id ? { ...shape, visible } : shape
      )
    );
  };
	
  // ★★★ EditorのonMountイベントで言語定義を行うための関数 ★★★
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // カスタム言語'imggen-lang'を登録
    monaco.languages.register({ id: 'imggen-lang' });

    // シンタックスハイライトのルールを定義
    monaco.languages.setMonarchTokensProvider('imggen-lang', {
      tokenizer: {
        root: [
          // 関数名 (例: circle)
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@default': 'identifier'
            }
          }],
          // カッコ
          [/[()]/, '@brackets'],
          // 数字
          [/\d+/, 'number'],
          // 文字列 (ダブルクォート)
          [/"[^"]*"/, 'string'],
        ]
      },
      keywords: [
        'circle', 'rect', 'line', 'text', 'formula' // 今後追加するコマンドもここに追加
      ],
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[80vh]">
		<div className="flex flex-col gap-2">
      {/* 1. 左側：エディタとレイヤーパネル */}
      <div className="flex flex-col gap-4 md:col-span-1 flex-1">
			<div className="flex-1 flex gap-1">
				<div className="flex-1 border rounded">
					<Editor
						height="100%"
						language="imggen-lang"
						theme="vs-light"
						value={commandText}
						onChange={(value) => setCommandText(value || '')}
						onMount={handleEditorDidMount} // handleEditorDidMountを定義する必要あり
						options={{
							minimap: { enabled: false },
							fontSize: 15,
							wordWrap: 'on',
						}}
					/>
				</div>
        <LayerPanel shapes={shapes} onVisibilityChange={handleVisibilityChange} />
				</div>
      </div>

      {/* 2. 中央：設定パネル */}
      <div className="p-4 border rounded bg-gray-50 flex flex-col gap-4">
        {/* ★★★ 単位モード切り替えUIを追加 ★★★ */}
        <div>
          <label className="font-medium text-sm">単位モード</label>
          <div className="flex gap-2 mt-1">
            <button onClick={() => setUnitMode('absolute')} className={`px-3 py-1 text-sm rounded ${unitMode === 'absolute' ? 'bg-slate-600 text-white' : 'bg-gray-200'}`}>絶対値</button>
            <button onClick={() => setUnitMode('relative')} className={`px-3 py-1 text-sm rounded ${unitMode === 'relative' ? 'bg-slate-600 text-white' : 'bg-gray-200'}`}>相対値</button>
          </div>
        </div>
        
				{/* キャンバスサイズ設定 */}
				<div>
					<Switch.Group as="div" className="flex items-center">
						{/* ★★★ ここからが「キャンバス自動調整」スイッチ ★★★ */}
						<Switch
							checked={isAutoFit}
							onChange={setIsAutoFit}
							className={`${
								isAutoFit ? 'bg-slate-600' : 'bg-gray-200'
							} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
						>
							<span
								className={`${
									isAutoFit ? 'translate-x-6' : 'translate-x-1'
								} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
							/>
						</Switch>
						{/* ★★★ スイッチここまで ★★★ */}
						<Switch.Label className="ml-3 font-medium text-sm text-gray-700">キャンバス自動調整</Switch.Label>
					</Switch.Group>
					
					{/* 条件付き表示の入力欄 */}
					<div className="mt-2 pl-2">
						{isAutoFit ? (
							<div className="flex items-center gap-2">
								<label htmlFor="padding" className="text-sm text-gray-600">余白:</label>
								<input id="padding" type="number" value={padding} onChange={e => setPadding(parseInt(e.target.value))} className="w-20 border rounded p-1 text-sm"/>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<label className="text-sm text-gray-600">サイズ:</label>
								<input type="number" value={manualWidth} onChange={e => setManualWidth(parseInt(e.target.value))} placeholder="幅" className="w-20 border rounded p-1 text-sm"/>
								<span className="text-gray-400">×</span>
								<input type="number" value={manualHeight} onChange={e => setManualHeight(parseInt(e.target.value))} placeholder="高さ" className="w-20 border rounded p-1 text-sm"/>
							</div>
						)}
					</div>
				</div>

				{/* 表示モード設定 */}
				<Switch.Group as="div" className="flex items-center">
					{/* ★★★ ここからが「全体表示」スイッチ ★★★ */}
					<Switch
						checked={isZoomToFit}
						onChange={setIsZoomToFit}
						className={`${
							isZoomToFit ? 'bg-slate-600' : 'bg-gray-200'
						} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
					>
						<span
							className={`${
								isZoomToFit ? 'translate-x-6' : 'translate-x-1'
							} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
						/>
					</Switch>
					{/* ★★★ スイッチここまで ★★★ */}
					<Switch.Label className="ml-3 font-medium text-sm text-gray-700">全体表示</Switch.Label>
				</Switch.Group>
				
				
					<Switch.Group as="div" className="flex items-center">
						<Switch
							checked={showGrid}
							onChange={setShowGrid}
							className={`${
								showGrid ? 'bg-slate-600' : 'bg-gray-200'
							} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
						>
							<span className={`${ showGrid ? 'translate-x-6' : 'translate-x-1' } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
						</Switch>
						<Switch.Label className="ml-3 font-medium text-sm text-gray-700">目盛り表示</Switch.Label>
					</Switch.Group>
        </div>
			</div>
      {/* 3. 右側 */}
      <div className="border rounded p-4 flex items-center justify-center overflow-auto bg-white">
        <svg 
          viewBox={viewBox}
          className={isZoomToFit ? "w-full h-full" : ""}
          style={!isZoomToFit ? { width: manualWidth, height: manualHeight } : {}}
          preserveAspectRatio="xMidYMid meet"
        >
          {showGrid && <Grid viewBox={viewBox} />}
					{shapes.map((shape) => (
            <ShapeRenderer key={shape.id} shape={shape} />
          ))}
        </svg>
      </div>
    </div>
  );
};