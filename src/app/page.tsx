import Link from 'next/link';
import { BlockMath, InlineMath } from 'react-katex';

// =================================================================
// 1. 各数式を表示するためのカードコンポーネント
// =================================================================
interface FormulaCardProps {
  title: string;
  formula: string;
  supplement?: string;
  symbols: { symbol: string; meaning: string }[];
  link: string; // 各数式が関連するページのURL
}

const FormulaCard = ({ title, formula, supplement, symbols, link }: FormulaCardProps) => {
  return (
    <Link href={link} className="block group">
      <div className="flex flex-col h-full border bg-white text-black p-4 shadow-sm hover:bg-slate-100  transition-all duration-300 flex flex-col">
        {/* タイトル */}
        <div className="text-xl font-bold text-gray-800 h-fit">
          {title}
        </div>

        {/* 式 */}
        <div className="text-center text-xl overflow-x-auto flex-1 flex items-center justify-center">
					<BlockMath math={formula} />
        </div>

        {/* 補足 */}
        {supplement && (
          <div className="text-sm text-gray-600 h-fit py-2">
            <p>{supplement}</p>
          </div>
        )}

        {/* 記号の説明 (セクション) */}
        <div className="mt-auto pt-4 border-t text-sm text-gray-700">
          {/* dl, dt, dd は定義リストを表すのに最適なHTMLタグです */}
          <dl>
            {symbols.map(({ symbol, meaning }) => (
              <div key={symbol} className="flex mb-1">
                <dt className="w-16 font-mono font-medium text-right pr-2 shrink-0">
                  <InlineMath math={symbol} />
                </dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Link>
  );
};

// =================================================================
// 2. あなたの提供した数式を構造化したデータ
// ★★★ 今後、新しい数式を追加する場合は、この配列にオブジェクトを追加してください ★★★
// =================================================================
const formulasData: FormulaCardProps[] = [
  {
    title: '万有引力',
    formula: 'F=G\\dfrac{mM}{R^2}',
    supplement: '二つの物体の間に働く引力。距離の2乗に反比例する。',
    symbols: [
      { symbol: 'F', meaning: '万有引力' },
      { symbol: 'G', meaning: '万有引力定数' },
      { symbol: 'm, M', meaning: '二物体の質量' },
      { symbol: 'R', meaning: '物体間の距離' },
    ],
    link: '/path/to/gravity',
  },
  {
    title: '遠心力',
    formula: 'f=mr\\omega^2',
    supplement: '回転運動をしている物体が見かけ上受ける、外向きの力。',
    symbols: [
      { symbol: 'f', meaning: '遠心力' },
      { symbol: 'm', meaning: '物体の質量' },
      { symbol: 'r', meaning: '回転半径' },
      { symbol: '\\omega', meaning: '角速度' },
    ],
    link: '/path/to/centrifugal-force',
  },
  {
    title: '地殻の厚さ',
    formula: 'd=\\frac{l}{2}\\sqrt{\\frac{v_2-v_1}{v_2+v_1}}',
    supplement: '地震波速度の違いから地殻の厚さを推定する式。',
    symbols: [
      { symbol: 'd', meaning: '地殻の厚さ' },
      { symbol: 'l', meaning: '震央距離' },
      { symbol: 'v_1', meaning: '地殻内のP波速度' },
      { symbol: 'v_2', meaning: 'マントル内のP波速度' },
    ],
    link: '/path/to/crust-thickness',
  },
  {
    title: 'フーリエの法則',
    formula: 'q=-k\\frac{dT}{dz}',
    supplement: '熱伝導による熱の移動量を記述する法則。',
    symbols: [
      { symbol: 'q', meaning: '熱流束密度' },
      { symbol: 'k', meaning: '熱伝導率' },
      { symbol: 'dT/dz', meaning: '温度勾配' },
    ],
    link: '/path/to/fourier-law',
  },
  {
    title: '大森公式',
    formula: 'D=kt',
    supplement: '地震の初期微動継続時間から震源までの距離を求める経験式。',
    symbols: [
      { symbol: 'D', meaning: '震源距離 (km)' },
      { symbol: 't', meaning: '初期微動継続時間 (s)' },
      { symbol: 'k', meaning: '大森係数 (約8 km/s)' },
    ],
    link: '/path/to/omori-formula',
  },
  {
    title: '半減期',
    formula: 'N(t)=N_{0}\\left(\\frac{1}{2}\\right)^{\\frac{t}{T}}',
    supplement: '放射性同位体が崩壊し、元の数の半分になるまでにかかる時間。',
    symbols: [
      { symbol: 'N(t)', meaning: '時間t後の原子数' },
      { symbol: 'N_0', meaning: '初期の原子数' },
      { symbol: 't', meaning: '経過時間' },
      { symbol: 'T', meaning: '半減期' },
    ],
    link: '/path/to/half-life',
  },
  {
    title: '等温大気の気圧公式',
    formula: 'P(h)=P_{0}\\cdot e^{-\\frac{Mgh}{RT}}',
    supplement: '高度による気圧の減少を示す指数関数的な関係式。',
    symbols: [
      { symbol: 'P(h)', meaning: '高度hでの気圧' },
      { symbol: 'P_0', meaning: '地表での気圧' },
      { symbol: 'M', meaning: '空気の分子量' },
      { symbol: 'g', meaning: '重力加速度' },
      { symbol: 'h', meaning: '高度' },
      { symbol: 'R', meaning: '気体定数' },
      { symbol: 'T', meaning: '温度 (K)' },
    ],
    link: '/path/to/barometric-formula',
  },
  {
    title: 'テテンスの式',
    formula: 'e_{s}(T)=6.107\\times 10^{\\frac{7.5T}{237.3+T}}',
    supplement: '飽和水蒸気圧を温度から計算する経験式。',
    symbols: [
      { symbol: 'e_s(T)', meaning: '飽和水蒸気圧 (hPa)' },
      { symbol: 'T', meaning: '気温 (°C)' },
    ],
    link: '/path/to/tetens-formula',
  },
  {
    title: 'クラウジウス・クラペイロンの式',
    formula: '\\ln\\left(\\frac{P_{2}}{P_{1}}\\right)=-\\frac{L}{R_{v}}\\left(\\frac{1}{T_{2}}-\\frac{1}{T_{1}}\\right)',
    supplement: '蒸気圧の温度依存性を示す熱力学の式。',
    symbols: [
      { symbol: 'P_1, P_2', meaning: '温度T_1, T_2での蒸気圧' },
      { symbol: 'L', meaning: '潜熱' },
      { symbol: 'R_v', meaning: '水蒸気の気体定数' },
      { symbol: 'T_1, T_2', meaning: '絶対温度 (K)' },
    ],
    link: '/path/to/clausius-clapeyron',
  },
  {
    title: '顕熱量',
    formula: 'Q=m\\cdot c\\cdot \\Delta T',
    supplement: '物質の温度変化に伴う熱エネルギーの移動量。',
    symbols: [
      { symbol: 'Q', meaning: '顕熱量 (J)' },
      { symbol: 'm', meaning: '質量 (kg)' },
      { symbol: 'c', meaning: '比熱 (J/(kg·K))' },
      { symbol: '\\Delta T', meaning: '温度変化 (K または °C)' },
    ],
    link: '/path/to/sensible-heat',
  },
  {
    title: '地球が受け取る太陽放射',
    formula: 'Q=S\\times \\pi R^{2}',
    supplement: '地球全体が受け取る太陽放射エネルギーの総量。',
    symbols: [
      { symbol: 'Q', meaning: '受け取る総エネルギー (W)' },
      { symbol: 'S', meaning: '太陽定数 (約1361 W/m²)' },
      { symbol: 'R', meaning: '地球の半径' },
    ],
    link: '/path/to/solar-radiation',
  },
  {
    title: '単位面積あたりの平均受熱量',
    formula: '\\text{平均受熱量}=\\frac{S}{4}',
    supplement: '地球表面の単位面積が平均して受け取る太陽放射量。',
    symbols: [
      { symbol: 'S', meaning: '太陽定数 (約1361 W/m²)' },
    ],
    link: '/path/to/average-insolation',
  },
  {
    title: 'アルベドを考慮した吸収エネルギー',
    formula: '\\text{吸収エネルギー}=\\frac{S}{4}\\times (1-\\alpha)',
    supplement: '地球のアルベド（反射率）を考慮した実際の吸収エネルギー。',
    symbols: [
      { symbol: 'S', meaning: '太陽定数' },
      { symbol: '\\alpha', meaning: 'アルベド (約0.3)' },
    ],
    link: '/path/to/absorbed-energy',
  },
  {
    title: '地衡風（スカラー形式）',
    formula: 'V_{g}=\\frac{1}{\\rho f}\\left|\\frac{\\Delta P}{\\Delta n}\\right|',
    supplement: '気圧傾度力とコリオリ力が釣り合った風の速さ。',
    symbols: [
      { symbol: 'V_g', meaning: '地衡風の速さ' },
      { symbol: '\\rho', meaning: '大気密度' },
      { symbol: 'f', meaning: 'コリオリパラメータ' },
      { symbol: '\\Delta P/\\Delta n', meaning: '気圧傾度' },
    ],
    link: '/path/to/geostrophic-wind-scalar',
  },
  {
    title: '地衡風（ジオポテンシャル高度）',
    formula: 'V_{g}=\\frac{g}{f}\\left|\\frac{\\Delta z}{\\Delta n}\\right|',
    supplement: '等圧面の傾きから地衡風を求める式。',
    symbols: [
      { symbol: 'V_g', meaning: '地衡風の速さ' },
      { symbol: 'g', meaning: '重力加速度' },
      { symbol: 'f', meaning: 'コリオリパラメータ' },
      { symbol: '\\Delta z/\\Delta n', meaning: '等圧面の傾き' },
    ],
    link: '/path/to/geostrophic-wind',
  },
  {
    title: 'コリオリパラメータ',
    formula: 'f=2\\Omega\\sin\\phi',
    supplement: '緯度によって変化するコリオリ力の強さを示すパラメータ。',
    symbols: [
      { symbol: 'f', meaning: 'コリオリパラメータ' },
      { symbol: '\\Omega', meaning: '地球の自転角速度 (約7.29×10⁻⁵ rad/s)' },
      { symbol: '\\phi', meaning: '緯度' },
    ],
    link: '/path/to/coriolis-parameter',
  },
  {
    title: '気圧傾度力',
    formula: '\\vec{F}_{PGF}=-\\frac{1}{\\rho}\\nabla P',
    supplement: '気圧差によって空気を動かす力。',
    symbols: [
      { symbol: '\\vec{F}_{PGF}', meaning: '気圧傾度力' },
      { symbol: '\\rho', meaning: '大気密度' },
      { symbol: '\\nabla P', meaning: '気圧の水平勾配' },
    ],
    link: '/path/to/pressure-gradient-force',
  },
  {
    title: 'フェーン現象（断熱変化）',
    formula: 'T_{1}-T_{2}=\\Gamma_{d}\\times \\Delta z',
    supplement: '空気塊が山を越える際の温度変化を示す式。',
    symbols: [
      { symbol: 'T_1, T_2', meaning: '高度での温度' },
      { symbol: '\\Gamma_d', meaning: '乾燥断熱減率 (約0.98°C/100m)' },
      { symbol: '\\Delta z', meaning: '高度変化' },
    ],
    link: '/path/to/foehn-phenomenon',
  },
  {
    title: '等密度線の傾き（TS図）',
    formula: '\\left(\\frac{dT}{dS}\\right)_{\\rho=\\text{const}}=-\\frac{\\alpha}{\\beta}',
    supplement: 'TS図上で密度が一定となる線の傾き。',
    symbols: [
      { symbol: 'dT/dS', meaning: '等密度線の傾き' },
      { symbol: '\\alpha', meaning: '熱膨張率' },
      { symbol: '\\beta', meaning: '塩分収縮率' },
    ],
    link: '/path/to/isopycnal-slope',
  },
  {
    title: '波の基本式',
    formula: 'v=\\frac{L}{T}=Lf',
    supplement: '波の速度、波長、周期の関係を示す基本式。',
    symbols: [
      { symbol: 'v', meaning: '波の速度' },
      { symbol: 'L', meaning: '波長' },
      { symbol: 'T', meaning: '周期' },
      { symbol: 'f', meaning: '振動数 (f=1/T)' },
    ],
    link: '/path/to/wave-equation',
  },
  {
    title: '分散関係式',
    formula: 'v^{2}=\\frac{gL}{2\\pi}\\tanh\\left(\\frac{2\\pi h}{L}\\right)',
    supplement: '海洋波の速度が水深と波長によって決まることを示す式。',
    symbols: [
      { symbol: 'v', meaning: '波の速度' },
      { symbol: 'L', meaning: '波長' },
      { symbol: 'h', meaning: '水深' },
      { symbol: 'g', meaning: '重力加速度' },
    ],
    link: '/path/to/dispersion-relation',
  },
  {
    title: '深海波の式',
    formula: 'v=\\sqrt{\\frac{gL}{2\\pi}}',
    supplement: '水深が波長より十分深い場合の波速。',
    symbols: [
      { symbol: 'v', meaning: '波の速度' },
      { symbol: 'L', meaning: '波長' },
      { symbol: 'g', meaning: '重力加速度' },
    ],
    link: '/path/to/deep-water-wave',
  },
  {
    title: '浅海波の式',
    formula: 'v=\\sqrt{gh}',
    supplement: '水深が波長より十分浅い場合の波速（津波など）。',
    symbols: [
      { symbol: 'v', meaning: '波の速度' },
      { symbol: 'h', meaning: '水深' },
      { symbol: 'g', meaning: '重力加速度' },
    ],
    link: '/path/to/shallow-water-wave',
  },
  {
    title: '波のエネルギー',
    formula: 'E=\\frac{1}{8}\\rho gH^{2}',
    supplement: '単位面積あたりの波のエネルギー密度。',
    symbols: [
      { symbol: 'E', meaning: 'エネルギー密度 (J/m²)' },
      { symbol: '\\rho', meaning: '海水密度' },
      { symbol: 'g', meaning: '重力加速度' },
      { symbol: 'H', meaning: '波高' },
    ],
    link: '/path/to/wave-energy',
  },
  {
    title: '砕波条件',
    formula: 'H\\approx 0.78h',
    supplement: '波が崩れる限界の条件。',
    symbols: [
      { symbol: 'H', meaning: '波高' },
      { symbol: 'h', meaning: '水深' },
    ],
    link: '/path/to/wave-breaking',
  },
  {
    title: 'エクマン輸送',
    formula: '\\vec{T}_{E}=\\frac{1}{\\rho f}(\\vec{k}\\times\\vec{\\tau})',
    supplement: '風によって駆動される海洋表層の質量輸送。',
    symbols: [
      { symbol: '\\vec{T}_E', meaning: 'エクマン輸送量' },
      { symbol: '\\rho', meaning: '海水密度' },
      { symbol: 'f', meaning: 'コリオリパラメータ' },
      { symbol: '\\vec{\\tau}', meaning: '風応力' },
    ],
    link: '/path/to/ekman-transport',
  },
  {
    title: '潮汐力',
    formula: 'F_{T}\\propto\\frac{M}{d^{3}}',
    supplement: '天体が地球に及ぼす潮汐力の強さ。距離の3乗に反比例。',
    symbols: [
      { symbol: 'F_T', meaning: '潮汐力' },
      { symbol: 'M', meaning: '天体の質量' },
      { symbol: 'd', meaning: '天体と地球の距離' },
    ],
    link: '/path/to/tidal-force',
  },
  {
    title: '水収支の式',
    formula: '\\frac{dS}{dt}=P-E-R',
    supplement: 'ある領域の水の貯留量の時間変化。',
    symbols: [
      { symbol: 'dS/dt', meaning: '貯水量の変化率' },
      { symbol: 'P', meaning: '降水量' },
      { symbol: 'E', meaning: '蒸発量' },
      { symbol: 'R', meaning: '流出量' },
    ],
    link: '/path/to/water-budget',
  },
  {
    title: '蒸発量の式',
    formula: 'E=f(u)\\cdot(e_{s}-e_{a})',
    supplement: '風速と飽和不足量から蒸発量を推定する式。',
    symbols: [
      { symbol: 'E', meaning: '蒸発量' },
      { symbol: 'f(u)', meaning: '風速の関数' },
      { symbol: 'e_s', meaning: '飽和水蒸気圧' },
      { symbol: 'e_a', meaning: '実際の水蒸気圧' },
    ],
    link: '/path/to/evaporation',
  },
  {
    title: '熱慣性',
    formula: '\\text{熱慣性}=\\sqrt{\\rho\\cdot c\\cdot k}',
    supplement: '物質が熱を蓄えやすさを示す指標。都市ヒートアイランドの要因。',
    symbols: [
      { symbol: '\\rho', meaning: '密度' },
      { symbol: 'c', meaning: '比熱' },
      { symbol: 'k', meaning: '熱伝導率' },
    ],
    link: '/path/to/thermal-inertia',
  },
  {
    title: '歳差運動のトルク',
    formula: '\\vec{\\tau}=\\frac{d\\vec{L}}{dt}=\\vec{\\Omega}_{p}\\times\\vec{L}',
    supplement: '地球の自転軸の歳差運動を引き起こすトルク。',
    symbols: [
      { symbol: '\\vec{\\tau}', meaning: 'トルク' },
      { symbol: '\\vec{L}', meaning: '角運動量' },
      { symbol: '\\vec{\\Omega}_p', meaning: '歳差角速度' },
    ],
    link: '/path/to/precession-torque',
  },
  {
    title: '年周視差',
    formula: 'd[\\text{pc}]=\\frac{1}{p[^{\\prime\\prime}]}',
    supplement: '恒星までの距離をパーセクで表す基本式。',
    symbols: [
      { symbol: 'd', meaning: '距離 (パーセク)' },
      { symbol: 'p', meaning: '年周視差角 (秒角)' },
    ],
    link: '/path/to/parallax',
  },
  {
    title: '年周光行差',
    formula: '\\alpha\\approx\\frac{v}{c}',
    supplement: '地球の公転運動による恒星の見かけの位置のずれ。',
    symbols: [
      { symbol: '\\alpha', meaning: '光行差角' },
      { symbol: 'v', meaning: '地球の公転速度 (約29.8 km/s)' },
      { symbol: 'c', meaning: '光速' },
    ],
    link: '/path/to/aberration',
  },
  {
    title: '会合周期',
    formula: 'S=\\frac{|P_{1}\\cdot P_{2}|}{|P_{2}-P_{1}|}',
    supplement: '二つの天体が同じ相対位置に戻るまでの周期。',
    symbols: [
      { symbol: 'S', meaning: '会合周期' },
      { symbol: 'P_1, P_2', meaning: '各天体の公転周期' },
    ],
    link: '/path/to/synodic-period',
  },
  {
    title: 'ケプラー第1法則（楕円軌道）',
    formula: 'r=\\frac{a(1-e^{2})}{1+e\\cos\\theta}',
    supplement: '惑星は太陽を一つの焦点とする楕円軌道を描く。',
    symbols: [
      { symbol: 'r', meaning: '太陽からの距離' },
      { symbol: 'a', meaning: '軌道長半径' },
      { symbol: 'e', meaning: '離心率' },
      { symbol: '\\theta', meaning: '真近点角' },
    ],
    link: '/path/to/kepler-first-law',
  },
  {
    title: 'ケプラー第2法則（面積速度一定）',
    formula: '\\frac{dA}{dt}=\\frac{1}{2}r^{2}\\frac{d\\theta}{dt}=\\text{一定}',
    supplement: '惑星と太陽を結ぶ線分が単位時間に掃く面積は一定。',
    symbols: [
      { symbol: 'dA/dt', meaning: '面積速度' },
      { symbol: 'r', meaning: '太陽からの距離' },
      { symbol: 'd\\theta/dt', meaning: '角速度' },
    ],
    link: '/path/to/kepler-second-law',
  },
  {
    title: 'ケプラー第3法則（調和の法則）',
    formula: 'P^{2}=\\frac{4\\pi^{2}}{G(M_{\\text{sun}}+M_{\\text{planet}})}a^{3}',
    supplement: '公転周期の2乗は軌道長半径の3乗に比例する。',
    symbols: [
      { symbol: 'P', meaning: '公転周期' },
      { symbol: 'a', meaning: '軌道長半径' },
      { symbol: 'G', meaning: '万有引力定数' },
      { symbol: 'M_{sun}', meaning: '太陽の質量' },
    ],
    link: '/path/to/kepler-third-law',
  },
  {
    title: '視直径',
    formula: '\\theta\\approx\\frac{D}{d}',
    supplement: '天体の見かけの大きさ（角度）を求める近似式。',
    symbols: [
      { symbol: '\\theta', meaning: '視直径 (ラジアン)' },
      { symbol: 'D', meaning: '天体の実際の直径' },
      { symbol: 'd', meaning: '天体までの距離' },
    ],
    link: '/path/to/angular-diameter',
  },
  {
    title: '核融合（D-T反応）',
    formula: '{}_{1}^{2}\\text{D}+{}_{1}^{3}\\text{T}\\rightarrow{}_{2}^{4}\\text{He}+{}_{0}^{1}\\text{n}+17.6\\text{ MeV}',
    supplement: '地上の核融合炉で研究される主要な反応。',
    symbols: [
      { symbol: 'D', meaning: '重水素' },
      { symbol: 'T', meaning: '三重水素' },
      { symbol: 'He', meaning: 'ヘリウム' },
      { symbol: 'n', meaning: '中性子' },
    ],
    link: '/path/to/fusion-dt-reaction',
  },
  {
    title: '質量エネルギー等価性',
    formula: 'E=mc^{2}',
    supplement: '質量とエネルギーの等価性を示すアインシュタインの式。',
    symbols: [
      { symbol: 'E', meaning: 'エネルギー' },
      { symbol: 'm', meaning: '質量' },
      { symbol: 'c', meaning: '光速' },
    ],
    link: '/path/to/mass-energy-equivalence',
  },
  {
    title: 'ローソン条件',
    formula: 'n\\cdot\\tau_{E}\\cdot T\\ge\\text{一定値}',
    supplement: '核融合を持続させるために必要な条件。',
    symbols: [
      { symbol: 'n', meaning: 'プラズマ密度' },
      { symbol: '\\tau_E', meaning: 'エネルギー閉じ込め時間' },
      { symbol: 'T', meaning: 'プラズマ温度' },
    ],
    link: '/path/to/lawson-criterion',
  },
  {
    title: 'ポグソンの式',
    formula: '\\frac{I_{1}}{I_{2}}=(2.512)^{m_{2}-m_{1}}',
    supplement: '等級差と明るさの比の関係。',
    symbols: [
      { symbol: 'I_1, I_2', meaning: '天体の明るさ' },
      { symbol: 'm_1, m_2', meaning: '見かけの等級' },
    ],
    link: '/path/to/pogson-ratio',
  },
  {
    title: '等級の計算式',
    formula: 'm_{2}=m_{1}-2.5\\log_{10}\\left(\\frac{I_{2}}{I_{1}}\\right)',
    supplement: '明るさの比から等級を求める式。',
    symbols: [
      { symbol: 'm_2', meaning: '求める等級' },
      { symbol: 'I_2/I_1', meaning: '明るさの比' },
    ],
    link: '/path/to/magnitude-calculation',
  },
  {
    title: '距離指数方程式',
    formula: 'm-M=5\\log_{10}(d)-5',
    supplement: '見かけの等級と絶対等級から距離を求める式。',
    symbols: [
      { symbol: 'm', meaning: '見かけの等級' },
      { symbol: 'M', meaning: '絶対等級' },
      { symbol: 'd', meaning: '距離 (パーセク)' },
    ],
    link: '/path/to/distance-modulus',
  },
  {
    title: 'ウィーンの変位則',
    formula: '\\lambda_{max}=\\frac{b}{T}',
    supplement: '黒体が最も強く放射する波長と温度の関係。',
    symbols: [
      { symbol: '\\lambda_{max}', meaning: '最大放射波長' },
      { symbol: 'b', meaning: 'ウィーンの変位定数 (約2.898×10⁻³ m·K)' },
      { symbol: 'T', meaning: '絶対温度 (K)' },
    ],
    link: '/path/to/wiens-law',
  },
  {
    title: 'シュテファン・ボルツマンの法則',
    formula: 'M=\\sigma T^{4}',
    supplement: '黒体が放射する全エネルギー量は温度の4乗に比例する。',
    symbols: [
      { symbol: 'M', meaning: '放射発散度 (W/m²)' },
      { symbol: '\\sigma', meaning: 'シュテファン・ボルツマン定数' },
      { symbol: 'T', meaning: '絶対温度 (K)' },
    ],
    link: '/path/to/stefan-boltzmann-law',
  },
  {
    title: 'プランクの法則',
    formula: 'B(\\lambda,T)=\\frac{2hc^{2}}{\\lambda^{5}}\\frac{1}{e^{\\frac{hc}{\\lambda k_{B}T}}-1}',
    supplement: '黒体放射のスペクトル分布を完全に記述する式。',
    symbols: [
      { symbol: 'B(\\lambda,T)', meaning: '放射輝度' },
      { symbol: 'h', meaning: 'プランク定数' },
      { symbol: 'c', meaning: '光速' },
      { symbol: 'k_B', meaning: 'ボルツマン定数' },
    ],
		link: '/path/to/plancks-law',
  },
  {
    title: '恒星の光度',
    formula: 'L=4\\pi R^{2}\\sigma T_{eff}^{4}',
    supplement: '恒星が放出する全エネルギー量。半径の2乗と温度の4乗に比例。',
    symbols: [
      { symbol: 'L', meaning: '光度 (W)' },
      { symbol: 'R', meaning: '恒星の半径' },
      { symbol: '\\sigma', meaning: 'シュテファン・ボルツマン定数' },
      { symbol: 'T_{eff}', meaning: '有効温度 (K)' },
    ],
    link: '/path/to/stellar-luminosity',
  },
  {
    title: '光度の相対比較',
    formula: '\\frac{L}{L_{\\odot}}=\\left(\\frac{R}{R_{\\odot}}\\right)^{2}\\left(\\frac{T_{eff}}{T_{\\odot}}\\right)^{4}',
    supplement: '太陽を基準とした恒星の光度比較式。',
    symbols: [
      { symbol: 'L/L_\\odot', meaning: '太陽光度に対する比' },
      { symbol: 'R/R_\\odot', meaning: '太陽半径に対する比' },
      { symbol: 'T_{eff}/T_\\odot', meaning: '太陽温度に対する比' },
    ],
    link: '/path/to/relative-luminosity',
  },
  {
    title: '連星系のケプラー第3法則',
    formula: 'P^{2}=\\frac{4\\pi^{2}}{G(M_{1}+M_{2})}a^{3}',
    supplement: '連星の周期から二つの星の質量の和を求める式。',
    symbols: [
      { symbol: 'P', meaning: '公転周期' },
      { symbol: 'M_1, M_2', meaning: '二つの恒星の質量' },
      { symbol: 'a', meaning: '平均距離' },
      { symbol: 'G', meaning: '万有引力定数' },
    ],
    link: '/path/to/binary-kepler',
  },
  {
    title: '質量比と重心',
    formula: 'M_{1}r_{1}=M_{2}r_{2}',
    supplement: '連星系の重心の法則。質量比は距離の逆比。',
    symbols: [
      { symbol: 'M_1, M_2', meaning: '恒星の質量' },
      { symbol: 'r_1, r_2', meaning: '重心からの距離' },
    ],
    link: '/path/to/binary-mass-ratio',
  },
  {
    title: 'ドップラー効果',
    formula: '\\frac{\\Delta\\lambda}{\\lambda_{0}}=\\frac{v_{r}}{c}',
    supplement: '天体の視線速度によるスペクトル線の波長シフト。',
    symbols: [
      { symbol: '\\Delta\\lambda', meaning: '波長のずれ' },
      { symbol: '\\lambda_0', meaning: '元の波長' },
      { symbol: 'v_r', meaning: '視線速度' },
      { symbol: 'c', meaning: '光速' },
    ],
    link: '/path/to/doppler-effect',
  },
  {
    title: '主系列星の寿命',
    formula: 'T_{\\text{life}}\\approx\\frac{10^{10}\\text{ 年}}{M^{2.5}}',
    supplement: '恒星の質量から主系列段階の寿命を推定する式（太陽質量単位）。',
    symbols: [
      { symbol: 'T_{life}', meaning: '寿命 (年)' },
      { symbol: 'M', meaning: '質量 (太陽質量単位)' },
    ],
    link: '/path/to/stellar-lifetime',
  },
  {
    title: '質量光度関係',
    formula: 'L\\propto M^{3.5}',
    supplement: '主系列星の光度は質量の約3.5乗に比例する。',
    symbols: [
      { symbol: 'L', meaning: '光度' },
      { symbol: 'M', meaning: '質量' },
    ],
    link: '/path/to/mass-luminosity',
  },
  {
    title: 'ニュートリノ振動',
    formula: 'P(\\nu_{\\alpha}\\rightarrow\\nu_{\\beta})=\\sin^{2}(2\\theta)\\sin^{2}\\left(\\frac{\\Delta m^{2}c^{4}L}{4\\hbar cE}\\right)',
    supplement: 'ニュートリノの種類が飛行中に変化する確率。',
    symbols: [
      { symbol: 'P', meaning: '振動確率' },
      { symbol: '\\theta', meaning: '混合角' },
      { symbol: '\\Delta m^2', meaning: '質量の2乗の差' },
      { symbol: 'L', meaning: '飛行距離' },
      { symbol: 'E', meaning: 'エネルギー' },
    ],
    link: '/path/to/neutrino-oscillation',
  },
  {
    title: 'ニュートリノのエネルギー運動量関係',
    formula: 'E^{2}=(pc)^{2}+(mc^{2})^{2}',
    supplement: '相対論的粒子のエネルギーと運動量の関係。',
    symbols: [
      { symbol: 'E', meaning: '全エネルギー' },
      { symbol: 'p', meaning: '運動量' },
      { symbol: 'm', meaning: '静止質量' },
      { symbol: 'c', meaning: '光速' },
    ],
    link: '/path/to/energy-momentum',
  },
  {
    title: '周期光度関係（ケフェウス型変光星）',
    formula: 'M=a\\log_{10}(P)+b',
    supplement: '変光周期から絶対等級を推定し、距離測定に利用する。',
    symbols: [
      { symbol: 'M', meaning: '絶対等級' },
      { symbol: 'P', meaning: '変光周期 (日)' },
      { symbol: 'a, b', meaning: '経験的定数' },
    ],
    link: '/path/to/period-luminosity',
  },
  {
    title: '脈動周期と密度',
    formula: 'P\\sqrt{\\rho}=\\text{一定}',
    supplement: '脈動変光星の周期は平均密度に関係する。',
    symbols: [
      { symbol: 'P', meaning: '脈動周期' },
      { symbol: '\\rho', meaning: '平均密度' },
    ],
    link: '/path/to/pulsation-density',
  },
  {
    title: '銀河の回転速度',
    formula: 'v=\\sqrt{\\frac{GM(r)}{r}}',
    supplement: '銀河内の天体の回転速度から内側の質量を推定する式。',
    symbols: [
      { symbol: 'v', meaning: '回転速度' },
      { symbol: 'M(r)', meaning: '距離r内の総質量' },
      { symbol: 'r', meaning: '銀河中心からの距離' },
      { symbol: 'G', meaning: '万有引力定数' },
    ],
    link: '/path/to/galactic-rotation',
  },
  {
    title: 'ターリー・フィッシャー関係',
    formula: 'L\\propto v_{max}^{n}',
    supplement: '銀河の光度と最大回転速度の経験的関係（n≈4）。',
    symbols: [
      { symbol: 'L', meaning: '銀河の光度' },
      { symbol: 'v_{max}', meaning: '最大回転速度' },
      { symbol: 'n', meaning: '指数 (約3-4)' },
    ],
    link: '/path/to/tully-fisher',
  },
  {
    title: 'ダークマターを含む質量',
    formula: 'M_{\\text{total}}(r)=M_{\\text{visible}}(r)+M_{\\text{dark matter}}(r)',
    supplement: '観測される回転速度を説明するための総質量の分解。',
    symbols: [
      { symbol: 'M_{total}', meaning: '総質量' },
      { symbol: 'M_{visible}', meaning: '可視物質の質量' },
      { symbol: 'M_{dark matter}', meaning: 'ダークマターの質量' },
    ],
    link: '/path/to/dark-matter-mass',
  },
  {
    title: 'フリードマン方程式',
    formula: '\\left(\\frac{\\dot{a}}{a}\\right)^{2}=\\frac{8\\pi G}{3}\\rho-\\frac{kc^{2}}{a^{2}}+\\frac{\\Lambda c^{2}}{3}',
    supplement: '宇宙の膨張速度を記述する一般相対論の方程式。',
    symbols: [
      { symbol: 'a', meaning: 'スケール因子' },
      { symbol: '\\rho', meaning: '宇宙の平均密度' },
      { symbol: 'k', meaning: '曲率パラメータ' },
      { symbol: '\\Lambda', meaning: '宇宙定数' },
    ],
    link: '/path/to/friedmann-equation',
  },
  {
    title: 'ハッブル・ルメートルの法則',
    formula: 'v=H_{0}\\cdot d',
    supplement: '銀河の後退速度は距離に比例する。宇宙膨張の証拠。',
    symbols: [
      { symbol: 'v', meaning: '後退速度 (km/s)' },
      { symbol: 'H_0', meaning: 'ハッブル定数 (約67-74 km/s/Mpc)' },
      { symbol: 'd', meaning: '距離 (Mpc)' },
    ],
    link: '/path/to/hubble-law',
  },
  {
    title: '距離の推定',
    formula: 'd=\\frac{v}{H_{0}}',
    supplement: 'ハッブルの法則から銀河までの距離を求める式。',
    symbols: [
      { symbol: 'd', meaning: '距離' },
      { symbol: 'v', meaning: '後退速度' },
      { symbol: 'H_0', meaning: 'ハッブル定数' },
    ],
    link: '/path/to/distance-estimation',
  },
  {
    title: '宇宙の年齢（ハッブル時間）',
    formula: 'T_{\\text{age}}\\approx\\frac{1}{H_{0}}',
    supplement: 'ハッブル定数の逆数から宇宙の年齢を概算する。',
    symbols: [
      { symbol: 'T_{age}', meaning: '宇宙の年齢' },
      { symbol: 'H_0', meaning: 'ハッブル定数' },
    ],
    link: '/path/to/age-of-universe',
  },
  {
    title: '宇宙背景放射のスペクトル',
    formula: 'B_{\\nu}(T)=\\frac{2h\\nu^{3}}{c^{2}}\\frac{1}{e^{\\frac{h\\nu}{k_{B}T}}-1}',
    supplement: '宇宙マイクロ波背景放射の完全な黒体スペクトル（T≈2.725K）。',
    symbols: [
      { symbol: 'B_\\nu(T)', meaning: '放射輝度' },
      { symbol: '\\nu', meaning: '振動数' },
      { symbol: 'T', meaning: '温度 (約2.725 K)' },
      { symbol: 'h', meaning: 'プランク定数' },
      { symbol: 'k_B', meaning: 'ボルツマン定数' },
    ],
    link: '/path/to/cmb-spectrum',
  },
  {
    title: '太陽定数',
    formula: 'S\\approx 1361\\text{ W/m}^{2}',
    supplement: '地球軌道における太陽放射の強度。',
    symbols: [
      { symbol: 'S', meaning: '太陽定数' },
    ],
    link: '/path/to/solar-constant',
  },
];

// =================================================================
// 3. メインページ本体
// =================================================================
export default function HomePage() {
  return (
    <div>
			<div className="flex w-fit mx-auto p-8 text-xl text-slate-800 justify-between">
				<div className="bg-slate-200 py-4 px-8">地球</div>
				<div className="bg-slate-200 py-4 px-8">生命</div>
				<div className="bg-slate-200 py-4 px-8">海洋</div>
				<div className="bg-slate-200 py-4 px-8">大気</div>
				<div className="bg-slate-200 py-4 px-8">太陽系</div>
				<div className="bg-slate-200 py-4 px-8">銀河</div>
				<div className="bg-slate-200 py-4 px-8">天文</div>
			</div>
      <div className="px-10 pb-10 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-3">
        {formulasData.map((formula) => (
          <FormulaCard key={formula.title} {...formula} />
        ))}
      </div>
    </div>
  );
}