import type { SupabaseClient } from "@supabase/supabase-js";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "~/constant/service";
import type {
  CollectionWithRelation,
  PhotoWithMetadata,
} from "~/types/entities";

export const fetchCollectionList = async (
  supabase: SupabaseClient,
  page: number
): Promise<CollectionWithRelation[]> => {
  const { data } = await supabase
    .from("collections")
    .select(
      `*, photographer:photographers(*), thumbnail:thumbnail_photo_id(*), totalCount:photos_collection_id_fkey(count)`
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE - 1)
    .overrideTypes<CollectionWithRelation[]>()
    .throwOnError();

  return data;
};

export const fetchCollectionDetail = async (
  supabase: SupabaseClient,
  id: string
): Promise<{
  collection: CollectionWithRelation | null;
  photos: PhotoWithMetadata[];
}> => {
  const [collectionRes, photosRes] = await Promise.all([
    supabase
      .from("collections")
      .select("*, photographer:photographers(*)")
      .eq("id", id)
      .single<CollectionWithRelation>(),
    supabase
      .from("photos")
      .select("*, metadata:photo_metadata(*)")
      .eq("collection_id", id)
      .overrideTypes<PhotoWithMetadata[]>()
      .throwOnError(),
  ]);
  return {
    collection: collectionRes.data,
    photos: photosRes.data,
  };
};

export const collectionQueryOptions = {
  all: ["collection"] as const,
  list: (supabase: SupabaseClient, page: number) =>
    infiniteQueryOptions({
      queryKey: [...collectionQueryOptions.all, "list", page],
      queryFn: ({ pageParam = 1 }) => fetchCollectionList(supabase, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages, lastPageParam) => {
        // 더 이상 불러올 데이터가 없으면 undefined를 반환하여 hasNextPage를 false로 설정
        const hasMore = Array.isArray(lastPage) && lastPage.length >= DEFAULT_PAGE_SIZE;
        return hasMore ? lastPageParam + 1 : undefined;
      },
      select: (data) =>
        (data.pages.flat() as CollectionWithRelation[]).map((item) => ({
          ...item,
          totalCount: item.totalCount?.[0]?.count ?? 0,
        })),
    }),
};
