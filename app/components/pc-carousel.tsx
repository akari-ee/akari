import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { PlusIcon, SlideshowIcon, XIcon } from "@phosphor-icons/react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

interface PcCarouselProps {
  images: string[];
  maxImageCount: number;
  currentIndex: number;
  currentImageCount: number;
  onRemove?: () => void;
  onSelect?: (idx: number) => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  onClickFileRef: () => void;
}

export default function PcCarousel({
  images,
  height = "400px",
  maxImageCount,
  currentIndex,
  currentImageCount,
  onRemove,
  onSelect,
  onReorder,
  onClickFileRef,
}: PcCarouselProps & { height?: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!api) return;
    onSelect && onSelect(api.selectedScrollSnap());
    api.on("select", () => {
      onSelect && onSelect(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (api && typeof currentIndex === "number") {
      api.scrollTo(currentIndex);
    }
  }, [currentIndex, api]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    console.log(active.id);
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
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {/* 인디케이터 */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center">
        <div className="rounded-md bg-black/80 px-3 py-1 text-xs text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* 이미지 핸들 팝오버(제거, 추가, 순서 변경) */}
      <div className="absolute bottom-2 right-2 z-10 flex gap-2 items-center flex-row-reverse">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size={"icon"}
              className="bg-black/70 rounded-full hover:bg-black/80"
            >
              <SlideshowIcon className="size-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="end"
            sideOffset={12}
            className="shadow-none border-0 bg-black/70 text-white p-3 overflow-hidden h-36 max-w-dvw flex flex-row items-center w-fit gap-3"
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
                          "flex aspect-square items-center justify-center cursor-pointer transition-all h-30 overflow-hidden",
                          currentIndex === index
                            ? "border-white"
                            : "border-transparent hover:border-gray-400",
                          activeId === image && "scale-110 duration-200"
                        )}
                        onClick={() => {
                          if (api) {
                            api.scrollTo(images.indexOf(image));
                          }
                          onSelect && onSelect(index);
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
                      <Button
                        className={cn(
                          "hidden absolute top-1 right-1 rounded-full size-5 bg-black/80",
                          currentIndex === index && "inline-flex"
                        )}
                        size={"icon"}
                        onClick={() => onRemove && onRemove()}
                      >
                        <XIcon className="size-3.5" />
                      </Button>
                    </SortableItem>
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            {/* 이미지 추가 버튼 */}
            {currentImageCount < maxImageCount && (
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
      </div>
      <Carousel setApi={setApi} className="h-full w-full">
        <CarouselContent className="h-full">
          {images.map((image) => (
            <CarouselItem key={image} style={{ height }}>
              <div
                className="flex items-center justify-center"
                style={{ height }}
              >
                <img
                  src={image}
                  alt={image}
                  className="object-contain"
                  style={{ maxHeight: height, maxWidth: "100%" }}
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={cn(
            "left-4 bg-black/70 text-white hover:bg-black/80 hover:text-white border-none",
            currentIndex === 0 && "hidden"
          )}
        />
        <CarouselNext
          className={cn(
            "right-4 bg-black/70 text-white hover:bg-black/80 hover:text-white border-none",
            currentIndex === images.length - 1 && "hidden"
          )}
        />
      </Carousel>
    </div>
  );
}
