import type { MimeTypes } from "node_modules/zod/v4/core/util.cjs";

/**
 * 컬렉션 관련 검증 메시지
 */
export const COLLECTION_VALIDATION_MESSAGES = {
  TITLE: {
    REQUIRED: "제목을 입력하세요.",
  },
  DESCRIPTION: {
    REQUIRED: "설명을 입력하세요.",
  },
  CONTENT: {
    REQUIRED: "내용을 입력하세요.",
  },
  THUMBNAIL: {
    REQUIRED: "썸네일을 선택하세요.",
  },
  IMAGES: {
    MIN_REQUIRED: "최소 하나의 이미지를 업로드하세요.",
    MAX_EXCEEDED: "최대 7개의 이미지만 업로드할 수 있습니다.",
    INVALID_FORMAT: "지원되는 이미지 형식: JPEG, PNG, JPG, WebP",
  },
} as const;

/**
 * 공통 검증 메시지 (다른 스키마에서도 재사용 가능)
 */
export const COMMON_VALIDATION_MESSAGES = {
  REQUIRED: "필수 입력 항목입니다.",
  INVALID_FORMAT: "올바른 형식이 아닙니다.",
  FILE: {
    SIZE_EXCEEDED: "파일 크기가 너무 큽니다.",
    INVALID_TYPE: "지원되지 않는 파일 형식입니다.",
  },
} as const;

/**
 * 파일 업로드 관련 상수
 */
export const FILE_CONSTRAINTS = {
  IMAGE: {
    MAX_SIZE: 1024 * 1024 * 3, // 3MB
    ALLOWED_TYPES: [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ] as MimeTypes[],
    MAX_COUNT: 7,
    MIN_COUNT: 1,
  },
} as const;
