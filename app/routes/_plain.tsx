import React from "react";
import { Outlet } from "react-router";

export default function PlainLayout() {
  return (
    <main className="h-full">
      <Outlet />
    </main>
  );
}
