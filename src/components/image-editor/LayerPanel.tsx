import { Shape } from './parser';
import { VscEye, VscEyeClosed } from "react-icons/vsc"; // VS Codeのアイコン

interface LayerPanelProps {
  shapes: Shape[];
  onVisibilityChange: (id: number, visible: boolean) => void;
}

export const LayerPanel = ({ shapes, onVisibilityChange }: LayerPanelProps) => {
  return (
    <div className="border rounded bg-white p-2 text-sm w-[20%]">
      <ul>
        {shapes.map(shape => (
          <li
            key={shape.id}
            className={`flex items-center justify-between px-2 rounded hover:bg-gray-200 cursor-pointer ${
              !shape.visible ? 'text-gray-400 bg-gray-200' : ''
            }`}
              onClick={() => onVisibilityChange(shape.id, !shape.visible)}
          >
            <span className="font-mono">{`${shape.id}: ${shape.type}`}</span>
            <button
              className="p-1 rounded cursor-pointer"
              title={shape.visible ? '非表示にする' : '表示する'}
            >
              {shape.visible ? <VscEye /> : <VscEyeClosed />}
            </button>
          </li>
        ))}
        {shapes.length === 0 && <li className="p-2 text-gray-500">要素がありません</li>}
      </ul>
    </div>
  );
};