import type {
  BaseCollection,
  BaseMetadata,
  BasePhoto,
  BasePhotoGrapher,
  BaseSocialLink,
} from "./base";

// types/entities.ts - 도메인별 엔티티 타입들
export type PhotoDetail = BasePhoto & {
  metadata: BaseMetadata;
  photographer: BasePhotoGrapher;
  collection: BaseCollection;
};

export type PhotoWithMetadata = BasePhoto & {
  metadata: BaseMetadata;
};

export type PhotographerWithSocial = BasePhotoGrapher & {
  social: BaseSocialLink[];
};

export type CollectionWithRelation = BaseCollection & {
  photographer: BasePhotoGrapher;
  thumbnail: BasePhoto;
  totalCount?: { count: number }[];
};
