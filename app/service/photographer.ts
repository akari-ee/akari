import { createQueryKeys } from "@lukemorales/query-key-factory";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  dehydrate,
  QueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { Database } from "~/types/types_db";

// 타입 분리
export type Photographer = Database["public"]["Tables"]["photographers"]["Row"];

export type PhotographerDetail = Photographer & {
  social_link: Database["public"]["Tables"]["photographer_social_links"]["Row"][];
  collections: Database["public"]["Tables"]["collections"]["Row"][];
};

// fetch 함수 분리
export const fetchPhotographerList = async (
  supabase: SupabaseClient
): Promise<Photographer[]> => {
  const { data } = await supabase
    .from("photographers")
    .select("*")
    .overrideTypes<Photographer[]>()
    .throwOnError();

  return data;
};

export const fetchPhotographerDetail = async (
  supabase: SupabaseClient,
  id: number
): Promise<PhotographerDetail> => {
  const { data } = await supabase
    .from("photographers")
    .select("*, collections(*), social_link:photographer_social_links(*)")
    .eq("id", id)
    .single<PhotographerDetail>()
    .throwOnError();

  return data;
};

// 서비스 객체 개선
export const photographerService = createQueryKeys("photographer", {
  all: (supabase: SupabaseClient) => ({
    queryKey: ["all"],
    queryFn: () => fetchPhotographerList(supabase),
  }),
  detail: (supabase: SupabaseClient, id: number) => ({
    queryKey: ["detail", id],
    queryFn: () => fetchPhotographerDetail(supabase, id),
  }),
});

export const usePhotographerList = (supabase: SupabaseClient) => {
  return useSuspenseQuery({
    ...photographerService.all(supabase),
  });
};

export const usePhotographer = (supabase: SupabaseClient, id: number) => {
  return useSuspenseQuery({
    ...photographerService.detail(supabase, id),
  });
};

export const prefetchPhotographerList = async (supabase: SupabaseClient) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    ...photographerService.all(supabase),
  });
  return dehydrate(queryClient);
};

export const prefetchPhotographer = async (
  supabase: SupabaseClient,
  id: number
) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    ...photographerService.detail(supabase, id),
  });
  return dehydrate(queryClient);
};
