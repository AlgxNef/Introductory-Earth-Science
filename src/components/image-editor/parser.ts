	let nextId = 0;
// --- 図形オブジェクトの型定義 ---
export interface Shape {
	id: number;
  type: 'circle' | 'rect' | 'arrow' | 'unknown';
  props: any;
	visible: boolean;
	boundingBox: { minX: number; minY: number; maxX: number; maxY: number };
  errors?: string[]; // エラーメッセージを格納
}

export type UnitMode = 'absolute' | 'relative';

// --- コマンドごとのパーサーを定義 ---
const commandParsers: Record<string, (args: string, unitMode: UnitMode, canvasSize: { width: number; height: number }) => Shape> = {
  circle: (args, unitMode, canvasSize) => {
    const props: any = {}; // デフォルトは相対値と仮定
    let visible = true;

    // "key=value"のペアを解析
    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          case 'r':
            props.r = parseFloat(value);
            break;
          case 'cx':
            props.cx = parseFloat(value);
            break;
          case 'cy':
            props.cy = parseFloat(value) * -1;
            break;
          case 'fill':
            props.fill = value.replace(/"/g, '');
            break;
          case 'stroke':
            props.stroke = value.replace(/"/g, '');
            break;
          case 'strokeWidth':
            props.strokeWidth = parseFloat(value);
            break;
          case 'opacity':
            props.opacity = parseFloat(value); // 0.0 ~ 1.0 の値
            break;
          case 'visible':
            visible = value.toLowerCase() === 'true';
            break;
        }
      }
    });
		
    props.r = props.r ?? (unitMode === 'relative' ? 0.1 : 10);
    props.cx = props.cx ?? (unitMode === 'relative' ? 0.5 : 50);
    props.cy = props.cy ?? (unitMode === 'relative' ? -0.5 : -50);
		
    // ★★★ 単位モードに応じて値を変換 ★★★
    let absProps = { ...props };
    if (unitMode === 'relative') {
      const avgSize = (canvasSize.width + canvasSize.height) / 2;
      absProps.r = props.r * avgSize;
      absProps.cx = props.cx * canvasSize.width;
      absProps.cy = props.cy * canvasSize.height;
    }

    const boundingBox = {
      minX: absProps.cx - absProps.r,
      minY: absProps.cy - absProps.r,
      maxX: absProps.cx + absProps.r,
      maxY: absProps.cy + absProps.r,
    };
    return { id: nextId++, type: 'circle', props: absProps, visible, boundingBox };
  },
  
  arrow: (args, unitMode, canvasSize) => {
    const props: any = {};
    let visible = true;

    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          case 'x1': props.x1 = parseFloat(value); break;
          case 'y1': props.y1 = parseFloat(value) * -1; break;
          case 'x2': props.x2 = parseFloat(value); break;
          case 'y2': props.y2 = parseFloat(value) * -1; break;
          case 'headSize': props.headSize = parseFloat(value); break;
          case 'stroke': props.stroke = value.replace(/"/g, ''); break;
          case 'strokeWidth': props.strokeWidth = parseFloat(value); break;
          case 'opacity': props.opacity = parseFloat(value); break;
          case 'visible': visible = value.toLowerCase() === 'true'; break;
        }
      }
    });

    // デフォルト値の設定
    props.x1 = props.x1 ?? (unitMode === 'relative' ? 0.1 : 10);
    props.y1 = props.y1 ?? (unitMode === 'relative' ? -0.1 : -10);
    props.x2 = props.x2 ?? (unitMode === 'relative' ? 0.9 : 90);
    props.y2 = props.y2 ?? (unitMode === 'relative' ? -0.9 : -90);
    props.headSize = props.headSize ?? 10;

    let absProps = { ...props };
    if (unitMode === 'relative') {
      absProps.x1 = props.x1 * canvasSize.width;
      absProps.y1 = props.y1 * canvasSize.height;
      absProps.x2 = props.x2 * canvasSize.width;
      absProps.y2 = props.y2 * canvasSize.height;
      const avgSize = (canvasSize.width + canvasSize.height) / 2;
      absProps.headSize = props.headSize * (avgSize / 100);
    }

    // Bounding Boxの計算
    const boundingBox = {
      minX: Math.min(absProps.x1, absProps.x2),
      minY: Math.min(absProps.y1, absProps.y2),
      maxX: Math.max(absProps.x1, absProps.x2),
      maxY: Math.max(absProps.y1, absProps.y2),
    };
    
    return { id: nextId++, type: 'arrow', props: absProps, visible, boundingBox, errors: [] };
  },
	// 今後、rectコマンドを追加する場合
  // rect: (args) => { ... },
};

// --- メインの解析関数 ---
export const parseCommands = (
  text: string, 
  unitMode: UnitMode, 
  canvasSize: { width: number; height: number }
): Shape[] => {
  const commandRegex = /(\w+)\((.*?)\)/g; // "command(arguments)"の形式にマッチ
  const shapes: Shape[] = [];
	nextId = 0;
  let match;

  // 複数行のテキスト全体からコマンドを抽出
  while ((match = commandRegex.exec(text)) !== null) {
    const commandName = match[1];
    const args = match[2];

    const parser = commandParsers[commandName];
    if (parser) {
      shapes.push(parser(args, unitMode, canvasSize));
    } else {
      shapes.push({ 
        id: nextId++,
        type: 'unknown', 
        props: {}, 
        visible: false,
        boundingBox: { minX: 0, minY: 0, maxX: 0, maxY: 0 },
        errors: [`Unknown command: ${commandName}`] 
      });
    }
  }
  return shapes;
};