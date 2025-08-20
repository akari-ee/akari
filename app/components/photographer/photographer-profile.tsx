import { Link } from "react-router";
import type { PhotographerWithSocial } from "~/types/entities";
import { Button } from "../ui/button";
import { SOCIAL_ICON_MAP } from "~/types/social-fields";
import { cn } from "~/lib/utils";
import PhotographerSettingButton from "../photographer-setting-button";

export default function PhotographerProfile({
  photographer,
}: {
  photographer: PhotographerWithSocial;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full gap-4 justify-between flex-col">
        <div className="flex flex-row justify-between gap-4 items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full shrink-0">
            <img
              src={photographer?.url!}
              alt={photographer?.name}
              width={120}
              height={120}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <aside>
            <PhotographerSettingButton id={photographer.id} />
            <Link
              to={`/setting/${photographer.id}/profile`}
              prefetch="viewport"
              className="text-sm underline underline-offset-2 hidden lg:flex"
            >
              설정
            </Link>
          </aside>
        </div>

        <div className="flex flex-row justify-between gap-4 items-center">
          <h1 className="text-2xl font-medium w-full">@{photographer?.name}</h1>
          <menu
            className="flex items-center gap-1 rounded-xl
          bg-background/75 p-1 backdrop-blur-xl h-fit w-fit"
          >
            {photographer?.social.map(({ url, platform, id }) => {
              const { icon: Icon, label } = SOCIAL_ICON_MAP[platform];

              return (
                <Button asChild variant={"ghost"} key={id} size={"icon"}>
                  <Link
                    to={url}
                    className={cn(
                      "flex gap-1 rounded-lg px-3 py-1 transition-colors active:inset-shadow-xs",
                      "border-muted text-muted-foreground max-sm:px-2 hover:border-neutral-200 bg-neutral-50"
                    )}
                  >
                    <Icon className="size-5" weight="fill" />
                  </Link>
                </Button>
              );
            })}
          </menu>
        </div>
      </div>
      <article className="w-full flex items-center">
        <div className="rounded-xl w-full">
          <p className="text-gray-800 whitespace-pre-line leading-relaxed text-base">
            {photographer?.introduction}
          </p>
        </div>
      </article>
    </div>
  );
}
