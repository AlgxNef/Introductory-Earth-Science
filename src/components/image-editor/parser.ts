import { vec3, mat4 } from 'gl-matrix';
	let nextId = 0;
// --- 図形オブジェクトの型定義 ---
export interface Shape {
	id: number;
  type: 'ellipse' | 'circle' | 'rect' | 'arrow' | 'label' | 'axis2d' | 'arc' | 'angle' | 'line' | 'polar_arrow' | 'polar_line' | 'ellipsoid_slice' | 'ellipsoid_slice_polar' | 'unknown';
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
/**
 * 数学的なモジュロ演算 (常に 0 <= result < m) を行います。
 */
function mathMod(n: number, m: number): number {
    return ((n % m) + m) % m;
}
// 例: mathMod(-30, 360) は 330 を返します。

export const commandDefaults: Record<string, string> = {
  label: 'label(text="x", x=0, y=0, size=16)',
  line: 'line(x1=0, y1=0, x2=100, y2=100)',
  polar_line: 'polar_line(ox=0, oy=0, r=100, angle=30)',
  arrow: 'arrow(x1=0, y1=0, x2=100, y2=0, headSize=10)',
  polar_arrow: 'polar_arrow(ox=0, oy=0, r=100, angle=30)',
  axis2d: 'axis2d(ox=0, oy=0, x1=-10, x2=120, y1=-10, y2=120, xLabel="x", yLabel="y")',
  arc: 'arc(cx=0, cy=0, rx=50, startAngle=0, endAngle=90, strokeWidth=5, stroke="blue")',
  angle: 'angle(cx=0, cy=0, r=25, startAngle=0, endAngle=45, text="\\theta", textSize=35, textOffset=1.3)',
  circle: 'circle(r=100, cx=0, cy=0, fill="none")',
  ellipse: 'ellipse(rx=100, ry=80, cx=0, cy=0, fill="none")',
  ellipsoid_slice: 'ellipsoid_slice(viewAngle=30, viewDistance=200, ox=0, cz=50, edgeX=100, edgeY=0, side="front")',
  ellipsoid_slice_polar: 'ellipsoid_slice_polar(cx=100, cy=100, cz=100, angle=0, viewAngle=30, side="front")',
};

// --- コマンドごとのパーサーを定義 ---
const commandParsers: Record<string, (args: string, unitMode: UnitMode, canvasSize: { width: number; height: number; }) => Shape | Shape[]> = {

  line: (args, unitMode, canvasSize) => {
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
    props.strokeWidth = props.strokeWidth ?? 0.2;

    let absProps = { ...props };
    if (unitMode === 'relative') {
      absProps.x1 = props.x1 * canvasSize.width;
      absProps.y1 = props.y1 * canvasSize.height;
      absProps.x2 = props.x2 * canvasSize.width;
      absProps.y2 = props.y2 * canvasSize.height;
      const avgSize = (canvasSize.width + canvasSize.height) / 2;
    }

    // Bounding Boxの計算
    const boundingBox = {
      minX: Math.min(absProps.x1, absProps.x2),
      minY: Math.min(absProps.y1, absProps.y2),
      maxX: Math.max(absProps.x1, absProps.x2),
      maxY: Math.max(absProps.y1, absProps.y2),
    };
    
    return { id: nextId++, type: 'line', props: absProps, visible, boundingBox, errors: [] };
  },
	
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
  	
  ellipse: (args, unitMode, canvasSize) => {
    const props: any = {};
    let visible = true;
    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          case 'rx':
            props.rx = parseFloat(value);
            break;
          case 'ry':
            props.ry = parseFloat(value);
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
    return { id: nextId++, type: 'ellipse', props: absProps, visible, boundingBox };
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
	
	
  arc: (args, unitMode, canvasSize) => {
    const props: any = {};
    let visible = true;

    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          case 'cx': props.cx = parseFloat(value); break;
          case 'cy': props.cy = parseFloat(value) * -1; break; // Y軸反転
          case 'rx': props.rx = parseFloat(value); break; // X軸半径
          case 'ry': props.ry = parseFloat(value); break; // Y軸半径
          case 'startAngle': props.startAngle = parseFloat(value); break; // 始点角 (度)
          case 'endAngle': props.endAngle = parseFloat(value); break;     // 終点角 (度)
          case 'stroke': props.stroke = value.replace(/"/g, ''); break;
          case 'strokeWidth': props.strokeWidth = parseFloat(value); break;
          case 'opacity': props.opacity = parseFloat(value); break;
          case 'visible': visible = value.toLowerCase() === 'true'; break;
        }
      }
    });

