// useAuthorForm.ts
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SOCIAL_FIELDS } from "~/types/social-fields";

// 1. Zod 스키마 정의
export const creatorSchema = z.object({
  name: z.string().min(1, { message: "작가명을 입력하세요." }),
  bio: z.string().min(1, { message: "작가소개를 입력하세요." }),
  socials: z.object(
    Object.fromEntries(
      SOCIAL_FIELDS.map(({ value, label }) => [
        value,
        z
          .url({ message: `유효한 ${label} URL을 입력하세요.` })
          .optional()
          .nullable(),
      ])
    )
  ),
});

export type CreatorFormValues = z.infer<typeof creatorSchema>;

type UseCreatorFormProps = {
  onMutate: (values: CreatorFormValues) => Promise<any>;
  defaultValues?: Partial<CreatorFormValues>;
};

// 2. 커스텀 훅
export function useCreatorForm({
  onMutate,
  defaultValues,
}: UseCreatorFormProps) {
  //   const { mutateAsync, isSuccess, isPending, isError } = useSubmitCreator();

  const form = useForm<CreatorFormValues>({
    resolver: zodResolver(creatorSchema),
    defaultValues: {
      name: "",
      bio: "",
      socials: {
        behance: null,
        instagram: null,
        youtube: null,
        x: null,
        website: null,
        ...defaultValues?.socials,
      },
      ...defaultValues,
    },
    mode: "onChange",
  });

  // 예시 onSubmit 핸들러
  const onSubmit = async (values: CreatorFormValues) => {
    // 등록 처리
    await onMutate({
      name: values.name,
      bio: values.bio,
      socials: values.socials,
    });
  };

  return { form, onSubmit };
}
