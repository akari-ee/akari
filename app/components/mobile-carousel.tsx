import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "~/components/ui/carousel";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import ImageControlPopover from "./image-control-popover";

interface MobileCarouselProps {
  images: string[];
  maxImageCount: number;
  currentIndex: number;
  currentImageCount: number;
  onRemove?: () => void;
  onReorder?: (oldIndex: number, newIndex: number) => void;
  onClickFileRef: () => void;
  onClickPreview: (image: string, index: number) => void;
  onSetApi: (api: CarouselApi | undefined) => void;
}

export default function MobileCarousel({
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
}: MobileCarouselProps & {
  height?: string;
}) {
  return (
    <div className="w-full max-w-full h-full my-4 space-y-4">
      <Carousel
        setApi={onSetApi}
        className="w-full h-fit"
        opts={{ loop: false }}
      >
        <CarouselContent
          className={cn(
            "h-full",
            currentImageCount === 1 && "flex justify-center"
          )}
        >
          {images.map((image, index) => (
            <CarouselItem key={image} className="basis-4/5" style={{ height }}>
              <Card
                className={cn(
                  "bg-background transition-all duration-500 p-0 overflow-hidden shadow-none",
                  {
                    "opacity-30": index !== currentIndex,
                  }
                )}
                style={{ height }}
              >
                <CardContent
                  className="flex items-center justify-center p-0 relative"
                  style={{ height }}
                >
                  <div>
                    <img
                      src={image}
                      alt={image}
                      className="object-contain max-w-full"
                      style={{ maxHeight: height }}
                      loading="lazy"
                    />
                  </div>
                  <Button
                    className={cn(
                      "hidden absolute top-2 right-2 rounded-full size-5 bg-black/80",
                      currentIndex === index && "inline-flex"
                    )}
                    size={"icon"}
                    onClick={() => onRemove && onRemove()}
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <menu className="flex justify-center gap-2">
        <ImageControlPopover
          isPC={false}
          images={images}
          currentIndex={currentIndex}
          maxImageCount={maxImageCount}
          currentImageCount={currentImageCount}
          onReorder={onReorder}
          onClickPreview={onClickPreview}
        />
        {currentImageCount < maxImageCount && (
          <Button
            size={"lg"}
            className={cn(
              "bg-black/70 hover:bg-black/80 shadow-none",
              "flex flex-col items-center gap-0 h-12 text-sm w-16"
            )}
            onClick={onClickFileRef}
          >
            <PlusIcon weight="bold" className="size-4" />
            <span>추가</span>
          </Button>
        )}
      </menu>
    </div>
  );
}
