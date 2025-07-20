// socialFields.ts

import {
  IconBehance,
  IconInstagram,
  IconYoutube,
  IconX,
  IconWeb,
} from "~/components/icons/icon-social";

export const SOCIAL_FIELDS = [
  {
    value: "behance",
    label: "Behance",
    placeholder: "Behance URL",
    icon: IconBehance,
  },
  {
    value: "instagram",
    label: "Instagram",
    placeholder: "Instagram URL",
    icon: IconInstagram,
  },
  {
    value: "youtube",
    label: "YouTube",
    placeholder: "YouTube URL",
    icon: IconYoutube,
  },
  {
    value: "x",
    label: "X",
    placeholder: "X URL",
    icon: IconX,
  },
  {
    value: "website",
    label: "Website",
    placeholder: "Website URL",
    icon: IconWeb,
  },
] as const;

export type SocialField = (typeof SOCIAL_FIELDS)[number];
export type SocialFieldValue = SocialField["value"];
