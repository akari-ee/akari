import { Outlet } from "react-router";
import NavBar from "~/components/shared/nav-bar";

export default function FeedLayout() {
  return (
    <div className="relative">
      <NavBar />
      <main className="px-6 flex-grow bg-background">
        <Outlet />
      </main>
    </div>
  );
}
