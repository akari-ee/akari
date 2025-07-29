import {
  CameraIcon,
  FilmStripIcon,
  UserFocusIcon,
  type Icon,
} from "@phosphor-icons/react";

type RouteLink = {
  path: string;
  label: string;
  icon: Icon;
};

export const ROUTE_LINK = [
  { path: "/", label: "사진", icon: CameraIcon },
  { path: "/collection", label: "컬렉션", icon: FilmStripIcon },
  {
    path: "/photographer/user_308N1jYYIs8yjFF0PFQHy1neJb5",
    label: "작가",
    icon: UserFocusIcon,
  },
  {
    path: "/sign-in",
    label: "로그인",
    icon: UserFocusIcon,
  },
  {
    path: "/sign-up",
    label: "회원가입",
    icon: UserFocusIcon,
  },
] as const satisfies RouteLink[];
