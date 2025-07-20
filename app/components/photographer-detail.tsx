import React from "react";
import { Link } from "react-router";
import { createBrowserClient } from "~/lib/supabase-client";
import { usePhotographer } from "~/service/photographer";
import PrevButton from "./shared/prev-button";

interface PhotographerDetailProps {
  id: string;
}

export default function PhotographerDetail({ id }: PhotographerDetailProps) {
  const supabase = createBrowserClient();
  const { data: photographer } = usePhotographer(supabase, Number(id));

  return (
    <section className="flex flex-col flex-grow">
      <header>
        <PrevButton />
      </header>
      <div>
        <aside className="w-40 h-40">
          <img
            src={photographer?.url!}
            alt={photographer?.name}
            width={300}
            height={300}
            className="object-cover w-full h-full"
          />
        </aside>
        <aside>
          <h1 className="text-2xl font-semibold">{photographer?.name}</h1>
          <p className="text-gray-500">{photographer?.introduction}</p>
          <p>
            {photographer.collections.length > 0 ? "컬렉션있음" : "컬렉션 없음"}
          </p>
          <ul>
            {photographer.social_link.map((link) => (
              <li>
                <Link to={link.url} target="_blank">
                  {"@" + link.platform}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
