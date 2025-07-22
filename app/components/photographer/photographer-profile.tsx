import PrevButton from "../shared/prev-button";
import { SOCIAL_ICON_MAP } from "../icons/icon-social";
import { Button } from "../ui/button";
import { Link } from "react-router";
import type { PhotographerWithSocial } from "~/types/entities";

export default function PhotographerProfile({
  photographer,
}: {
  photographer: PhotographerWithSocial;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <header className="mb-8 flex flex-row items-center w-full gap-3">
        <PrevButton />
        <h1 className="text-2xl font-semibold w-full">@{photographer?.name}</h1>
      </header>
      <div className="w-32 h-32">
        <img
          src={photographer?.url!}
          alt={photographer?.name}
          width={300}
          height={300}
          className="object-cover w-full h-full rounded-full"
        />
      </div>
      <aside className="flex flex-row gap-1 w-fit border rounded-lg p-1">
        {photographer?.social.map(({ id, platform, url }) => {
          const Icon = SOCIAL_ICON_MAP[platform];

          return (
            <Button key={id} asChild variant={"ghost"} size={"icon"}>
              <Link to={url}>
                <Icon className="size-5" />
              </Link>
            </Button>
          );
        })}
      </aside>
      <article className="w-full space-y-2 border rounded-lg p-4">
        <h2 className="font-medium">작가의 말</h2>
        <p>{photographer?.introduction}</p>
      </article>
    </div>
  );
}
