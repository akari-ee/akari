import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod/v4";

import {
  COLLECTION_VALIDATION_MESSAGES,
  FILE_CONSTRAINTS,
} from "~/constant/validation-message";
import type { COMMON_VALIDATION_MESSAGES } from "~/constant/validation-message";

export const collectionSchema = z.object({
  title: z
    .string({ message: COLLECTION_VALIDATION_MESSAGES.TITLE.REQUIRED })
    .trim()
    .min(1, { message: COLLECTION_VALIDATION_MESSAGES.TITLE.REQUIRED }),

  description: z
    .string({ message: COLLECTION_VALIDATION_MESSAGES.DESCRIPTION.REQUIRED })
    .trim()
    .min(1, { message: COLLECTION_VALIDATION_MESSAGES.DESCRIPTION.REQUIRED }),

  content: z
    .string({ message: COLLECTION_VALIDATION_MESSAGES.CONTENT.REQUIRED })
    .trim()
    .min(1, { message: COLLECTION_VALIDATION_MESSAGES.CONTENT.REQUIRED }),

  thumbnailId: z.number({
    message: COLLECTION_VALIDATION_MESSAGES.THUMBNAIL.REQUIRED,
  }),
  images: z
    .array(
      z.object({
        file: z
          .file()
          .max(FILE_CONSTRAINTS.IMAGE.MAX_SIZE)
          .mime(FILE_CONSTRAINTS.IMAGE.ALLOWED_TYPES, {
            message: COLLECTION_VALIDATION_MESSAGES.IMAGES.INVALID_FORMAT,
          }),
        camera_make: z.string().optional(),
        camera_model: z.string().optional(),
        lens_model: z.string().optional(),
        focal_length: z.string().optional(),
        aperture: z.string().optional(),
        shutter_speed: z.string().optional(),
        iso: z.string().optional(),
        avg_color: z.string().optional(),
      })
    )
    .min(FILE_CONSTRAINTS.IMAGE.MIN_COUNT, {
      message: COLLECTION_VALIDATION_MESSAGES.IMAGES.MIN_REQUIRED,
    })
    .max(FILE_CONSTRAINTS.IMAGE.MAX_COUNT, {
      message: COLLECTION_VALIDATION_MESSAGES.IMAGES.MAX_EXCEEDED,
    }),
});

// 타입 안전성을 위한 타입 정의
export type CollectionValidationMessageKeys =
  keyof typeof COLLECTION_VALIDATION_MESSAGES;
export type CommonValidationMessageKeys =
  keyof typeof COMMON_VALIDATION_MESSAGES;
export type CollectionFormValues = z.infer<typeof collectionSchema>;
export type CollectionFormType = UseFormReturn<CollectionFormValues>;

export function useCollectionForm() {
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      thumbnailId: 0,
      images: [],
    },
    mode: "onChange",
  });

  const onUpload = async (file: File | Blob) => {
    const formData = new FormData();
    formData.append("file", file, (file as File).name);

    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_UPLOAD_TOKEN}`,
      },
    });

    if (!res.ok) {
      console.log(res);
      throw new Error("Upload Failed!");
    }

    const json = await res.json();
    console.log("Uploaded:", json);
  };

  const onSubmit = async (values: CollectionFormValues) => {
    console.log(values);
  };

  return {
    form,
    onSubmit,
  };
}
