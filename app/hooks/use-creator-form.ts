import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { SOCIAL_FIELDS } from "~/types/social-fields";

export const creatorSchema = z.object({
  name: z.string().min(1, { message: "작가명을 입력하세요." }),
  introduction: z.string().min(1, { message: "작가소개를 입력하세요." }),
  social: z.object(
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

export function useCreatorForm({
  onMutate,
  defaultValues,
}: UseCreatorFormProps) {
  const form = useForm<CreatorFormValues>({
    resolver: zodResolver(creatorSchema),
    defaultValues: {
      name: "",
      introduction: "",
      social: {
        behance: null,
        instagram: null,
        youtube: null,
        x: null,
        website: null,
      },
      ...defaultValues,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: CreatorFormValues) => {
    // 등록 처리
    await onMutate({
      name: values.name,
      introduction: values.introduction,
      social: values.social,
    });
  };

  return { form, onSubmit };
}
