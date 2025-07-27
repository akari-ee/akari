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

interface PcCarouselProps {
  images: string[];
}

export default function PcCarousel({
  images,
  height = "400px",
}: PcCarouselProps & { height?: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      {/* 인디케이터 */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center">
        <div className="rounded-md bg-black/80 px-3 py-1 text-xs text-white">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* 임시 데이터 캐러셀 */}
      <Carousel setApi={setApi} className="h-full w-full">
        <CarouselContent className="h-full">
          {images.map((image, i) => (
            <CarouselItem key={i} style={{ height }}>
              <div
                className="flex items-center justify-center"
                style={{ height }}
              >
                <img
                  src={image}
                  alt={`이미지 ${i}`}
                  className="object-contain"
                  style={{ maxHeight: height, maxWidth: '100%' }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={cn(
            "left-4 bg-black/70 text-white hover:bg-black/80 hover:text-white border-none",
            current === 0 && "hidden"
          )}
        />
        <CarouselNext
          className={cn(
            "right-4 bg-black/70 text-white hover:bg-black/80 hover:text-white border-none",
            current === images.length - 1 && "hidden"
          )}
        />
      </Carousel>
    </div>
  );
}
