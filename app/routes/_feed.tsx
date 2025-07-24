import { Outlet } from "react-router";
import MobileMenu from "~/components/shared/mobile-menu";
import NavBar from "~/components/shared/nav-bar";
import SearchBar from "~/components/shared/search-bar";
import { cn } from "~/lib/utils";

export default function FeedLayout() {
  return (
    <div className="relative">
      <NavBar />
      <MobileMenu />
      <aside className="px-4 sticky top-18 z-50 py-3 bg-background border-b border-divider md:hidden">
        <SearchBar />
      </aside>
      <main className="px-6 flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
