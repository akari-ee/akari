import Carousel from "../shared/carousel";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { EllipsisIcon } from "lucide-react";
import type { BasePhoto } from "~/types/base";

export default function PhotographerPhoto({ photo }: { photo: BasePhoto[] }) {
  return (
    <div>
      {photo.length > 0 ? (
        <>
          <Carousel items={photo} />
          <div className="flex justify-center items-center">
            <Button
              asChild
              variant={"secondary"}
              size={"icon"}
              className="rounded-full shadow-none"
            >
              <Link to={"#"}>
                <EllipsisIcon />
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground">사진이 없습니다.</div>
      )}
    </div>
  );
}
