import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/react-router";
import { Button } from "../ui/button";
import { CameraIcon } from "lucide-react";
import AuthAccessMenu from "./auth-access-menu";
import { Skeleton } from "../ui/skeleton";

export default function AuthProfile() {
  return (
    <div className="flex items-center gap-1">
      <ClerkLoading>
        <Skeleton className="h-8 w-8 rounded-full" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedOut>
          <aside className="flex items-center gap-2 md:gap-4">
            <SignInButton>
              <Button
                size={"sm"}
                variant={"ghost"}
                className="rounded-full px-4 py-5"
              >
                로그인
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button
                size={"sm"}
                variant={"default"}
                className="rounded-full py-5 px-4"
              >
                회원가입
              </Button>
            </SignUpButton>
          </aside>
        </SignedOut>
        <SignedIn>
          <aside className="flex items-center gap-4">
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="작가 등록"
                  labelIcon={<CameraIcon size={14} />}
                  open="creator"
                />
              </UserButton.MenuItems>
            </UserButton>
            <AuthAccessMenu />
          </aside>
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
}
