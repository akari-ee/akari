import type { SupabaseClient } from "@supabase/supabase-js";
import { createQueryKeys } from "@lukemorales/query-key-factory";
import type { Database } from "~/types/types_db";
import {
  dehydrate,
  QueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
  type InfiniteData,
} from "@tanstack/react-query";

// 타입 별도 선언
export type Photo = Database["public"]["Tables"]["photos"]["Row"] & {
  photographer: PhotoGraphers;
};

export type PhotoGraphers =
  Database["public"]["Tables"]["photographers"]["Row"];

export type PhotoDetail = Database["public"]["Tables"]["photos"]["Row"] & {
  metadata: Database["public"]["Tables"]["photo_metadata"]["Row"];
  photographer: PhotoGraphers;
  collection: Database["public"]["Tables"]["collections"]["Row"];
};

export interface GetPhotoListParams {
  pageParam?: number;
  pageSize?: number;
  supabase: SupabaseClient;
}

export interface GetPhotoDetailParams {
  id: number;
  supabase: SupabaseClient;
}

// 기본값 상수
const DEFAULT_PAGE_SIZE = 8;

// 쿼리 함수 분리
export async function getPhotoList({
  supabase,
  pageParam = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}: GetPhotoListParams): Promise<Photo[]> {
  const { data } = await supabase
    .from("photos")
    .select("*, photographer:photographers(*)")
    .range((pageParam - 1) * pageSize, pageParam * pageSize - 1)
    .overrideTypes<Photo[]>()
    .throwOnError();

  return data;
}

export async function getPhotoDetail({
  supabase,
  id,
}: GetPhotoDetailParams): Promise<PhotoDetail> {
  const { data } = await supabase
    .from("photos")
    .select(
      `*, metadata:photo_metadata(*), photographer:photographers(*), collection:collections!photos_collection_id_fkey(*)`
    )
    .eq("id", id)
    .single<PhotoDetail>()
    .throwOnError();

  return data;
}

// Query Key Factory
export const photoQueryKeys = createQueryKeys("photo", {
  list: (params: { pageParam?: number; pageSize?: number }) => [
    "list",
    params.pageParam,
  ],
  detail: (id: number) => ["detail", id],
});

// React Query 훅
export function usePhotoList(
  supabase: SupabaseClient,
  options?: { pageSize?: number }
) {
  return useSuspenseInfiniteQuery({
    ...photoQueryKeys.list({ pageSize: options?.pageSize }),
    queryFn: ({ pageParam = 1 }) =>
      getPhotoList({
        supabase,
        pageParam,
        pageSize: options?.pageSize,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => lastPageParam + 1,
    select: (data: InfiniteData<Photo[]>) => data.pages.flat() as Photo[],
    retry: 0,
  });
}

export function usePhotoDetail(supabase: SupabaseClient, id: number) {
  return useSuspenseQuery({
    ...photoQueryKeys.detail(id),
    queryFn: () => getPhotoDetail({ supabase, id }),
    retry: 0,
  });
}

// Prefetch/Dehydrate 함수
export async function prefetchPhotoList(
  supabase: SupabaseClient,
  options?: { pageSize?: number }
) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    ...photoQueryKeys.list({ pageSize: options?.pageSize }),
    queryFn: ({ pageParam = 1 }) =>
      getPhotoList({
        supabase,
        pageParam,
        pageSize: options?.pageSize,
      }),
    initialPageParam: 1,
  });

  return dehydrate(queryClient);
}
