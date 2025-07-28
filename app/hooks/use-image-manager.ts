import { useCallback, useEffect, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { FILE_CONSTRAINTS } from "~/constant/validation-message";
import type { CollectionFormType } from "./use-collection-form";
import { arrayMove } from "@dnd-kit/sortable";
import type { CarouselApi } from "~/components/ui/carousel";

export const useImageManager = (form: CollectionFormType) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewList, setPreviewList] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const [api, setApi] = useState<CarouselApi>();

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "images",
    shouldUnregister: true,
  });

  const getNextSelectedIndex = (
    prevIndex: number | null,
    oldIndex: number,
    newIndex: number
  ): number | null => {
    if (prevIndex === null) return null;
    if (prevIndex === oldIndex) {
      // 선택된 아이템이 이동했다면, 새 위치로
      return newIndex;
    }
    if (oldIndex < prevIndex && newIndex >= prevIndex) {
      // 선택된 인덱스가 이동한 아이템 뒤에 있고, 앞으로 당겨졌다면 -1
      return prevIndex - 1;
    }
    if (oldIndex > prevIndex && newIndex <= prevIndex) {
      // 선택된 인덱스가 이동한 아이템 앞에 있고, 뒤로 밀렸다면 +1
      return prevIndex + 1;
    }
    // 그 외에는 변화 없음
    return prevIndex;
  };

  const handleClickPreview = (image: string, index: number) => {
    if (api && previewList) {
      api.scrollTo(previewList.indexOf(image));
    }
    handleChangeCurrentImage(index);
  };

  const handleReorder = useCallback(
    (oldIndex: number, newIndex: number) => {
      if (!previewList || oldIndex === newIndex) return;

      // react-hook-form 필드 순서 변경
      move(oldIndex, newIndex);

      // 미리보기 리스트 순서 변경
      setPreviewList((prev) =>
        prev ? arrayMove(prev, oldIndex, newIndex) : prev
      );

      // 선택 인덱스 갱신
      setCurrentImageIndex((prev) =>
        getNextSelectedIndex(prev, oldIndex, newIndex)
      );
    },
    [move, setPreviewList, setCurrentImageIndex, previewList]
  );

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

  useEffect(() => {
    if (!api) return;
    handleChangeCurrentImage(api.selectedScrollSnap());
    api.on("select", () => {
      handleChangeCurrentImage(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (api && typeof currentImageIndex === "number") {
      api.scrollTo(currentImageIndex);
    }
  }, [currentImageIndex, api]);

  return {
    fileInputRef,
    previewList,
    currentImageIndex,
    handleChangeCurrentImage,
    handleAddImage,
    handleRemove,
    handleReorder,
    handleClickPreview,
    setApi,
    currentImageCount: fields.length,
  };
};
