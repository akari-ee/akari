import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/react-router";
import { Button } from "../ui/button";
import { BoxesIcon, CameraIcon } from "lucide-react";
import ThemeSwitcher from "./theme-switcher";

export default function AuthProfile() {
  return (
    <div className="flex items-center gap-1">
      <SignedOut>
        <SignInButton>
          <Button size={"sm"} variant={"ghost"}>
            로그인
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button size={"sm"} variant={"ghost"}>
            회원가입
          </Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Action
              label="작가 등록"
              labelIcon={<CameraIcon size={14} />}
              open="photographer_submit"
            />
          </UserButton.MenuItems>
          <UserButton.UserProfilePage
            label="작가 등록"
            labelIcon={<CameraIcon size={14} />}
            url="photographer_submit"
          >
            <div>
              <header className="border-b">
                <h1 className="font-black text-2xl mb-4">작가 등록</h1>
              </header>
              <section></section>
            </div>
          </UserButton.UserProfilePage>
          <UserButton.UserProfilePage
            label="기타 설정"
            labelIcon={<BoxesIcon size={14} />}
            url="other-settings"
          >
            <div>
              <header className="border-b">
                <h1 className="font-black text-2xl mb-4">기타 설정</h1>
              </header>
              <section className="w-full flex flex-col">
                <div className="flex flex-row items-center py-[14px] gap-4 h-20">
                  <p className="text-[#212126] text-sm font-medium basis-1/5">
                    테마
                  </p>
                  <div className="">
                    <ThemeSwitcher />
                  </div>
                </div>
                <aside className="text-xs text-destructive">
                  현재 다크 모드는 베타 상태이며, 일부 기능이 제대로 작동하지
                  않을 수 있습니다.
                </aside>
              </section>
            </div>
          </UserButton.UserProfilePage>
        </UserButton>
      </SignedIn>
    </div>
  );
}
