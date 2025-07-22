import type { BaseCollection } from "~/types/base";
import { Button } from "../ui/button";

export default function PhotographerCollection({
  collection,
}: {
  collection: BaseCollection[];
}) {
  return (
    <div className="flex flex-col gap-3 flex-wrap">
      {collection.length > 0 ? (
        <>
          {collection.map((item) => (
            <div key={item.id} className="h-60 border">
              {item.title}
            </div>
          ))}
          <div className="text-right">
            <Button
              variant={"secondary"}
              size={"lg"}
              className="rounded-full shadow-none"
            >
              더보기
            </Button>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground">컬렉션이 없습니다.</div>
      )}
    </div>
  );
}
