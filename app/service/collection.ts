import { createQueryKeys } from "@lukemorales/query-key-factory";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  dehydrate,
  QueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { Database } from "~/types/types_db";
import { formatDate } from "../lib/utils";

const PAGE_SIZE = 8;

// 타입 분리: 컬렉션/포토/포토그래퍼 등 조합 타입
export type CollectionWithRelations = Database["public"]["Tables"]["collections"]["Row"] & {
  photographer: Database["public"]["Tables"]["photographers"]["Row"];
  thumbnail_photo: Database["public"]["Tables"]["photos"]["Row"];
  total_count?: { count: number }[];
};

export type PhotoWithMetadata = Database["public"]["Tables"]["photos"]["Row"] & {
  metadata: Database["public"]["Tables"]["photo_metadata"]["Row"];
};

// fetch 함수 일반화: 옵션 객체로 파라미터 확장
export const fetchCollectionList = async (
  supabase: SupabaseClient,
  options: { page?: number; pageSize?: number; select?: string } = {}
): Promise<CollectionWithRelations[]> => {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? PAGE_SIZE;
  const select =
    options.select ??
    `*, photographer:photographers(*), thumbnail_photo:thumbnail_photo_id(*), total_count:photos_collection_id_fkey(count)`;
  const { data } = await supabase
    .from("collections")
    .select(select)
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)
    .overrideTypes<CollectionWithRelations[]>()
    .throwOnError();
  return data;
};

export const fetchCollectionDetail = async (
  supabase: SupabaseClient,
  id: string
): Promise<{ collection: CollectionWithRelations | null; photos: PhotoWithMetadata[] }> => {
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
  return { collection: collectionRes.data ?? null, photos: photosRes.data ?? [] };
};

// 쿼리 서비스 객체 개선
export const collectionService = createQueryKeys("collection", {
  all: (supabase: SupabaseClient, options?: { page?: number; pageSize?: number }) => ({
    queryKey: ["all", options],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchCollectionList(supabase, { page: pageParam, pageSize: options?.pageSize }),
  }),
  detail: (supabase: SupabaseClient, id: string) => ({
    queryKey: ["detail", id],
    queryFn: () => fetchCollectionDetail(supabase, id),
  }),
});

// React Query 훅 분리 및 개선
export const useQueryCollectionList = (
  supabase: SupabaseClient,
  options?: { pageSize?: number }
) => {
  return useSuspenseInfiniteQuery({
    ...collectionService.all(supabase, options),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (!lastPage) return undefined;
      return Array.isArray(lastPage) && lastPage.length === (options?.pageSize ?? PAGE_SIZE)
        ? lastPageParam + 1
        : undefined;
    },
    select: (data) =>
      (data.pages.flat() as CollectionWithRelations[]).map((item) => ({
        ...item,
        total_count: item.total_count?.[0]?.count ?? 0,
      })),
    retry: 0,
  });
};

export const prefetchCollectionList = async (
  supabase: SupabaseClient,
  options?: { pageSize?: number }
) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    ...collectionService.all(supabase, options),
    initialPageParam: 1,
  });
  return dehydrate(queryClient);
};

export const useQueryCollectionDetail = (
  supabase: SupabaseClient,
  id: string
) => {
  return useSuspenseQuery({
    ...collectionService.detail(supabase, id),
    select: (data) => {
      return {
        ...data,
        photos: data.photos.map((photo) => ({
          ...photo,
          metadata: {
            ...photo.metadata,
            created_at: photo.metadata.created_at ? formatDate(photo.metadata.created_at) : "",
          },
        })),
      };
    },
  });
};

export const prefetchCollectionDetail = async (
  supabase: SupabaseClient,
  id: string
) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    ...collectionService.detail(supabase, id),
  });
  return dehydrate(queryClient);
};
