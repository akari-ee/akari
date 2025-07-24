import { SignatureIcon } from "lucide-react";

import { Input } from "~/components/ui/input";

export default function SearchBar() {
  return (
    <div className="*:not-first:mt-2 grow lg:grow-0">
      <div className="relative">
        <Input
          className="peer ps-10 rounded-xl w-full md:w-80 lg:w-96 h-12 shadow-none bg-border border-none transition-all duration-1000"
          placeholder="Search"
          type="text"
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SignatureIcon size={16} />
        </div>
      </div>
    </div>
  );
}
