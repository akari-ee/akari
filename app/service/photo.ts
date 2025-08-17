import type { SupabaseClient } from "@supabase/supabase-js";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "~/constant/service";
import type { BasePhoto } from "~/types/base";
import type { PhotoDetail } from "~/types/entities";

export interface GetPhotoListParams {
  page?: number;
  pageSize?: number;
  supabase: SupabaseClient;
}

export interface GetPhotoDetailParams {
  id: number;
  supabase: SupabaseClient;
}

export async function fetchPhotoList({
  supabase,
  page = 1,
}: GetPhotoListParams): Promise<BasePhoto[]> {
  const { data } = await supabase
    .from("photos")
    .select("*, photographer:photographers(*)")
    .order("created_at", { ascending: false })
    .range((page - 1) * DEFAULT_PAGE_SIZE, page * DEFAULT_PAGE_SIZE - 1)
    .overrideTypes<BasePhoto[]>()
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
  list: (supabase: SupabaseClient, page: number) =>
    infiniteQueryOptions({
      queryKey: ["list", page],
      queryFn: ({ pageParam = 1 }) =>
        fetchPhotoList({ supabase, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages, lastPageParam) => {
        const hasMore =
          Array.isArray(lastPage) && lastPage.length >= DEFAULT_PAGE_SIZE;
        return hasMore ? lastPageParam + 1 : undefined;
      },
      select: (data) => {
        return data.pages.flat();
      },
    }),
  detail: (supabase: SupabaseClient, id: BasePhoto["id"]) =>
    queryOptions({
      queryKey: [...photoQueryOptions.all, "detail", id] as const,
      queryFn: () => getPhotoDetail({ supabase, id }),
    }),
};
