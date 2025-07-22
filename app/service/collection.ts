import type { SupabaseClient } from "@supabase/supabase-js";
// import { infiniteQueryOptions } from "@suspensive/react-query";
import { infiniteQueryOptions } from "@tanstack/react-query";
import type { Database } from "~/types/types_db";

const PAGE_SIZE = 8;

export type Collection = Database["public"]["Tables"]["collections"]["Row"];

// 타입 분리: 컬렉션/포토/포토그래퍼 등 조합 타입
export type CollectionWithRelations = Collection & {
  photographer: Database["public"]["Tables"]["photographers"]["Row"];
  thumbnail: Database["public"]["Tables"]["photos"]["Row"];
  totalCount?: { count: number }[];
};

export type PhotoWithMetadata =
  Database["public"]["Tables"]["photos"]["Row"] & {
    metadata: Database["public"]["Tables"]["photo_metadata"]["Row"];
  };

export const fetchCollectionList = async (
  supabase: SupabaseClient,
  page: number
): Promise<CollectionWithRelations[]> => {
  const { data } = await supabase
    .from("collections")
    .select(
      `*, photographer:photographers(*), thumbnail:thumbnail_photo_id(*), totalCount:photos_collection_id_fkey(count)`
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
    .overrideTypes<CollectionWithRelations[]>()
    .throwOnError();

  return data;
};

export const fetchCollectionDetail = async (
  supabase: SupabaseClient,
  id: string
): Promise<{
  collection: CollectionWithRelations | null;
  photos: PhotoWithMetadata[];
}> => {
  const [collectionRes, photosRes] = await Promise.all([
    supabase
      .from("collections")
      .select("*, photographer:photographers(*)")
      .eq("id", id)
      .single<CollectionWithRelations>(),
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
      queryKey: ["list", page],
      queryFn: ({ pageParam = 1 }) => fetchCollectionList(supabase, pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages, lastPageParam) => {
        return lastPageParam + 1;
      },
      select: (data) =>
        (data.pages.flat() as CollectionWithRelations[]).map((item) => ({
          ...item,
          totalCount: item.totalCount?.[0]?.count ?? 0,
        })),
    }),
};
