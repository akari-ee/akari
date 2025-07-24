import { Link } from "react-router";
import type { PhotographerWithSocial } from "~/types/entities";

export default function PhotographerSocial({
  social,
}: {
  social: PhotographerWithSocial["social"];
}) {
  return (
    <>
      {social.map(({ id, platform, url }) => {
        return (
          <div
            className="flex items-start gap-2 overflow-clip rounded-xl border
      bg-neutral-100 p-4 offset-border transition-colors flex-col justify-between hover:bg-neutral-50 aspect-square w-fit h-fit"
          >
            <Link
              to={url}
              target="_blank"
              aria-label={`Social Platform ${platform}`}
              className="relative shrink-0 rounded-full p-1 flex flex-col gap-4"
            >
              <div>
                <img
                  className="absolute inset-0 size-full rounded-full blur-2xl"
                  src={`/${platform}.png`}
                  loading="lazy"
                  alt={platform}
                />
                <img
                  className="relative size-8"
                  src={`/${platform}.png`}
                  loading="lazy"
                  alt={platform}
                />
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
}
