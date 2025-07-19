import { SearchIcon } from "lucide-react";

import { Input } from "~/components/ui/input";

export default function SearchBar() {
  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input
          className="peer ps-9 rounded-full md:w-60 lg:w-96 h-12"
          placeholder="Search"
          type="text"
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}
