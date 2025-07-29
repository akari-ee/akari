import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "../ui/button";
import { MenuIcon } from "../menu-icon";
import { ROUTE_LINK } from "~/constant/route";
import { Link } from "react-router";

// TODO: 로그인 유저 프로필 메뉴 추가
export default function MobileSideMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <MenuIcon className="size-7" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="h-full w-full bg-background/85 backdrop-blur-[3px] shadow-none"
      >
        <SheetHeader>
          <SheetTitle hidden />
          <SheetDescription hidden />
        </SheetHeader>

        {/* 라우트 목록 */}
        <ul className="p-8 flex flex-col gap-3 mt-20">
          {ROUTE_LINK.map(({ label, path }) => (
            <li className="text-3xl">
              <SheetClose asChild>
                <Link to={path}>{label}</Link>
              </SheetClose>
            </li>
          ))}
        </ul>

        {/* 로그인 유저 프로필 메뉴 */}
      </SheetContent>
    </Sheet>
  );
}
