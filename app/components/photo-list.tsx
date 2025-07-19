import { createBrowserClient } from "~/lib/supabase-client";
import { usePhotoList } from "~/service/photo";
import InfiniteScroll from "./shared/infinite-scroll";
import MasonryGrid from "./shared/masonry-grid";
import { overlay } from "overlay-kit";

export default function PhotoList() {
  const supabase = createBrowserClient();
  const {
    data: photoList,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = usePhotoList(supabase);

  return (
    <section className="h-full w-full" aria-label="사진 목록">
      <InfiniteScroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isLoading={isFetching}
      >
        <MasonryGrid items={photoList}>
          {(photo) => (
            <div
              className="mb-4 group overflow-hidden cursor-pointer relative w-full break-inside-avoid"
              onClick={() => {
                // overlay.open(({ isOpen, close }) => (
                //   <PhotoModal id={photo.id} isOpen={isOpen} onClose={close} />
                // ));
              }}
            >
              <div className="w-full bg-gray-100 relative">
                <img
                  src={photo.url}
                  alt={`사진 by @${photo.photographer?.name || "작가"}`}
                  width={photo.width ?? 800}
                  height={photo.height ?? 600}
                  loading="lazy"
                  className="object-cover w-full h-full transition-all duration-300 hover:brightness-75 hover:scale-110"
                  style={{ background: photo.avg_color ?? "#eee" }}
                />
                <div className="absolute right-2 bottom-2 ...">
                  @{photo.photographer?.name}
                </div>
              </div>
            </div>
          )}
        </MasonryGrid>
      </InfiniteScroll>
      {photoList.length === 0 && (
        <div className="text-center py-10 w-full text-default-500 h-full flex items-center justify-center">
          사진이 없습니다.
        </div>
      )}
    </section>
  );
}
