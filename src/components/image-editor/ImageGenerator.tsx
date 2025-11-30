'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import Editor from '@monaco-editor/react';
import { parseCommands, Shape, UnitMode, commandDefaults } from './parser';
import { getImageSourceById, getAllImageSources } from '@/lib/imageLibrary'; 
import { Switch } from '@headlessui/react';
import { Grid } from './Grid';
import { InlineMath } from 'react-katex';
import { exportAsSVG, exportAsRaster } from './exporter';
import { 
  CodeBracketIcon, 
  Square2StackIcon, 
	Square3Stack3DIcon,
	TableCellsIcon,
  InformationCircleIcon, 
  BookOpenIcon,
	CircleStackIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

// --- 型定義とユーティリティ ---
declare global { interface Window { MathJax: any; } }
function mathMod(n: number, m: number) { return ((n % m) + m) % m; }
const polarToCartesian = (centerX: number, centerY: number, radiusX: number, radiusY: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees) * Math.PI / 180.0;
  return { x: centerX + (radiusX * Math.cos(angleInRadians)), y: (centerY + (radiusY * Math.sin(angleInRadians)))* -1 };
};

// --- VectorLabel (MathJax) ---
const VectorLabel = ({ text, color, size, width, height }: any) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.MathJax && window.MathJax.tex2svg) {
      try {
        const svgNode = window.MathJax.tex2svg(text);
        const svgElement = svgNode.firstElementChild;
        if (svgElement) {
          svgElement.setAttribute('fill', color);
          svgElement.setAttribute('stroke', 'none');
          svgElement.setAttribute('height', `${size}px`);
          svgElement.setAttribute('width', 'auto');
          svgElement.style.color = color;
          svgElement.setAttribute('overflow', 'visible');
          setSvgContent(svgElement.outerHTML);
        }
      } catch (e) { console.error(e); }
    }
  }, [text, color, size]);
  if (!svgContent) {
    return (
      <svg width="100%" height="100%">
        <text 
          fill={color} 
          fontSize={size} 
          x="50%" 
          y="50%" 
          dominantBaseline="middle" 
          textAnchor="middle"
        >
          ...
        </text>
      </svg>
    );
  }
  return (
    <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
      <g 
        dangerouslySetInnerHTML={{ __html: svgContent }} 
        style={{ display: 'block', transformBox: 'fill-box', transformOrigin: 'center' }} 
        transform={`translate(${width/2}, ${height/2}) translate(-50%, -50%)`} 
      />
    </svg>
  );
};

