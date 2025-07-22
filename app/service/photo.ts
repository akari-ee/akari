import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/types/types_db";
import {
  queryOptions,
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
}: GetPhotoListParams) {
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

export const photoQueryOptions = {
  all: ["photos"] as const,
  detail: (supabase: SupabaseClient, id: Photo["id"]) =>
    queryOptions({
      queryKey: [...photoQueryOptions.all, "detail", id] as const,
      queryFn: () => getPhotoDetail({ supabase, id }),
    }),
};
