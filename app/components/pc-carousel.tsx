import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { cn } from "~/lib/utils";
import ImageControlPopover from "./image-control-popover";

interface PcCarouselProps {
  images: string[];
  maxImageCount: number;
  currentIndex: number;
  currentImageCount: number;
  onRemove?: () => void;
  onSelect?: (idx: number) => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  onClickFileRef: () => void;
  onClickPreview: (image: string, index: number) => void;
  onSetApi: (api: CarouselApi | undefined) => void;
}

export default function PcCarousel({
  images,
  height = "400px",
  maxImageCount,
  currentIndex,
  currentImageCount,
  onRemove,
  onReorder,
  onClickFileRef,
  onClickPreview,
  onSetApi,
}: PcCarouselProps & { height?: string }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {/* 인디케이터 */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center">
        <div className="rounded-md bg-black/80 px-3 py-1 text-xs text-white">
          {currentIndex + 1} / {currentImageCount}
        </div>
      </div>

      {/* 이미지 핸들 팝오버(제거, 추가, 순서 변경) */}
      <div className="absolute bottom-2 right-2 z-10 flex gap-2 items-center flex-row-reverse">
        <ImageControlPopover
          images={images}
          currentIndex={currentIndex}
          maxImageCount={maxImageCount}
          currentImageCount={currentImageCount}
          onRemove={onRemove}
          onReorder={onReorder}
          onClickPreview={onClickPreview}
          onClickFileRef={onClickFileRef}
        />
      </div>

      {/* 이미지 캐러셀 */}
      <Carousel setApi={onSetApi} className="h-full w-full">
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
                  className="object-contain max-w-full"
                  style={{ maxHeight: height }}
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
          type="button"
        />
        <CarouselNext
          className={cn(
            "right-4 bg-black/70 text-white hover:bg-black/80 hover:text-white border-none",
            currentIndex === images.length - 1 && "hidden"
          )}
          type="button"
        />
      </Carousel>
    </div>
  );
}
