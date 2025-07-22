import type { Route } from "./+types/_feed._index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hola" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function MainRoute({ loaderData }: Route.ComponentProps) {
  return (
    <main>Main Route</main>
  );
}