const MathLabelRenderer = ({ x, y, width, height, text, size, color, renderMode }: any) => {
  if (renderMode === 'vector') {
    return (
       <svg x={x} y={y} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <foreignObject width="100%" height="100%" style={{ overflow: 'visible' }}>
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                <VectorLabel text={text} color={color} size={size} width={width} height={height} />
             </div>
          </foreignObject>
       </svg>
    );
  }
  return (
    <foreignObject x={x} y={y} width={width} height={height} overflow="visible">
      <div style={{ fontSize: `${size}px`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
        <InlineMath math={text} />
      </div>
    </foreignObject>
  );
}

// --- ShapeRenderer (ハイライト機能付き) ---
const ShapeRenderer = ({ shape, renderMode, isHovered }: { shape: Shape, renderMode: 'vector' | 'html', isHovered: boolean }) => {
	if (!shape.visible) return null;

  // ハイライト用の枠線（ホバー時のみ表示）
  const HighlightBox = () => {
    if (!isHovered) return null;
    const { minX, minY, maxX, maxY } = shape.boundingBox;
    const padding = 2;
    return (
      <rect 
        x={minX - padding} 
        y={minY - padding} 
        width={maxX - minX + padding * 2} 
        height={maxY - minY + padding * 2} 
        fill="none" 
        stroke="#3b82f6"
        strokeWidth="1" 
        strokeDasharray="4 2"
        opacity="0.8"
        pointerEvents="none"
      />
    );
  };

  const Content = () => {
    switch (shape.type) {
      case 'circle':
      case 'ellipse':
      case 'line':
        const TagName = shape.type as any;
        return <TagName {...shape.props} fill={shape.props.fill || 'none'} stroke={shape.props.stroke || 'black'} />;
      case 'arrow': {
        const { x1, y1, x2, y2, headSize = 10, ...restProps } = shape.props;
        const strokeColor = restProps.stroke || 'black';
        const dx = x2 - x1, dy = y2 - y1;
        const angleRad = Math.atan2(dy, dx);
        const newX2 = x2 - (1.5 * headSize) * Math.cos(angleRad);
        const newY2 = y2 - (1.5 * headSize) * Math.sin(angleRad);
        return (
          <g {...restProps} stroke={strokeColor}>
            <line x1={x1} y1={y1} x2={newX2} y2={newY2} />
            <path d="M0,0 L-15,-5 L-15,5 z" fill={strokeColor} transform={`translate(${x2}, ${y2}) rotate(${angleRad * 180 / Math.PI}) scale(${headSize / 10})`} />
          </g>
        );
      }
      case 'label': {
        const { text, size = 16, color = 'black', isMath = true } = shape.props;
        if (!text || text.trim() === '') return null;
        const { minX, minY, maxX, maxY } = shape.boundingBox;
        if (isMath) return <MathLabelRenderer x={minX} y={minY} width={maxX-minX} height={maxY-minY} text={text} size={size} color={color} renderMode={renderMode} />;
        return (
          <foreignObject x={minX} y={minY} width={maxX-minX} height={maxY-minY} overflow="visible">
            <div style={{ fontSize: `${size}px`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}><span>{text}</span></div>
          </foreignObject>
        );
      }
      case 'arc': {
        const { cx, cy, rx, ry, startAngle, endAngle, ...rest } = shape.props;
        const start = polarToCartesian(cx, cy, rx, ry, startAngle);
        const end = polarToCartesian(cx, cy, rx, ry, endAngle);
        let diff = mathMod(endAngle, 360) - mathMod(startAngle, 360);
        if (diff < 0) diff += 360;
        const d = ["M", start.x, start.y, "A", rx, ry, 0, diff <= 180 ? "0" : "1", 0, end.x, end.y].join(" ");
        return <path d={d} fill="none" stroke={rest.stroke || "black"} strokeWidth={rest.strokeWidth ?? 1} {...rest} />;
      }
      case 'path': return <path {...shape.props} />;
      default: return null;
    }
  };

  return (
    <g>
      <Content />
      <HighlightBox />
    </g>
  );
};

/**
 * 英語のキーを対応する日本語へ翻訳するためのマッピング
 */
const translationMap: Record<string, string> = {
  'ellipse': '楕円',
  'circle': '円',
  'rect': '長方形',
  'arrow': '矢印',
  'label': 'ラベル',
  'axis2d': '2D軸',
  'arc': '円弧',
  'angle': '角度',
  'line': '線',
  'polar_arrow': '極座標矢印',
  'polar_line': '極座標線',
  'ellipsoid_slice': '楕円体切断面',
  'ellipsoid_slice_polar': '極座標楕円体切断面',
  'ellipse_in_ellipse': '楕円内楕円',
  'ellipse_in_ellipse_polar': '極座標楕円内楕円',
  'arc_fit_ellipse': '楕円内円弧',
  'arc_fit_ellipse_polar': '極座標楕円内円弧',
  'dimension_line': '寸法線',
  'path': 'パス',
};

/**
 * 指定された英語のキーに対応する日本語訳を取得する関数
 * @param key 翻訳したい英語のキー
 * @returns 対応する日本語訳、またはキーが見つからない場合は元のキーを返す
 */
export const translateKeyToJapanese = (key: string): string => {
  return translationMap[key] || key;
};

// --- サイドバー用アイコンボタン ---
const SidebarTab = ({ icon: Icon, active, onClick, tooltip }: any) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`w-11 h-12 flex items-center justify-center  rounded-l-lg shadow-white transition-colors cursor-pointer ${
      active ? 'text-slate-600 bg-slate-50' : 'text-slate-400 hover:text-slate-500 hover:bg-slate-300'
    }`}
  >
    <Icon className="w-6 h-6" />
  </button>
);

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
  const [showGrid, setShowGrid] = useState(true);
  const [renderMode, setRenderMode] = useState<'vector' | 'html'>('vector');
  const [viewBox, setViewBox] = useState('0 0 100 100');
  
  // UI State
  const [activeTab, setActiveTab] = useState<'editor' | 'layers' | 'inspector' | 'library'>('editor');
  const [hoveredShapeId, setHoveredShapeId] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

	const editorRef = useRef<any>(null);
	const monacoRef = useRef<any>(null);
	const svgRef = useRef<SVGSVGElement>(null);
  const gridRef = useRef<SVGGElement>(null);
	
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomTargetRef = useRef<HTMLDivElement>(null);
	
  useEffect(() => {
    setLibrary(getAllImageSources());
    if (loadId) {
      const source = getImageSourceById(loadId);
      setCommandText(source ? source : `// Error: ID "${loadId}" not found.`);
    } else {
      setCommandText('axis2d()\ncircle(r=100, cx=0, cy=0, fill="none")');
    }
  }, [loadId]);
	
  useEffect(() => {
    const canvasSize = { width: manualWidth, height: manualHeight };
    const parsedShapes = parseCommands(commandText, unitMode, canvasSize);
    setShapes(parsedShapes);
  }, [commandText, unitMode, manualWidth, manualHeight]);
	
  useEffect(() => {
    if (!isAutoFit || shapes.length === 0) {
      const width = manualWidth || 100;
      const height = manualHeight || 100;
      setViewBox(`0 ${-height} ${width} ${height}`);
      return;
    }
    let totalBBox = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    const visibleShapes = shapes.filter(s => s.visible);
    if (visibleShapes.length === 0) {
      setViewBox('0 -100 100 100'); 
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
	
  const handleVisibilityChange = (id: number, visible: boolean) => {
    setShapes(cur => cur.map(s => s.id === id ? { ...s, visible } : s));
  };

  const handleInsertCommand = (commandName: string) => {
    const editor = editorRef.current;
    if (!editor || !monacoRef.current) return;
    const defaultCommand = commandDefaults[commandName];
    let textToInsert = defaultCommand;
    const currentText = editor.getValue();
    if (currentText.trim().length > 0 && !currentText.endsWith('\n\n')) {
      textToInsert = currentText.endsWith('\n') ? defaultCommand : '\n' + defaultCommand;
    }
    const lastLine = editor.getModel().getLineCount();
    const lastColumn = editor.getModel().getLineMaxColumn(lastLine);
    editor.executeEdits('insert-command', [{ range: new monacoRef.current.Range(lastLine, lastColumn, lastLine, lastColumn), text: textToInsert }]);
    editor.focus();
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
		editorRef.current = editor;
    monaco.languages.register({ id: 'imggen-lang' });
		monacoRef.current = monaco;
    monaco.languages.setMonarchTokensProvider('imggen-lang', {
      tokenizer: {
        root: [
          [/[a-zA-Z_]\w*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
          [/[()]/, '@brackets'],
          [/\d+/, 'number'],
          [/"[^"]*"/, 'string'],
        ]
      },
      keywords: Object.keys(commandDefaults),
    });
  };

  const handleExport = (format: 'svg' | 'png' | 'jpeg' | 'webp') => {
    if (!svgRef.current) return;
		const excludedElements: Element[] = [];
		if (showGrid && gridRef.current) excludedElements.push(gridRef.current);
    const filename = `science-img-${new Date().getTime()}`;
    format === 'svg' ? exportAsSVG(svgRef.current, filename, excludedElements) : exportAsRaster(svgRef.current, filename, format, excludedElements);
  };

  // ホイールズーム処理


  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!containerRef.current || !zoomTargetRef.current) return;

    // --- Originの計算と適用 ---
    const containerRect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const offsetY = e.clientY - containerRect.top;
    
    // DOM要素に直接 transform-origin を設定
    zoomTargetRef.current.style.transformOrigin = `${offsetX}px ${offsetY}px`;

    // --- Zoom Levelの計算と適用 ---
    const delta = -e.deltaY * 0.001;
    setZoomLevel(Math.max(0.1, Math.min(10, zoomLevel + delta)));

    // DOM要素に直接 scale を設定
    zoomTargetRef.current.style.transform = `scale(${zoomLevel})`;
  };
	
	
  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" strategy="afterInteractive" onLoad={() => { if (window.MathJax) { window.MathJax.config = { tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] }, svg: { fontCache: 'local' } }; window.MathJax.startup.getComponents(); } }} />

      {/* Header */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-800 text-white rounded flex items-center justify-center font-bold text-sm">S</div>
          <h1 className="font-bold text-sm text-slate-700">SCIENCE to IMG</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Export</span>
          <div className="flex bg-slate-100 rounded p-0.5">
            {['svg', 'png', 'jpeg'].map((fmt: any) => (
              <button key={fmt} onClick={() => handleExport(fmt)} className="px-3 py-1 text-[10px] font-bold uppercase rounded cursor-pointer hover:bg-white hover:shadow-sm transition-all text-slate-600">{fmt}</button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* --- Left Sidebar (Activity Bar + Panel) --- */}
        <div className="flex shrink-0 z-10 h-full">
          {/* Activity Bar (Icons) */}
          <div className="w-12 pt-2 bg-slate-200 flex flex-col items-end">
            <SidebarTab icon={CodeBracketIcon} active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} tooltip="Editor" />
            <SidebarTab icon={Square3Stack3DIcon} active={activeTab === 'layers'} onClick={() => setActiveTab('layers')} tooltip="Layers" />
            <SidebarTab icon={TableCellsIcon} active={activeTab === 'inspector'} onClick={() => setActiveTab('inspector')} tooltip="Inspector" />
            <SidebarTab icon={CircleStackIcon} active={activeTab === 'library'} onClick={() => setActiveTab('library')} tooltip="Library" />
          </div>

          {/* Side Panel Content (Resizable-like fixed width) */}
          <div className="w-[500px] bg-white border-r border-slate-200 flex flex-col">
            
            {/* 1. EDITOR TAB */}
            {activeTab === 'editor' && (
              <>
                <div className="flex-1 relative">
                  <Editor
                    height="100%"
                    language="imggen-lang"
                    theme="vs-light"
                    value={commandText}
                    onChange={(v) => setCommandText(v || '')}
                    onMount={handleEditorDidMount}
                    options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'on', wordWrap: 'on', padding: { top: 12, bottom: 12 }, fontFamily: "'JetBrains Mono', monospace" }}
                  />
                </div>
                <div className="p-2 bg-slate-50 border-b border-slate-100 grid grid-cols-4 gap-1">
                   {['ellipse', 'circle', 'rect', 'arrow', 'label', 'axis2d', 'arc', 'angle', 'line', 'polar_arrow', 'polar_line', 'ellipsoid_slice', 'ellipsoid_slice_polar', 'arc_fit_ellipse', 'arc_fit_ellipse_polar', 'dimension_line', 'path'].map(cmd => (
                     <button key={cmd} onClick={() => handleInsertCommand(cmd)} className="px-1 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-600 hover:border-slate-400 hover:text-slate-600 cursor-pointer transition-all shadow-sm truncate" title={cmd}>
                       {translateKeyToJapanese(cmd)}
                     </button>
                   ))}
                </div>
              </>
            )}

            {/* 2. LAYERS TAB */}
            {activeTab === 'layers' && (
              <div className="flex-1 overflow-y-auto bg-slate-50 p-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Layers</h3>
                <div className="space-y-1">
                  {shapes.map((shape, idx) => (
                    <div 
                      key={shape.id} 
											className={`flex items-center gap-2 p-2 rounded select-none border-1 cursor-pointer transition-colors ${
												shape.visible 
													? hoveredShapeId === shape.id 
														? 'border-slate-300 bg-slate-200 shadow-sm'
														: 'border-slate-100 bg-white'
													: 'border-slate-400 bg-slate-300 opacity-60'
											}`}

                      onMouseEnter={() => setHoveredShapeId(shape.id)}
                      onMouseLeave={() => setHoveredShapeId(null)}
											onClick={() => handleVisibilityChange(shape.id, !shape.visible)} 
                    >
                      <button className="text-slate-400 cursor-pointer hover:text-slate-600">
                        {shape.visible ? <EyeIcon className="w-4 h-4"/> : <EyeSlashIcon className="w-4 h-4"/>}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-700 truncate">{shape.type} {shape.props.text ? `（${shape.props.text}）` : ''}</div>
                        <div className="text-[10px] text-slate-400 truncate">ID: {shape.id}</div>
                      </div>
											<div className="w-3 h-3 rounded-full" style={{backgroundColor: shape.props.fill || shape.props.color || 'transparent', border: shape.props.stroke ? `1px solid ${shape.props.stroke}` : 'none'}}></div>
                    </div>
                  ))}
                  {shapes.length === 0 && <div className="text-xs text-slate-400 p-2 text-center">No layers found</div>}
                </div>
              </div>
            )}

            {/* 3. INSPECTOR TAB */}
            {activeTab === 'inspector' && (
              <div className="flex-1 overflow-y-auto bg-slate-50 p-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Properties Inspector</h3>
                <div className="space-y-4">
                  {shapes.map((shape) => (
                    <div 
                      key={shape.id} 
                      className={`bg-white border rounded text-xs overflow-hidden transition-all ${hoveredShapeId === shape.id ? 'ring-1 ring-blue-500 border-blue-500' : 'border-slate-200'}`}
                      onMouseEnter={() => setHoveredShapeId(shape.id)}
                      onMouseLeave={() => setHoveredShapeId(null)}
                    >
                      <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex justify-between items-center font-bold text-slate-700">
                        <span>{shape.type}</span>
                        <span className="text-[10px] font-normal text-slate-500">#{shape.id}</span>
                      </div>
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          {Object.entries(shape.props).map(([key, val]) => (
                            <tr key={key} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                              <td className="px-3 py-1.5 text-slate-500 font-medium w-1/3 border-r border-slate-100">{key}</td>
                              <td className="px-3 py-1.5 text-slate-700 font-mono truncate max-w-[150px]" title={String(val)}>
                                {String(val)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. LIBRARY TAB */}
            {activeTab === 'library' && (
               <div className="flex-1 overflow-y-auto bg-slate-50 p-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">Examples</h3>
                  <div className="space-y-2">
                    {Object.keys(library).map(id => (
                      <button key={id} onClick={() => { setCommandText(library[id]); setActiveTab('editor'); }} className="w-full text-left p-3 bg-white border border-slate-200 rounded cursor-pointer hover:border-slate-400 hover:shadow-md transition-all group">
                        <span className="text-xs font-bold text-slate-700 group-hover:text-slate-600 block mb-1">{id}</span>
                        <span className="text-[10px] text-slate-400 block">Click to load preset</span>
                      </button>
                    ))}
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* --- Right Canvas Area --- */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-100 relative">
          
          {/* Floating Toolbar */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur shadow-sm border border-slate-200 p-1.5 rounded-lg">
               <button onClick={() => setRenderMode('vector')} className={`px-2 py-1 text-[10px] font-bold rounded ${renderMode==='vector' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>Vector</button>
               <button onClick={() => setRenderMode('html')} className={`px-2 py-1 text-[10px] font-bold rounded ${renderMode==='html' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>HTML</button>
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur shadow-sm border border-slate-200 p-1.5 rounded-lg px-3">
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-slate-400">FIT</span>
                 <Switch checked={isAutoFit} onChange={setIsAutoFit} className={`${isAutoFit ? 'bg-blue-600' : 'bg-slate-200'} relative inline-flex h-4 w-7 items-center rounded-full transition-colors`}>
                   <span className={`${isAutoFit ? 'translate-x-3.5' : 'translate-x-0.5'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`} />
                 </Switch>
               </div>
               <div className="w-px h-3 bg-slate-200 mx-1"></div>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-slate-400">GRID</span>
                 <Switch checked={showGrid} onChange={setShowGrid} className={`${showGrid ? 'bg-blue-600' : 'bg-slate-200'} relative inline-flex h-4 w-7 items-center rounded-full transition-colors`}>
                   <span className={`${showGrid ? 'translate-x-3.5' : 'translate-x-0.5'} inline-block h-3 w-3 transform rounded-full bg-white transition-transform`} />
                 </Switch>
               </div>
            </div>
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur shadow-sm border border-slate-200 p-1.5 rounded-lg">
                <button onClick={() => setZoomLevel(z => Math.max(0.1, z - 0.1))} className="p-1 hover:bg-slate-100 rounded text-slate-500"><MagnifyingGlassMinusIcon className="w-4 h-4"/></button>
                <span className="text-[10px] font-mono w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={() => setZoomLevel(z => Math.min(10, z + 0.1))} className="p-1 hover:bg-slate-100 rounded text-slate-500"><MagnifyingGlassPlusIcon className="w-4 h-4"/></button>
            </div>
          </div>

          {/* Canvas Wrapper (Zoom & Scroll) */}
          <div className="flex-1 overflow-hidden flex items-center justify-center bg-slate-200 relative">
            <div 
              className="w-full h-full overflow-auto flex items-center justify-center p-12"
							ref={containerRef}
              onWheel={handleWheel} // スクロールでズーム
            >
               <div 
								ref={zoomTargetRef} 
                style={{
                  transition: 'transform 0.1s ease-out'
                }}
                className="shadow-2xl bg-white"
               >
                 {/* 市松模様背景 */}
                 <div 
                    style={{
                      width: isAutoFit ? '600px' : manualWidth, // AutoFit時は仮のコンテナサイズ（SVG自体はviewBoxで調整）
                      height: isAutoFit ? '600px' : manualHeight,
                      // SVGがAutoFitの場合、width/heightを100%にしてviewBoxで制御するため、コンテナサイズは見た目上の枠になる
                      // ここでは簡易的に、AutoFit時は固定の大きめの枠に見せかけ、SVGをその中に配置する
                      backgroundImage: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }}
                    className="relative flex items-center justify-center bg-white"
                 >
                    <svg 
                      ref={svgRef}
                      viewBox={viewBox}
                      // AutoFit時は親いっぱいに広げるが、親のdivをtransformしている
                      style={{ 
                        width: isAutoFit ? '100%' : manualWidth, 
                        height: isAutoFit ? '100%' : manualHeight 
                      }}
                      className="block"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {showGrid && <g ref={gridRef}><Grid viewBox={viewBox} unitMode={unitMode} /></g>}
                      {shapes.map((shape) => (
                        <ShapeRenderer key={shape.id} shape={shape} renderMode={renderMode} isHovered={hoveredShapeId === shape.id} />
                      ))}
                    </svg>
                 </div>
               </div>
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="h-6 bg-white border-t border-slate-200 flex items-center px-4 text-[10px] text-slate-400 justify-between shrink-0 z-10">
             <div className="flex gap-4">
                <span>ViewBox: {viewBox}</span>
                <span>Elements: {shapes.length}</span>
             </div>
             <div>
                {hoveredShapeId !== null ? `Highlighting ID: ${hoveredShapeId}` : 'Ready'}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};