	let nextId = 0;
// --- 図形オブジェクトの型定義 ---
export interface Shape {
	id: number;
  type: 'circle' | 'rect' | 'arrow' | 'label' | 'axis2d' | 'unknown';
  props: any;
	visible: boolean;
	boundingBox: { minX: number; minY: number; maxX: number; maxY: number };
  errors?: string[]; // エラーメッセージを格納
}

export type UnitMode = 'absolute' | 'relative';

const constants: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};
// 簡単な数式を評価するヘルパー関数
const evaluateExpression = (expr: string): number => {
  // "2*pi" のような形式に対応
  expr = expr.toLowerCase();
  for (const constName in constants) {
    if (expr.includes(constName)) {
      expr = expr.replace(new RegExp(constName, 'g'), String(constants[constName]));
    }
  }
  try {
    // evalはセキュリティリスクがあるため、より安全なFunctionコンストラクタを使用
    return new Function(`return ${expr}`)();
  } catch (e) {
    console.error(`Invalid expression: ${expr}`);
    return NaN;
  }
};

export const commandDefaults: Record<string, string> = {
  circle: 'circle(r=50, cx=0, cy=0, fill="none")',
  arrow: 'arrow(x1=0, y1=0, x2=100, y2=0, headSize=10)',
  label: 'label(text="x", x=0, y=0, size=16)',
  axis2d: 'axis2d(ox=0, oy=0, x1=-10, x2=100, y1=-10, y2=100, xLabel="x", yLabel="y")',
};

