import type { Route } from "./+types/_feed._index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hola" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function MainRoute({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex flex-col items-center justify-center gap-4 py-4 md:py-6 w-full h-full"></main>
  );
}
