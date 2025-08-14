import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Button } from "./ui/button";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { Link } from "react-router";
import type { BasePhotoGrapher } from "~/types/base";

export default function PhotographerSettingButton({
  id,
}: {
  id: BasePhotoGrapher["id"];
}) {
  return (
    <Drawer>
      <DrawerTrigger asChild className="flex lg:hidden">
        <Button
          size={"icon"}
          variant={"secondary"}
          className="rounded-full shadow-none"
        >
          <DotsThreeIcon className="size-5" weight="bold" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full px-8 py-5">
          <DrawerHeader hidden>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="py-2">
            <ul className="flex flex-col gap-4 font-semibold">
              <li>
                <Link
                  to={`/setting/${id}/profile`}
                  className="hover:text-accent-foreground"
                >
                  작가 등록 및 수정
                </Link>
              </li>
              <li>
                <Link
                  to={`/setting/${id}/else`}
                  className="hover:text-accent-foreground"
                >
                  기타 설정
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
