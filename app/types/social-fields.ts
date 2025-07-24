// socialFields.ts

import {
  BehanceLogoIcon,
  InstagramLogoIcon,
  SparkleIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react";

export const SOCIAL_FIELDS = [
  {
    value: "behance",
    label: "Behance",
    placeholder: "Behance URL",
    icon: BehanceLogoIcon,
  },
  {
    value: "instagram",
    label: "Instagram",
    placeholder: "Instagram URL",
    icon: InstagramLogoIcon,
  },
  {
    value: "youtube",
    label: "YouTube",
    placeholder: "YouTube URL",
    icon: YoutubeLogoIcon,
  },
  {
    value: "x",
    label: "X",
    placeholder: "X URL",
    icon: XLogoIcon,
  },
  {
    value: "website",
    label: "Website",
    placeholder: "Website URL",
    icon: SparkleIcon,
  },
] as const;

export const SOCIAL_ICON_MAP = {
  behance: { label: "Behance", icon: BehanceLogoIcon },
  instagram: { label: "Instagram", icon: InstagramLogoIcon },
  youtube: { label: "YouTube", icon: YoutubeLogoIcon },
  x: { label: "X", icon: XLogoIcon },
  website: { label: "Web", icon: SparkleIcon },
} as const;

export type SocialField = (typeof SOCIAL_FIELDS)[number];
export type SocialFieldValue = SocialField["value"];
