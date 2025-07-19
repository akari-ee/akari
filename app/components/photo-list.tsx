import { createBrowserClient } from "~/lib/supabase-client";
import { usePhotoList } from "~/service/photo";

export default function PhotoList() {
  const supabase = createBrowserClient();
  const {
    data: photoList,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = usePhotoList(supabase);

  return <section className="h-full w-full" aria-label="사진 목록"></section>;
}
