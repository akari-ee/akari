import { Outlet } from "react-router";
import NavBar from "~/components/shared/nav-bar";
import SearchBar from "~/components/shared/search-bar";

export default function FeedLayout() {
  return (
    <div className="relative">
      <NavBar />
      <aside className="px-4 sticky top-16 z-10 py-3 bg-background border-b border-divider md:hidden">
        <SearchBar />
      </aside>
      <main className="px-6 flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
