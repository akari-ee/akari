import { CaretLeftIcon } from "@phosphor-icons/react";
import { Link, NavLink, Outlet, useParams } from "react-router";
import NavBar from "~/components/shared/nav-bar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function SettingLayout() {
  const { id } = useParams();

  return (
    <div className="relative flex flex-col h-dvh bg-background">
      <NavBar />

      <main className="flex-grow flex flex-col max-w-7xl mx-auto container py-4 lg:flex-row gap-8 lg:py-12">
        <aside className="lg:basis-1/6 shrink-0 border-b pb-4 lg:border-b-0 lg:border-r px-4 flex flex-row justify-between lg:flex-col items-center">
          <ul className="flex flex-row gap-4 font-semibold lg:flex-col lg:gap-6 w-full">
            <li>
              <NavLink to={`/setting/${id}/profile`} prefetch="viewport">
                {({ isActive }) => (
                  <span
                    className={cn(
                      "p-2 rounded-lg hover:bg-secondary",
                      isActive
                        ? "text-accent-foreground font-bold"
                        : "text-muted-foreground hover:text-accent-foreground"
                    )}
                  >
                    작가 등록 및 수정
                  </span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={`/setting/${id}/else`} prefetch="viewport">
                {({ isActive }) => (
                  <span
                    className={cn(
                      "p-2 rounded-lg hover:bg-secondary",
                      isActive
                        ? "text-accent-foreground font-bold"
                        : "text-muted-foreground hover:text-accent-foreground"
                    )}
                  >
                    기타 설정
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
          <div className="w-fit lg:w-full flex justify-center">
            <Button
              asChild
              variant={"ghost"}
              className="offset-border"
              size={"sm"}
            >
              <Link to={`/photographer/${id}`} className="border" prefetch="viewport">
                <CaretLeftIcon />
                프로필로 이동
              </Link>
            </Button>
          </div>
        </aside>
        <div className="basis-5/6 px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
