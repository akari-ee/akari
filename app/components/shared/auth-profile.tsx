import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/react-router";
import { Button } from "../ui/button";
import { BoxesIcon, CameraIcon, ImagesIcon } from "lucide-react";
import SettingPage from "../profile-page/setting-page";
import CreatorRegisterPage from "../profile-page/creator-register-page";
import CollectionPage from "../profile-page/collection-page";
import AuthAccessMenu from "./auth-access-menu";

export default function AuthProfile() {
  return (
    <div className="flex items-center gap-1">
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
            <UserButton.UserProfilePage
              label="작가 등록"
              labelIcon={<CameraIcon size={14} />}
              url="creator"
            >
              <CreatorRegisterPage />
            </UserButton.UserProfilePage>
            <UserButton.UserProfilePage
              label="사진⋅컬렉션 관리"
              labelIcon={<ImagesIcon size={14} />}
              url="collection"
            >
              <CollectionPage />
            </UserButton.UserProfilePage>
            <UserButton.UserProfilePage
              label="기타 설정"
              labelIcon={<BoxesIcon size={14} />}
              url="other-settings"
            >
              <SettingPage />
            </UserButton.UserProfilePage>
          </UserButton>
          <AuthAccessMenu />
        </aside>
      </SignedIn>
    </div>
  );
}
