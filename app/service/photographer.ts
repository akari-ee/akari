import type { SupabaseClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";
import type { BaseCollection, BasePhoto, BasePhotoGrapher } from "~/types/base";
import type { PhotographerWithSocial } from "~/types/entities";

export const fetchPhotographerList = async (
  supabase: SupabaseClient
): Promise<BasePhotoGrapher[]> => {
  const { data } = await supabase
    .from("photographers")
    .select("*")
    .overrideTypes<BasePhotoGrapher[]>()
    .throwOnError();

  return data;
};

export const fetchPhotographerInfo = async (
  supabase: SupabaseClient,
  id: BasePhotoGrapher["id"]
): Promise<PhotographerWithSocial> => {
  const { data } = await supabase
    .from("photographers")
    .select("*, social:photographer_social_links(*)")
    .eq("id", id)
    .single<PhotographerWithSocial>()
    .throwOnError();

  return data;
};

export const fetchCollectionByPhotographer = async (
  supabase: SupabaseClient,
  id: BasePhotoGrapher["id"]
): Promise<BaseCollection[]> => {
  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("photographer_id", id)
    .limit(5)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
};

export const fetchPhotoByPhotographer = async (
  supabase: SupabaseClient,
  id: BasePhotoGrapher["id"]
): Promise<BasePhoto[]> => {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("photographer_id", id)
    .limit(5)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
};

export const photographerQueryOptions = {
  all: ["photographer"] as const,
  info: (supabase: SupabaseClient, id: BasePhotoGrapher["id"]) =>
    queryOptions({
      queryKey: [...photographerQueryOptions.all, "detail", id] as const,
      queryFn: () => fetchPhotographerInfo(supabase, id),
    }),
  collection: (supabase: SupabaseClient, id: BasePhotoGrapher["id"]) =>
    queryOptions({
      queryKey: [...photographerQueryOptions.all, "collection", id],
      queryFn: () => fetchCollectionByPhotographer(supabase, id),
    }),
  photo: (supabase: SupabaseClient, id: BasePhotoGrapher["id"]) =>
    queryOptions({
      queryKey: [...photographerQueryOptions.all, "photo", id],
      queryFn: () => fetchPhotoByPhotographer(supabase, id),
    }),
};
