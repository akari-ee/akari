import { createQueryKeys } from "@lukemorales/query-key-factory";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  dehydrate,
  QueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { Database } from "~/types/types_db";

// 타입 분리
export type Photographer = Database["public"]["Tables"]["photographers"]["Row"];

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
): Promise<Photographer | null> => {
  const { data } = await supabase
    .from("photographers")
    .select("*")
    .eq("id", id)
    .single<Photographer>()
    .throwOnError();
  return data ?? null;
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

export const useQueryPhotographerList = (supabase: SupabaseClient) => {
  return useSuspenseQuery({
    ...photographerService.all(supabase),
  });
};

export const useQueryPhotographer = (supabase: SupabaseClient, id: number) => {
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
