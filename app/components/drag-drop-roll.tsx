import { FilmReelIcon } from "@phosphor-icons/react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

interface DragDropRollProps {
  onClick: () => void;
  onChange: (e: any) => void;
  maxImageCount: number;
  currentImageCount: number;
}

export default function DragDropRoll({
  onClick,
  onChange,
  currentImageCount,
  maxImageCount,
}: DragDropRollProps) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("border-blue-400", "bg-blue-50");
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
        const files = Array.from(e.dataTransfer.files);

        const event = { target: { files } } as any;
        onChange(event);
      }}
      className={cn(
        "rounded-lg p-12 text-center",
        currentImageCount === maxImageCount && "hidden"
      )}
    >
      <div className="flex flex-col items-center space-y-2">
        <FilmReelIcon className="text-black size-12" />
        <p className="text-sm">당신의 이야기를 들려주세요.</p>
        <p className="text-xs text-gray-400 flex flex-col">
          <span>클릭 또는 드래그로 사진 추가</span>
          <span>JPEG, PNG, JPG, WebP 형식만 지원 (최대 {maxImageCount}장)</span>
        </p>
        <Button type="button" size={"sm"} className="px-5" onClick={onClick}>
          파일 선택
        </Button>
      </div>
    </div>
  );
}
