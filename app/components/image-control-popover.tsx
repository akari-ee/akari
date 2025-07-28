import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { PlusIcon, SlideshowIcon, XIcon } from "@phosphor-icons/react";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToHorizontalAxis,
} from "@dnd-kit/modifiers";
import { SortableItem } from "./sortable-item";
import { useState } from "react";

interface ImageControlPopover {
  isPC?: boolean;
  images: string[];
  currentIndex: number;
  maxImageCount: number;
  currentImageCount: number;
  onRemove?: () => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  onClickPreview: (image: string, index: number) => void;
  onClickFileRef?: () => void;
}

export default function ImageControlPopover({
  isPC = true,
  images,
  currentIndex,
  maxImageCount,
  currentImageCount,
  onRemove,
  onReorder,
  onClickPreview,
  onClickFileRef,
}: ImageControlPopover) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.indexOf(active.id as string);
    const newIndex = images.indexOf(over.id as string);

    if (oldIndex !== newIndex) {
      onReorder && onReorder(oldIndex, newIndex);
    }

    setActiveId(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size={isPC ? "icon" : "lg"}
          className={cn(
            "bg-black/70 hover:bg-black/80",
            isPC
              ? "rounded-full"
              : "flex flex-col items-center gap-0 h-12 text-sm w-16"
          )}
        >
          <SlideshowIcon
            weight={isPC ? "regular" : "bold"}
            className={isPC ? "size-5" : "size-4"}
          />
          {!isPC && <span>컨트롤</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align={isPC ? "end" : "center"}
        sideOffset={12}
        className="shadow-none border-0 bg-black/70 text-white p-3 overflow-scroll h-24 md:h-36 max-w-dvw flex flex-row items-center w-fit gap-3"
      >
        <div className="flex flex-row items-center w-fit gap-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToParentElement, restrictToHorizontalAxis]}
          >
            <SortableContext
              items={images}
              strategy={horizontalListSortingStrategy}
            >
              {images.map((image, index) => (
                <SortableItem key={image} id={image}>
                  <div
                    className={cn(
                      "flex aspect-square items-center justify-center cursor-pointer transition-all h-18 md:h-30 overflow-hidden",
                      currentIndex === index
                        ? "border-white"
                        : "border-transparent hover:border-gray-400",
                      activeId === image && "scale-110 duration-200"
                    )}
                    onClick={() => {
                      onClickPreview(image, index);
                    }}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={cn(
                        "object-cover w-full h-full",
                        currentIndex !== index && "brightness-75"
                      )}
                      loading="lazy"
                    />
                  </div>
                  {/* 이미지 삭제 */}
                  {onRemove && (
                    <Button
                      className={cn(
                        "hidden absolute top-1 right-1 rounded-full size-5 bg-black/80",
                        currentIndex === index && "inline-flex"
                      )}
                      size={"icon"}
                      onClick={() => onRemove()}
                    >
                      <XIcon className="size-3.5" />
                    </Button>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* 이미지 추가 버튼 */}
        {currentImageCount < maxImageCount && onClickFileRef && (
          <div>
            <Button
              size={"icon"}
              variant={"outline"}
              className="rounded-full bg-transparent hover:bg-transparent hover:text-inherit size-8"
              onClick={onClickFileRef}
            >
              <PlusIcon className="size-5" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
