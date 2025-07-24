import PrevButton from "../shared/prev-button";
import { Link } from "react-router";
import type { PhotographerWithSocial } from "~/types/entities";
import { Button } from "../ui/button";
import { SOCIAL_FIELDS, SOCIAL_ICON_MAP } from "~/types/social-fields";
import { cn } from "~/lib/utils";

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
      <div className="flex w-full gap-8 mb-6">
        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full shrink-0">
          <img
            src={photographer?.url!}
            alt={photographer?.name}
            width={300}
            height={300}
            className="object-cover w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col justify-between">
          <h1 className="text-2xl font-semibold w-full">
            @{photographer?.name}
          </h1>
          <menu
            className="flex items-center gap-1 rounded-xl border
          bg-background/75 p-1 backdrop-blur-xl h-fit"
          >
            {photographer?.social.map(({ url, platform, id }) => {
              const { icon: Icon, label } = SOCIAL_ICON_MAP[platform];

              return (
                <Button asChild variant={"ghost"}>
                  <Link
                    to={url}
                    className={cn(
                      "flex gap-1 rounded-lg border px-3 py-1 transition-colors active:inset-shadow-xs sm:text-sm",
                      "border-muted text-muted-foreground max-sm:px-2 hover:border-neutral-200 bg-neutral-50",
                      
                    )}
                  >
                    <Icon className="size-6 sm:size-5" weight="duotone" />
                    <span className="hidden sm:block">{label}</span>
                  </Link>
                </Button>
              );
            })}
          </menu>
        </div>
      </div>
      <article className="w-full flex items-center my-8">
        <div className="rounded-xl w-full">
          <p className="text-gray-800 whitespace-pre-line leading-relaxed text-base sm:text-lg md:text-lg">
            {photographer?.introduction}
          </p>
        </div>
      </article>
    </div>
  );
}
