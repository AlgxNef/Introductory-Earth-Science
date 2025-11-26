// @/components/image-editor/ImageGenerator.tsx
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { parseCommands, Shape, UnitMode, commandDefaults } from './parser';
import { getImageSourceById, getAllImageSources } from '@/lib/imageLibrary'; 
import { Switch } from '@headlessui/react';
import { Grid } from './Grid';
import { LayerPanel } from './LayerPanel';
import { InlineMath } from 'react-katex';

import { exportAsSVG, exportAsRaster } from './exporter';

/**
 * 数学的なモジュロ演算 (常に 0 <= result < m) を行います。
 */
function mathMod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

// 例: mathMod(-30, 360) は 330 を返します。

const polarToCartesian = (centerX: number, centerY: number, radiusX: number, radiusY: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
  return {
    x: centerX + (radiusX * Math.cos(angleInRadians)),
    y: (centerY + (radiusY * Math.sin(angleInRadians)))* -1
  };
};

// --- 図形を描画するコンポーネント ---
const ShapeRenderer = ({ shape }: { shape: Shape }) => {
	if (!shape.visible) return null;
  switch (shape.type) {
    case 'circle':
      return (
        <circle 
          {...shape.props}
          fill={shape.props.fill || 'none'}
          stroke={shape.props.stroke || 'black'}
        />
      );
    case 'ellipse':
      return (
        <ellipse 
          {...shape.props}
          fill={shape.props.fill || 'none'}
          stroke={shape.props.stroke || 'black'}
        />
      );
    case 'line':
      return (
        <line 
          {...shape.props}
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
      const headBaseLength = 1.5 * headSize; // 12 * (headSize / 10) と同じ

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
            d="M0,0 L-15,-5 L-15,5 z" // 矢の先端が(0,0)に来るように三角形を定義
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
    case 'label': {
      const { 
        text, 
        x, 
        y, 
        size = 16, 
        color = 'black', 
        isMath = true 
      } = shape.props;
			
      if (!text || text.trim() === '') {
        return null;
      }
      // foreignObjectは位置と大きさを指定する必要がある
      // Bounding Boxをそのまま利用する
      const { minX, minY, maxX, maxY } = shape.boundingBox;
      const width = maxX - minX;
      const height = maxY - minY;

      return (
        <foreignObject x={minX} y={minY} width={width} height={height} overflow="visible">
          <div
            style={{
              fontSize: `${size}px`,
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
					>
						<div> {/* ★★★ KaTeX/テキストをもう一段divで囲む ★★★ */}
							{isMath ? (
								<InlineMath math={text} />
							) : (
								<span>{text}</span>
							)}
						</div>
          </div>
        </foreignObject>
      );
    }
    case 'arc': {
      const { 
        cx, cy, rx, ry, 
        startAngle, endAngle, 
        ...restProps 
      } = shape.props;

      const start = polarToCartesian(cx, cy, rx, ry, startAngle);
      const end = polarToCartesian(cx, cy, rx, ry, endAngle);
			
			// 1. 角度を0〜360度の範囲に正規化する
			const normalizedStart = mathMod(startAngle, 360);
			const normalizedEnd = mathMod(endAngle, 360);

			// 2. 差分を計算する
			// endAngleがstartAngleより大きい場合も、小さい場合も正しく処理されます。
			let angleDifference = normalizedEnd - normalizedStart;

			// 3. 差分が負の値の場合、360度を足して時計回りの角度差（0〜360）に変換する
			if (angleDifference < 0) {
					angleDifference += 360;
			}
			
      const largeArcFlag = angleDifference <= 180 ? "0" : "1";
			
      const d = [
        "M", start.x, start.y, 
        "A", rx, ry, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");

      return (
        <path
          d={d}
          fill="none"
          stroke={restProps.stroke || "black"}
          strokeWidth={restProps.strokeWidth ?? 1}
          {...restProps}
        />
      );
    }
		
    default:
      return null;
  }
};

export const ImageGenerator = () => {
  const [commandText, setCommandText] = useState('');
  const [library, setLibrary] = useState<Record<string, string>>({});
  const searchParams = useSearchParams();
  const loadId = searchParams.get('load');
	
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [unitMode, setUnitMode] = useState<UnitMode>('absolute');
  const [isAutoFit, setIsAutoFit] = useState(true);
  const [padding, setPadding] = useState(20);
  const [manualWidth, setManualWidth] = useState(200);
  const [manualHeight, setManualHeight] = useState(200);
  const [isZoomToFit, setIsZoomToFit] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [viewBox, setViewBox] = useState('0 0 100 100');
	const editorRef = useRef<any>(null);
	const monacoRef = useRef<any>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	
  useEffect(() => {
    // ライブラリデータを読み込んでstateにセット
    setLibrary(getAllImageSources());

    if (loadId) {
      const source = getImageSourceById(loadId);
      if (source) {
        setCommandText(source);
      } else {
        setCommandText(`// Error: Image with ID "${loadId}" not found.`);
      }
    } else {
      setCommandText('axis2d()');
    }
  }, [loadId]);
	
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
      setViewBox(`0 ${-height} ${width} ${height}`);
      return;
    }

    let totalBBox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    
    // 表示されている図形のみを対象にBBoxを計算
    const visibleShapes = shapes.filter(s => s.visible);
    if (visibleShapes.length === 0) {
      setViewBox('0 -100 100 100'); // 表示されている図形がない場合はデフォルトに
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

  const handleInsertCommand = (commandName: string) => {
    const editor = editorRef.current;
		const monaco = monacoRef.current;
		
    if (!editor || !monaco) return;

    const defaultCommand = commandDefaults[commandName];
    if (!defaultCommand) return;

    let textToInsert = defaultCommand;
    const currentText = editor.getValue();

    // 最後の行が空でなければ、改行を追加
    if (currentText.trim().length > 0 && !currentText.endsWith('\n\n')) {
      if (currentText.endsWith('\n')) {
        textToInsert = defaultCommand;
      } else {
        textToInsert = '\n' + defaultCommand;
      }
    }

    // エディタの最後にテキストを挿入
    const lastLine = editor.getModel().getLineCount();
    const lastColumn = editor.getModel().getLineMaxColumn(lastLine);
    const range = new monaco.Range(lastLine, lastColumn, lastLine, lastColumn);
    
    editor.executeEdits('insert-command', [{ range, text: textToInsert }]);
    editor.focus(); // 挿入後にエディタにフォーカスを戻す
  };

  // ★★★ EditorのonMountイベントで言語定義を行うための関数 ★★★
  const handleEditorDidMount = (editor: any, monaco: any) => {
    // カスタム言語'imggen-lang'を登録
		editorRef.current = editor;
    monaco.languages.register({ id: 'imggen-lang' });
		monacoRef.current = monaco;
		
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
				'label', 
				'line', 
				'polar_line', 
				'arrow', 
				'polar_arrow', 
				'axis2d', 
				'arc', 
				'angle', 
        'circle',
				'rect', 
      ],
    });
  };

  const handleExport = (format: 'svg' | 'png' | 'jpeg' | 'webp') => {
    if (!svgRef.current) {
      console.error("SVG element not found.");
      return;
    }
    
    const filename = `science-to-img-${new Date().getTime()}`;

    if (format === 'svg') {
      exportAsSVG(svgRef.current, filename);
    } else {
      exportAsRaster(svgRef.current, filename, format);
    }
  };
	
  const handleLibrarySelect = (id: string) => {
    if (id && library[id]) {
      setCommandText(library[id]);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] h-[90vh]">
		<div className="flex flex-col gap-2 px-2">
      {/* 1. 左側：エディタとレイヤーパネル */}
      <div className="flex flex-col gap-4 md:col-span-1 flex-1">
			<div className="flex-1 flex gap-1">
        <div className="p-2 border rounded bg-gray-50">
          <h3 className="text-sm font-semibold mb-2">図形を追加</h3>
					<div className="flex flex-col gap-2">
						{/* commandDefaultsオブジェクトのキーをマップしてボタンを自動生成 */}
						{Object.keys(commandDefaults).map((commandName) => (
							<button
								key={commandName}
								onClick={() => handleInsertCommand(commandName)}
								className="px-3 py-1 text-sm text-center bg-white border rounded hover:bg-gray-100"
							>
								{
									{
										line: '線分',
										circle: '円',
										ellipse: '楕円',
										arrow: '矢印',
										label: 'ラベル',
										axis2d: '2D軸',
										arc: '弧',
										angle: '角度表示',
										polar_line: '角度と長さの線分',
										polar_arrow: '角度と長さの矢印',
									}[commandName] || commandName
								}
							</button>
						))}
					</div>
        </div>
        <div className="p-2 border rounded bg-gray-50">
          <label htmlFor="library-select" className="text-sm font-semibold mb-1 block">ライブラリから読み込み</label>
          <select 
            id="library-select"
            onChange={(e) => handleLibrarySelect(e.target.value)}
            className="w-full p-2 border rounded"
            // URLパラメータで読み込まれたIDをデフォルトで選択状態にする
            value={loadId || ""}
          >
            <option value="">-- IDを選択 --</option>
            {Object.keys(library).map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
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
      <div className="p-4 border rounded bg-gray-50 text-black flex flex-col gap-4">
        {/* ★★★ 単位モード切り替えUIを追加 ★★★ */}
        <div>
          <label className="font-medium text-sm">単位モード</label>
          <div className="flex gap-2 mt-1">
            <button onClick={() => setUnitMode('absolute')} className={`px-3 py-1 text-sm rounded ${unitMode === 'absolute' ? 'bg-slate-600 text-white' : 'bg-gray-200'}`}>図モード</button>
            <button onClick={() => setUnitMode('relative')} className={`px-3 py-1 text-sm rounded ${unitMode === 'relative' ? 'bg-slate-600 text-white' : 'bg-gray-200'}`}>グラフモード</button>
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
        <div className="mt-auto pt-4 border-t">
          <h3 className="font-medium text-sm mb-2">エクスポート</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleExport('svg')} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">SVG</button>
            <button onClick={() => handleExport('png')} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">PNG</button>
            <button onClick={() => handleExport('jpeg')} className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700">JPG</button>
            <button onClick={() => handleExport('webp')} className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">WEBP</button>
          </div>
        </div>
			</div>
      {/* 3. 右側 */}
      <div className="rounded p-4 flex items-center justify-center overflow-auto bg-gray-50">
        <svg 
					ref={svgRef}
          viewBox={viewBox}
          className={isZoomToFit ? "w-full h-full" : ""}
          style={!isZoomToFit ? { width: manualWidth, height: manualHeight } : {}}
          preserveAspectRatio="xMidYMid meet"
        >
          {showGrid && (
            <g id="grid-area">
              <Grid viewBox={viewBox} unitMode={unitMode} />
            </g>
          )}
					{shapes.map((shape) => (
            <ShapeRenderer key={shape.id} shape={shape} />
          ))}
        </svg>
      </div>
    </div>
  );
};