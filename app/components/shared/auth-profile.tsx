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
      </SignedIn>
    </div>
  );
}
