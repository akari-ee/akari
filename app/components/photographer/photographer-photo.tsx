import Carousel from "../shared/carousel";
import { Button } from "../ui/button";
import { Link } from "react-router";
import type { BasePhoto } from "~/types/base";
import { ImagesIcon } from "@phosphor-icons/react";

export default function PhotographerPhoto({ photo }: { photo: BasePhoto[] }) {
  return (
    <div>
      {photo.length > 0 ? (
        <div className="flex flex-col gap-4">
          <Carousel items={photo} />
          <div className="flex justify-center items-center">
            <Button asChild>
              <Link to={"#"} className="text-xs">
                <ImagesIcon size={24} />
                View More
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground">사진이 없습니다.</div>
      )}
    </div>
  );
}
