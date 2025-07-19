import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/react-router";
import { Button } from "../ui/button";

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
        <UserButton />
      </SignedIn>
    </div>
  );
}
