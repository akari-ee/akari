import {
  ClerkLoading,
  SignInButton,
  SignUpButton,
  useClerk,
  useUser,
} from "@clerk/react-router";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function UserButton() {
  const { isLoaded, user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navigate = useNavigate();

  if (!isLoaded)
    return (
      <ClerkLoading>
        <Skeleton className="h-8 w-8 rounded-full" />
      </ClerkLoading>
    );

  if (!user?.id)
    return (
      <aside className="hidden md:flex items-center gap-2 md:gap-4">
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
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <img
            src={user.imageUrl}
            alt={user?.primaryEmailAddress?.emailAddress!}
            width={28}
            height={28}
            className="rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 shadow-sm rounded-2xl"
        align="end"
        sideOffset={12}
      >
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span>{user?.username}</span>
          <span className="text-xs">
            {user?.primaryEmailAddress?.emailAddress}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigate(`/photographer/${user.id}`)}
          >
            프로필
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openUserProfile()}>
            계정 설정
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/collection/new`)}>
            컬렉션 생성
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOut()}
            className="text-red-500 focus:text-red-600"
          >
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
