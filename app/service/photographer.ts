import type { SupabaseClient } from "@supabase/supabase-js";
import { queryOptions } from "@tanstack/react-query";
import type { Database } from "~/types/types_db";

// 타입 분리
export type Photographer = Database["public"]["Tables"]["photographers"]["Row"];
export type PhotographerDetail = Photographer & {
  social: Database["public"]["Tables"]["photographer_social_links"]["Row"][];
};

export type Photo = Database["public"]["Tables"]["photos"]["Row"];
export type Collection = Database["public"]["Tables"]["collections"]["Row"];


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

export const fetchPhotographerInfo = async (
  supabase: SupabaseClient,
  id: Photographer["id"]
): Promise<PhotographerDetail> => {
  const { data } = await supabase
    .from("photographers")
    .select("*, social:photographer_social_links(*)")
    .eq("id", id)
    .single<PhotographerDetail>()
    .throwOnError();

  return data;
};

export const fetchCollectionByPhotographer = async (
  supabase: SupabaseClient,
  id: Photographer["id"]
): Promise<Collection[]> => {
  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("photographer_id", id)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
};

export const fetchPhotoByPhotographer = async (
  supabase: SupabaseClient,
  id: Photographer["id"]
): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("photographer_id", id)
    .order("created_at", { ascending: false })
    .throwOnError();

  return data;
};

export const photographerQueryOptions = {
  all: ["photographer"] as const,
  info: (supabase: SupabaseClient, id: Photographer["id"]) =>
    queryOptions({
      queryKey: [...photographerQueryOptions.all, "detail", id] as const,
      queryFn: () => fetchPhotographerInfo(supabase, id),
    }),
  collection: (supabase: SupabaseClient, id: Photographer["id"]) =>
    queryOptions({
      queryKey: ["collection", id],
      queryFn: () => fetchCollectionByPhotographer(supabase, id),
    }),
  photo: (supabase: SupabaseClient, id: Photographer["id"]) =>
    queryOptions({
      queryKey: ["photo", id],
      queryFn: () => fetchPhotoByPhotographer(supabase, id),
    }),
};
