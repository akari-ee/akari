import { useEffect, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { FILE_CONSTRAINTS } from "~/constant/validation-message";
import type { CollectionFormType } from "./use-collection-form";

export const useImageManager = (form: CollectionFormType) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewList, setPreviewList] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
    shouldUnregister: true,
  });

  const handleChangeCurrentImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const selectedFiles = Array.from(files).slice(
      0,
      FILE_CONSTRAINTS.IMAGE.MAX_COUNT - fields.length
    );

    const newPreviewList = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    selectedFiles.forEach((file) => {
      append({
        file,
        camera_make: "",
        camera_model: "",
        lens_model: "",
        focal_length: "",
        aperture: "",
        shutter_speed: "",
        iso: "",
        avg_color: "",
      });
    });

    setPreviewList((prev) =>
      prev ? [...prev, ...newPreviewList] : newPreviewList
    );

    // 첫 번째 이미지가 추가되면 자동으로 선택
    if (currentImageIndex === null && selectedFiles.length > 0) {
      setCurrentImageIndex(fields.length);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = () => {
    if (!previewList || currentImageIndex === null) return;

    const selectedImagePreview = previewList[currentImageIndex];
    URL.revokeObjectURL(selectedImagePreview);

    remove(currentImageIndex);

    const newPreviewList = previewList.filter(
      (_, i) => i !== currentImageIndex
    );
    setPreviewList(newPreviewList);

    // 삭제 후 남은 개수
    const remainingCount = newPreviewList.length;

    if (remainingCount === 0) {
      setCurrentImageIndex(null);
    } else if (currentImageIndex >= remainingCount) {
      // 삭제된 인덱스가 마지막이었다면 새 마지막 인덱스로
      setCurrentImageIndex(remainingCount - 1);
    } else {
      // 그대로 유지
      setCurrentImageIndex(currentImageIndex);
    }
  };

  // 컴포넌트 언마운트 시 자원 해제
  useEffect(() => {
    return () => {
      if (!previewList) return;
      previewList.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  return {
    fileInputRef,
    previewList,
    currentImageIndex,
    handleChangeCurrentImage,
    handleAddImage,
    handleRemove,
    currentImageCount: fields.length,
  };
};