    // デフォルト値
    props.cx = props.cx ?? 0;
    props.cy = props.cy ?? 0;
    props.rx = props.rx ?? (unitMode === 'relative' ? 0.5 : 50);
    // ryが指定されなければ、rxと同じ値（真円）にする
    props.ry = props.ry ?? props.rx;
    props.startAngle = props.startAngle ?? 0;
    props.endAngle = props.endAngle ?? 90;

    let absProps = { ...props };
    if (unitMode === 'relative') {
      const avgSize = (canvasSize.width + canvasSize.height) / 2;
      absProps.cx = props.cx * canvasSize.width;
      absProps.cy = props.cy * canvasSize.height;
      absProps.rx = props.rx * avgSize;
      absProps.ry = props.ry * avgSize;
    }

    // Bounding Boxの計算
    // 簡単のため、円弧を囲む楕円全体を境界とする
    const boundingBox = {
      minX: absProps.cx - absProps.rx,
      minY: absProps.cy - absProps.ry,
      maxX: absProps.cx + absProps.rx,
      maxY: absProps.cy + absProps.ry,
    };
    
    return { id: nextId++, type: 'arc', props: absProps, visible, boundingBox, errors: [] };
  },

  angle: (args, unitMode, canvasSize) => {
    const props: any = {};
    let visible = true;

    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          case 'cx': props.cx = parseFloat(value); break;
          case 'cy': props.cy = parseFloat(value); break;
          case 'r': props.r = parseFloat(value); break;
          case 'startAngle': props.startAngle = parseFloat(value); break;
          case 'endAngle': props.endAngle = parseFloat(value); break;
          case 'text': props.text = value.replace(/"/g, ''); break; // 表示するラベル（例: "θ"）
          case 'textOffset': props.textOffset = parseFloat(value); break; // ラベルの位置調整
          case 'textSize': props.textSize = parseFloat(value); break;
          case 'stroke': props.stroke = value.replace(/"/g, ''); break;
          case 'strokeWidth': props.strokeWidth = parseFloat(value); break;
          case 'visible': visible = value.toLowerCase() === 'true'; break;
        }
      }
    });

    // デフォルト値
    props.cx = props.cx ?? 0;
    props.cy = props.cy ?? 0;
    props.r = props.r ?? 20;
    props.startAngle = props.startAngle ?? 0;
    props.endAngle = props.endAngle ?? 45;
    props.textOffset = props.textOffset ?? 1.2; // ラベルを円弧の少し外側に配置
    props.textSize = props.textSize ?? 16;
		props.strokeWidth = props.strokeWidth ?? 0.5;

    if (!visible) return [];

    const generatedShapes: Shape[] = [];
    const stroke = props.stroke || 'black';

    // 1. 円弧 (arcコンポーネントを内部的に生成)
    // 正円なのでrxとryは同じ
    const arcCommand = `cx=${props.cx}, cy=${props.cy}, rx=${props.r}, ry=${props.r}, startAngle=${props.startAngle}, endAngle=${props.endAngle}, stroke="${stroke}", strokeWidth=${props.strokeWidth}`;
    generatedShapes.push(commandParsers.arc(arcCommand, 'absolute', canvasSize) as Shape);

    // 2. 角度ラベル (labelコンポーネントを内部的に生成)
    if (props.text) {
      // 角の二等分線の角度を計算
			const normalizedStart = mathMod(props.startAngle, 360);
			const normalizedEnd = mathMod(props.endAngle, 360) >= normalizedStart ? mathMod(props.endAngle, 360) : mathMod(props.endAngle, 360) + 360;

      const midAngle = ((normalizedStart + normalizedEnd) / 2);
			
      const angleInRadians = (midAngle) * Math.PI / 180.0;
      const labelRadius = props.r * props.textOffset;
      const labelX = props.cx + labelRadius * Math.cos(angleInRadians);
      const labelY = props.cy + labelRadius * Math.sin(angleInRadians);

      const labelCommand = `text="${props.text}", x=${labelX}, y=${labelY}, size=${props.textSize}, color="${stroke}", isMath=true`;
      generatedShapes.push(commandParsers.label(labelCommand, 'absolute', canvasSize) as Shape);
    }

    return generatedShapes;
  },

  polar_arrow: (args, unitMode, canvasSize) => {
    const props: any = {};

    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          // 極座標のパラメータ
          case 'ox': props.ox = parseFloat(value); break; // 原点のX座標
          case 'oy': props.oy = parseFloat(value); break; // 原点のY座標
          case 'r': props.r = parseFloat(value); break;  // 距離（半径）
          case 'angle': props.angle = parseFloat(value); break; // 角度 (度)
          
          // arrowに渡すその他のスタイル属性
          case 'headSize': props.headSize = parseFloat(value); break;
          case 'stroke': props.stroke = value.replace(/"/g, ''); break;
          case 'strokeWidth': props.strokeWidth = parseFloat(value); break;
          case 'opacity': props.opacity = parseFloat(value); break;
          case 'visible': props.visible = value.toLowerCase() === 'true'; break;
        }
      }
    });

    // デフォルト値
    props.ox = props.ox ?? 0;
    props.oy = props.oy ?? 0;
    props.r = props.r ?? (unitMode === 'relative' ? 0.8 : 80);
    props.angle = props.angle ?? 45;

    // 1. 極座標をデカルト座標に変換
    const angleRad = props.angle * Math.PI / 180.0; // 角度をラジアンに
    const x2 = props.ox + props.r * Math.cos(angleRad);
    const y2 = props.oy + props.r * Math.sin(angleRad);

    // 2. arrowパーサーに渡すための引数文字列を構築
    // Y軸反転はarrowパーサーに任せるため、ここでは正の値で計算する
    const oy_for_arrow = props.oy;
    const y2_for_arrow = y2;

    let modifiedArgs = `x1=${props.ox}, y1=${oy_for_arrow}, x2=${x2}, y2=${y2_for_arrow}`;
    
    // 他のオプション引数を追加
    if (props.headSize) modifiedArgs += `, headSize=${props.headSize}`;
    if (props.stroke) modifiedArgs += `, stroke=${props.stroke}`;
    if (props.strokeWidth) modifiedArgs += `, strokeWidth=${props.strokeWidth}`;
    if (props.opacity) modifiedArgs += `, opacity=${props.opacity}`;
    if (props.visible !== undefined) modifiedArgs += `, visible=${props.visible}`;

    // 3. 構築した引数で、既存のarrowパーサーを呼び出す
    const result = commandParsers.arrow(modifiedArgs, unitMode, canvasSize);

    return result;
  },
	
  polar_line: (args, unitMode, canvasSize) => {
    const props: any = {};

    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          // 極座標のパラメータ
          case 'ox': props.ox = parseFloat(value); break; // 原点のX座標
          case 'oy': props.oy = parseFloat(value); break; // 原点のY座標
          case 'r': props.r = parseFloat(value); break;  // 距離（半径）
          case 'angle': props.angle = parseFloat(value); break; // 角度 (度)
          
          // lineに渡すその他のスタイル属性
          case 'stroke': props.stroke = value.replace(/"/g, ''); break;
          case 'strokeWidth': props.strokeWidth = parseFloat(value); break;
          case 'opacity': props.opacity = parseFloat(value); break;
          case 'visible': props.visible = value.toLowerCase() === 'true'; break;
        }
      }
    });

    // デフォルト値
    props.ox = props.ox ?? 0;
    props.oy = props.oy ?? 0;
    props.r = props.r ?? (unitMode === 'relative' ? 0.8 : 80);
    props.angle = props.angle ?? 45;

    // 1. 極座標をデカルト座標に変換
    const angleRad = props.angle * Math.PI / 180.0; // 角度をラジアンに
    const x2 = props.ox + props.r * Math.cos(angleRad);
    const y2 = props.oy + props.r * Math.sin(angleRad);

    // 2. arrowパーサーに渡すための引数文字列を構築
    // Y軸反転はarrowパーサーに任せるため、ここでは正の値で計算する
    const oy_for_arrow = props.oy;
    const y2_for_arrow = y2;

    let modifiedArgs = `x1=${props.ox}, y1=${oy_for_arrow}, x2=${x2}, y2=${y2_for_arrow}`;
    
    // 他のオプション引数を追加
    if (props.stroke) modifiedArgs += `, stroke=${props.stroke}`;
    if (props.strokeWidth) modifiedArgs += `, strokeWidth=${props.strokeWidth}`;
    if (props.opacity) modifiedArgs += `, opacity=${props.opacity}`;
    if (props.visible !== undefined) modifiedArgs += `, visible=${props.visible}`;

    // 3. 構築した引数で、既存のarrowパーサーを呼び出す
    const result = commandParsers.line(modifiedArgs, unitMode, canvasSize);

    return result;
  },

  ellipsoid_slice: (args, unitMode, canvasSize) => {
    const props: any = {};
    let visible = true;

    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          // ➀ 引数をパース
          case 'viewAngle': props.viewAngle = parseFloat(value); break;
          case 'viewDistance': props.viewDistance = parseFloat(value); break;
          case 'ox': props.ox = parseFloat(value); break;
          case 'cz': props.cz = parseFloat(value); break;
          case 'edgeX': props.edgeX = parseFloat(value); break;
          case 'edgeY': props.edgeY = parseFloat(value); break;
          case 'side': props.side = value.replace(/"/g, ''); break; // "front" or "back"
          // デザインと基本属性
          case 'stroke': props.stroke = value.replace(/"/g, ''); break;
          case 'strokeWidth': props.strokeWidth = parseFloat(value); break;
          case 'visible': visible = value.toLowerCase() === 'true'; break;
        }
      }
    });

    // デフォルト値
    props.viewAngle = props.viewAngle ?? 30;
    props.viewDistance = props.viewDistance ?? 200;
    props.ox = props.ox ?? 0;
    props.cz = props.cz ?? 50;
    props.edgeX = props.edgeX ?? 100;
    props.edgeY = props.edgeY ?? 0;
    props.side = props.side ?? "front";

    if (!visible) return [];

    // ➁ 視点の高さを求める (Y座標)
    const viewHeightY = (props.viewDistance + props.cz) * Math.tan(props.viewAngle * Math.PI / 180.0);
    
    // ➂ 2*ccy を求める
    const two_ccy = viewHeightY * 2 * props.cz / (props.viewDistance + 2 * props.cz);
    const ccy = two_ccy / 2;

    // ➃ 切断面の中心のズレを求める
    const centerOffsetY = (viewHeightY * props.cz / (props.viewDistance + props.cz)) - ccy;

    // ➄ cox, coy を求める
    const cox = props.ox;
    const coy = props.edgeY - centerOffsetY;

    // ➅ ccx を求める
    const term = 1 - (Math.pow(props.edgeY - coy, 2) / Math.pow(ccy, 2));
    if (term < 0) { // 物理的にありえない場合
      return { id: nextId++, type: 'unknown', props:{}, visible: true, boundingBox: {minX:0, minY:0, maxX:0, maxY:0}, errors: ['Invalid parameters for ellipsoid_slice'] };
    }
    const ccx = Math.sqrt(Math.pow(props.edgeX - cox, 2) / term);
    
    // ⑥ edgeXmax, edgeXmin
    const edgeXmax = props.edgeX;
    const edgeXmin = edgeXmax - 2 * ccx;

    // ⑦ 楕円弧の始点角・終点角を計算
    // 点 (edgeXmax, edgeY) と (edgeXmin, edgeY) が楕円上のどの角度に対応するかを逆算
    // atan2((y-coy)/ry, (x-cox)/rx) を使う
    const startPointAngleRad = Math.atan2((props.edgeY - coy) / ccy, (edgeXmax - cox) / ccx);
    const endPointAngleRad = Math.atan2((props.edgeY - coy) / ccy, (edgeXmin - cox) / ccx);
    
    // ラジアンを度に変換
    let startAngle = startPointAngleRad * 180 / Math.PI;
    let endAngle = endPointAngleRad * 180 / Math.PI;

    // ⑦ 「手前」か「奥」かで描画する半円を決定
    // SVGのarcコマンドは反時計回りに描画されるため、角度の大小を調整
    if (props.side === "front") { // Y座標がedgeY以下の部分
      // 180度から360度(0度)の範囲
      if (startAngle < 0) startAngle += 360;
      if (endAngle < 0) endAngle += 360;
    } else { // "back" Y座標がedgeY以上の部分
      // 0度から180度の範囲
      // startAngleとendAngleは既にこの範囲のはず
    }

    // Y軸反転をarcパーサーに任せるため、coyを反転させる
    const finalCoy = -coy;
    
    // arcコマンド用の引数文字列を構築
    let arcArgs = `cx=${cox}, cy=${finalCoy}, rx=${ccx}, ry=${ccy}, startAngle=${startAngle}, endAngle=${endAngle}`;
    if (props.stroke) arcArgs += `, stroke="${props.stroke}"`;
    if (props.strokeWidth) arcArgs += `, strokeWidth=${props.strokeWidth}`;

    // 既存のarcパーサーを呼び出す
    return commandParsers.arc(arcArgs, 'absolute', canvasSize);
  },
	
	
  ellipsoid_slice_polar: (args, unitMode, canvasSize) => {
    const props: any = {};
    
    // 1. 引数をパース
    args.split(',').forEach(arg => {
      const [key, value] = arg.trim().split('=').map(s => s.trim());
      if (key && value !== undefined) {
        switch (key) {
          // このコマンド固有の引数
          case 'cx': props.cx = parseFloat(value); break; // 3D空間での楕円球半径X軸方向
          case 'cy': props.cy = parseFloat(value); break; // 3D空間での楕円球半径Y軸方向
          case 'cz': props.cz = parseFloat(value); break; // 3D空間での楕円球半径Z軸方向
          case 'angle': props.angle = parseFloat(value); break; // 3D空間での円の回転角(度)
          case 'ox': props.ox = parseFloat(value); break; // 3D空間での楕円球中心X座標
					case 'oy': props.oy = parseFloat(value); break; // 3D空間での楕円球中心Y座標
          
          // ellipsoid_sliceに引き継ぐ共通の引数
          case 'viewAngle': props.viewAngle = parseFloat(value); break;
          case 'viewDistance': props.viewDistance = parseFloat(value); break;
          case 'side': props.side = value.replace(/"/g, ''); break;
          case 'stroke': props.stroke = value.replace(/"/g, ''); break;
          case 'strokeWidth': props.strokeWidth = parseFloat(value); break;
          case 'visible': props.visible = value.toLowerCase() === 'true'; break;
        }
      }
    });

    // デフォルト値
    props.cx = props.cx ?? 100;
    props.cy = props.cy ?? 100;
    props.cz = props.cz ?? 100;
    props.ox = props.ox ?? 0;
    props.oy = props.oy ?? 0;
    props.r = props.r ?? 100;
    props.angle = props.angle ?? 0;
    
    // 2. 新しい引数から、ellipsoid_sliceが要求する引数を計算
    const angleRad = props.angle * Math.PI / 180.0;
    const edgeX = Math.sqrt(props.cx * props.cx + props.cy * props.cy) * Math.cos(angleRad) + props.ox;
    const edgeY = Math.sqrt(props.cx * props.cx + props.cy * props.cy) * Math.sin(angleRad) + props.oy;
    
    // 3. ellipsoid_sliceパーサーに渡すための引数文字列を構築
    let modifiedArgs = `edgeX=${edgeX}, edgeY=${edgeY}, cz=${props.cz}, ox=${props.ox}`;

    // 共通の引数を追加
    if (props.viewAngle) modifiedArgs += `, viewAngle=${props.viewAngle}`;
    if (props.viewDistance) modifiedArgs += `, viewDistance=${props.viewDistance}`;
    if (props.side) modifiedArgs += `, side="${props.side}"`;
    if (props.stroke) modifiedArgs += `, stroke="${props.stroke}"`;
    if (props.strokeWidth) modifiedArgs += `, strokeWidth=${props.strokeWidth}`;
    if (props.visible !== undefined) modifiedArgs += `, visible=${props.visible}`;

    // 4. 構築した引数で、既存のellipsoid_sliceパーサーを呼び出す
    return commandParsers.ellipsoid_slice(modifiedArgs, unitMode, canvasSize);
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