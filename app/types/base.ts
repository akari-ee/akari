import type { Database } from "./types_db";

// types/base.ts - 기본 엔티티 타입들
export type BasePhoto = Database["public"]["Tables"]["photos"]["Row"];
export type BasePhotoGrapher = Database["public"]["Tables"]["photographers"]["Row"];
export type BaseCollection = Database["public"]["Tables"]["collections"]["Row"];
export type BaseSocialLink = Database["public"]["Tables"]["photographer_social_links"]["Row"];
export type BaseMetadata = Database["public"]["Tables"]["photo_metadata"]["Row"];
