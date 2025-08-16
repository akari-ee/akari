import { Outlet } from "react-router";
import NavBar from "~/components/shared/nav-bar";

export default function FeedLayout() {
  return (
    <div className="relative flex flex-col h-dvh">
      <NavBar />
      <main className="px-4 flex-grow bg-background">
        <Outlet />
      </main>
    </div>
  );
}