// --- コマンドごとのパーサーを定義 ---
const commandParsers: Record<string, (args: string, unitMode: UnitMode, canvasSize: { width: number; height: number; }) => Shape | Shape[]> = {
  circle: (args, unitMode, canvasSize) => {
    const props: any = {};
    let visible = true;
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
            props.strokeWidth = parseFloat(value) / 3;
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
    props.cx = props.cx ?? 0;
    props.cy = props.cy ?? 0;
		
    // ★★★ 単位モードに応じて値を変換 ★★★
    let absProps = { ...props };
    if (unitMode === 'relative') {
      absProps.r = props.r * 100;
      absProps.cx = props.cx * 100;
      absProps.cy = props.cy * 100;
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
          case 'headSize': props.headSize = parseFloat(value) / 5; break;
          case 'stroke': props.stroke = value.replace(/"/g, ''); break;
          case 'strokeWidth': props.strokeWidth = parseFloat(value) / 3; break;
          case 'opacity': props.opacity = parseFloat(value); break;
          case 'visible': visible = value.toLowerCase() === 'true'; break;
        }
      }
    });

    // デフォルト値の設定
    props.x1 = props.x1 ?? (unitMode === 'relative' ? 0.1 : -10);
    props.y1 = props.y1 ?? (unitMode === 'relative' ? -0.1 : 0);
    props.x2 = props.x2 ?? (unitMode === 'relative' ? 0.9 : 100);
    props.y2 = props.y2 ?? (unitMode === 'relative' ? -0.9 : 0);
    props.headSize = props.headSize ?? 2;
    props.strokeWidth = props.strokeWidth ?? 0.2;

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

  label: (args, unitMode, canvasSize) => {
    const props: any = {};
    let visible = true;
    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          case 'text':
            props.text = value.replace(/"/g, '');
            break;
          case 'x':
            props.x = parseFloat(value);
            break;
          case 'y':
            props.y = parseFloat(value) * -1;
            break;
          case 'fill':
            props.fill = value.replace(/"/g, '');
            break;
          case 'color':
            props.color = value.replace(/"/g, '');
            break;
          case 'size':
            props.size = parseFloat(value) / 3;
            break;
          case 'opacity':
            props.opacity = parseFloat(value); // 0.0 ~ 1.0 の値
            break;
          case 'visible':
            visible = value.toLowerCase() === 'true';
            break;
					case 'isMath': 
						props.isMath = value.toLowerCase() === 'true'; 
						break;
        }
      }
    });
		
    // デフォルト値
		props.text = props.text ?? '';
    props.x = props.x ?? (unitMode === 'relative' ? 0.5 : 50);
    props.y = props.y ?? (unitMode === 'relative' ? -0.5 : -50);
    props.size = props.size ?? 16;
    props.isMath = props.isMath ?? true; // デフォルトは数式として解釈

    let absProps = { ...props };
    if (unitMode === 'relative') {
      absProps.x = props.x * canvasSize.width;
      absProps.y = props.y * canvasSize.height;
      // sizeも相対的に計算する（任意）
      const avgSize = (canvasSize.width + canvasSize.height) / 2;
      absProps.size = props.size * (avgSize / 500); // 例: 16 -> 画面サイズの約3.2%
    }
    
    const labelText = absProps.text || ''; 
		const estimatedWidth = (labelText.length * absProps.size) * 0.6 + absProps.size;
		const estimatedHeight = absProps.size * 2.5;
    const boundingBox = {
      minX: absProps.x - estimatedWidth / 2,
      minY: absProps.y - estimatedHeight / 2,
      maxX: absProps.x + estimatedWidth / 2,
      maxY: absProps.y + estimatedHeight / 2,
    };

    return { id: nextId++, type: 'label', props: absProps, visible, boundingBox, errors: [] };
  },
  axis2d: (args, unitMode, canvasSize) => {
    const props: any = {
      // 4. デフォルト値を設定
      ox: 0, oy:0, x1: -10, x2: 100, y1: -10, y2: 100, xLabel: "x", yLabel: "y", stroke: "black", strokeWidth: 1, headSize: 20, labelSize: 30, 
    };
    let visible = true;

    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          case 'ox': props.ox = evaluateExpression(value); break;
          case 'oy': props.oy = evaluateExpression(value); break;
          case 'x1': props.x1 = evaluateExpression(value); break;
          case 'x2': props.x2 = evaluateExpression(value); break;
          case 'y1': props.y1 = evaluateExpression(value); break;
          case 'y2': props.y2 = evaluateExpression(value); break;
          case 'xLabel': props.xLabel = value.replace(/"/g, ''); break;
          case 'yLabel': props.yLabel = value.replace(/"/g, ''); break;
          case 'labelSize': props.labelSize = parseFloat(value); break;
          case 'stroke': props.stroke = value.replace(/"/g, ''); break;
          case 'strokeWidth': props.strokeWidth = parseFloat(value); break;
          case 'headSize': props.headSize = parseFloat(value); break;
          case 'visible': visible = value.toLowerCase() === 'true'; break;
        }
      }
    });

    if (!visible) return [];

    const generatedShapes: Shape[] = [];

    // X軸 (arrow)
    generatedShapes.push(
      commandParsers.arrow(`x1=${props.x1}, y1=0, x2=${props.x2}, y2=0, headSize=${props.headSize}, strokeWidth=${props.strokeWidth}, stroke="${props.stroke}"`, unitMode, canvasSize) as Shape
    );
		
    // Y軸 (arrow)
    generatedShapes.push(
      commandParsers.arrow(`x1=0, y1=${props.y1}, x2=0, y2=${props.y2}, headSize=${props.headSize}, strokeWidth=${props.strokeWidth}, stroke="${props.stroke}"`, unitMode, canvasSize) as Shape
    );

    // X軸ラベル (label)
    if (props.xLabel) {
      generatedShapes.push(
        commandParsers.label(`text="${props.xLabel}", x=${props.x2 + canvasSize.width / 20}, y=${props.oy}, size=${props.labelSize}, color="${props.stroke}"`, unitMode, canvasSize) as Shape
      );
    }
    // Y軸ラベル (label)
    if (props.yLabel) {
      generatedShapes.push(
        commandParsers.label(`text="${props.yLabel}", x=${props.ox}, y=${props.y2 + canvasSize.height / 20}, size=${props.labelSize}, color="${props.stroke}"`, unitMode, canvasSize) as Shape
      );
    }

    return generatedShapes;
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
  const commandRegex = /(\w+)\s*\(([\s\S]*?)\)(?=\s*\w+\s*\(|\s*$)/g;
  let shapes: Shape[] = [];
	nextId = 0;
  let match;

  while ((match = commandRegex.exec(text)) !== null) {
    const commandName = match[1];
    let args = match[2];

    // 対応するカッコを見つけるロジック
    let balance = 0;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '(') balance++;
      if (args[i] === ')') balance--;
    }

    // カッコのバランスが崩れている場合、修正を試みる
    if (balance > 0) {
      const remainingText = text.substring(match.index + match[0].length);
      let closingBraceIndex = -1;
      for (let i = 0; i < remainingText.length; i++) {
        if (remainingText[i] === ')') balance--;
        if (balance === 0) {
          closingBraceIndex = i;
          break;
        }
      }
      if (closingBraceIndex !== -1) {
        args += remainingText.substring(0, closingBraceIndex + 1);
        // execのポインタを進める
        commandRegex.lastIndex = match.index + match[0].length + closingBraceIndex + 1;
      }
    }
    
    const parser = commandParsers[commandName];
    if (parser) {
      const result = parser(args, unitMode, canvasSize);
      if (Array.isArray(result)) {
        shapes = shapes.concat(result);
      } else {
        shapes.push(result);
      }
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