import { data, useParams } from "react-router";
import type { Route } from "./+types/_plain.photographer.$id";
import { createServerClient } from "~/lib/supabase-server";
import { prefetchPhotographer, usePhotographer } from "~/service/photographer";
import { HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import PhotographerDetail from "~/components/photographer-detail";

export async function loader({ params }: Route.LoaderArgs) {
  const id = Number(params.id);

  if (!id) throw data("Not found", { status: 404 });

  const supabase = await createServerClient();
  const state = await prefetchPhotographer(supabase, id);

  return { dehydratedState: state };
}

let isInitialRequest = true;

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  if (isInitialRequest) {
    isInitialRequest = false;
    return await serverLoader();
  }
  return { dehydratedState: undefined };
}

export default function PhotographerDetailRoute({
  loaderData,
}: Route.ComponentProps) {
  const { id } = useParams();

  if (!id) throw data("Not found", { status: 404 });

  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
      <main className="flex flex-col justify-center gap-4 w-full h-full">
        <Suspense
          fallback={
            <div className="h-full w-full flex items-center justify-center">
              Loading...
            </div>
          }
        >
          <PhotographerDetail id={id} />
        </Suspense>
      </main>
    </HydrationBoundary>
  );
}
