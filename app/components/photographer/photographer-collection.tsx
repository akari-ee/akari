import { Button } from "../ui/button";
import { Link } from "react-router";
import { ImagesIcon } from "lucide-react";
import type { CollectionWithRelation } from "~/types/entities";

// TODO: 더보기 버튼 링크 추가
export default function PhotographerCollection({
  collection,
}: {
  collection: CollectionWithRelation[];
}) {
  return (
    <div>
      {collection.length > 0 ? (
        <div className="relative">
          <div className="flex flex-col gap-3">
            {collection.map(({ id, thumbnail, title }) => (
              <div className="relative rounded-lg" key={id}>
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={thumbnail.url}
                    alt={title}
                    className="h-60 object-cover w-full"
                  />
                </div>
                <div key={id} className="absolute bottom-0 font-black text-xl">
                  {title}
                </div>
              </div>
            ))}
          </div>
          <div
            className="absolute -inset-x-[3px] -bottom-[3px] z-30 flex
        justify-center rounded-xl bg-linear-to-b from-transparent
        to-background pt-12 pb-4"
          >
            <Button asChild>
              <Link to={"#"} className="text-xs">
                <ImagesIcon size={24} />
                View More
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground">컬렉션이 없습니다.</div>
      )}
    </div>
  );
}
