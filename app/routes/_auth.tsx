import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="h-dvh mx-auto container px-6">
      <div className="flex text-2xl font-light font-josefin h-fit mt-1 fixed top-0 py-4 lg:hidden">
        <h1>AKARI</h1>
      </div>
      <Outlet />
    </div>
  );
}
