import { useUser } from "@clerk/react-router";
import { useMutation } from "@tanstack/react-query";
import { createBrowserClient } from "~/lib/supabase-client";
import type { CreatorFormValues } from "./use-creator-form";
import { SOCIAL_FIELDS } from "~/types/social-fields";

type PlatformEnum = (typeof SOCIAL_FIELDS)[number]["value"];

type SocialLinksInput = CreatorFormValues["socials"];
type SocialLinkRow = {
  photographer_id: string | null;
  platform: PlatformEnum;
  url: string;
};

// socials 객체를 DB insert용 배열로 변환하는 함수
function toSocialLinks(
  socials: SocialLinksInput,
  photographerId: string | null
): SocialLinkRow[] {
  return SOCIAL_FIELDS.map(({ value }) => {
    const url = socials[value];
    if (typeof url === "string" && url.trim() !== "") {
      return {
        photographer_id: photographerId,
        platform: value,
        url,
      };
    }
    return null;
  }).filter((link): link is SocialLinkRow => !!link);
}

export const useSubmitCreator = () => {
  const supabase = createBrowserClient();
  const { user } = useUser();

  const mutation = useMutation({
    mutationKey: ["submit-creator"],
    mutationFn: async ({ name, bio, socials }: CreatorFormValues) => {
      if (!user) throw new Error("로그인 정보가 없습니다.");

      // Clerk에 사진 작가로 등록
      if (!user.unsafeMetadata.isCreator) {
        await user.update({
          unsafeMetadata: { isCreator: true },
        });
      }

      // Supabase에 작가 데이터 등록
      const { error: photographerError } = await supabase
        .from("photographers")
        .upsert({
          id: user.id,
          name,
          introduction: bio,
          url: user.imageUrl,
        })
        .select();

      if (photographerError) throw photographerError;

      // socials → socialLinks 변환
      const socialLinks = toSocialLinks(socials, user.id);

      // Supabase에 소셜 플랫폼 데이터 등록
      if (socialLinks.length > 0) {
        const { error: socialError } = await supabase
          .from("photographer_social_links")
          .insert(socialLinks)
          .select();

        if (socialError)
          throw new Error("소셜 링크 등록 실패: " + socialError.message);
      }
    },
    throwOnError: false,
  });

  return mutation;
};
