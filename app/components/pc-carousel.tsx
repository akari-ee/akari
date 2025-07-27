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
import {
  PlusIcon,
  SlideshowIcon,
  XIcon,
} from "@phosphor-icons/react";

interface PcCarouselProps {
  images: string[];
  maxImageCount: number;
  currentIndex: number;
  onRemove?: () => void;
  onSelect?: (idx: number) => void;
}

export default function PcCarousel({
  images,
  height = "400px",
  maxImageCount,
  currentIndex,
  onRemove,
  onSelect,
}: PcCarouselProps & { height?: string }) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    onSelect && onSelect(api.selectedScrollSnap());
    api.on("select", () => {
      onSelect && onSelect(api.selectedScrollSnap());
    });
  }, [api]);

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
            className="shadow-none border-0 bg-black/70 text-white p-3 overflow-hidden h-36 max-w-dvw flex flex-row items-center w-fit"
          >
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full h-full"
            >
              <CarouselContent className="-ml-3">
                {images.map((image, index) => (
                  <CarouselItem
                    key={image}
                    className="pl-3 relative h-30"
                    style={{
                      flexBasis: `${
                        100 / Math.min(images.length, maxImageCount)
                      }%`,
                    }}
                  >
                    <div
                      className={cn(
                        "flex aspect-square items-center justify-center cursor-pointer transition-colors h-30",
                        currentIndex === index
                          ? "border-white"
                          : "border-transparent hover:border-gray-400"
                      )}
                      onClick={() => {
                        if (api) {
                          api.scrollTo(index);
                        }
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
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* 캐러셀 위치 이동 버튼 */}
            {images.length > maxImageCount && (
              <>
                <CarouselPrevious className="left-0 -translate-x-1/2 border-none text-black hover:text-black bg-white/80 hover:bg-white" />
                <CarouselNext className="right-0 translate-x-1/2 border-none text-black hover:text-black bg-white/80 hover:bg-white" />
              </>
            )}

            {/* 이미지 추가 버튼 */}
            {images.length < maxImageCount && (
              <div className="pl-4">
                <Button
                  size={"icon"}
                  variant={"outline"}
                  className="rounded-full bg-transparent hover:bg-transparent hover:text-inherit size-8"
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
