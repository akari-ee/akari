import { Link } from "react-router";
import { createBrowserClient } from "~/lib/supabase-client";
import { usePhotographerList } from "~/service/photographer";

export default function PhotographerList() {
  const supabase = createBrowserClient();
  const { data: photographerList } = usePhotographerList(supabase);

  return (
    <section className="h-full w-full flex flex-col gap-8">
      {photographerList.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {photographerList.map(({ id, name, url, introduction }) => (
            <Link to={`/photographer/${id}`} key={id}>
              <div className="relative w-48">
                <img
                  src={url!}
                  alt={name}
                  width={400}
                  height={100}
                  className="w-full object-cover aspect-square"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold truncate">{name}</h2>
                <h3 className="text-sm text-gray-500 truncate">
                  {introduction}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
