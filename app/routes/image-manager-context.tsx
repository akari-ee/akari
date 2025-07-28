import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
  useEffect,
} from "react";
import type { CarouselApi } from "~/components/ui/carousel";
import { arrayMove } from "@dnd-kit/sortable";
import { useFieldArray } from "react-hook-form";
import { FILE_CONSTRAINTS } from "~/constant/validation-message";
import type { CollectionFormType } from "~/hooks/use-collection-form";

export interface ImageData {
  file: File;
  camera_make: string;
  camera_model: string;
  lens_model: string;
  focal_length: string;
  aperture: string;
  shutter_speed: string;
  iso: string;
  avg_color: string;
}

export interface ImageManagerState {
  previewList: string[] | null;
  currentImageIndex: number | null;
  api: CarouselApi | undefined;
}

export type ImageManagerAction =
  | { type: "SET_PREVIEW_LIST"; payload: string[] | null }
  | { type: "SET_CURRENT_IMAGE_INDEX"; payload: number | null }
  | { type: "SET_API"; payload: CarouselApi | undefined }
  | {
      type: "REORDER_PREVIEWS";
      payload: { oldIndex: number; newIndex: number };
    }
  | { type: "ADD_PREVIEWS"; payload: string[] }
  | { type: "REMOVE_PREVIEW"; payload: number }
  | { type: "CLEANUP_PREVIEWS" };

const getNextSelectedIndex = (
  prevIndex: number | null,
  oldIndex: number,
  newIndex: number
): number | null => {
  if (prevIndex === null) return null;
  if (prevIndex === oldIndex) {
    return newIndex;
  }
  if (oldIndex < prevIndex && newIndex >= prevIndex) {
    return prevIndex - 1;
  }
  if (oldIndex > prevIndex && newIndex <= prevIndex) {
    return prevIndex + 1;
  }
  return prevIndex;
};

export const imageManagerReducer = (
  state: ImageManagerState,
  action: ImageManagerAction
): ImageManagerState => {
  switch (action.type) {
    case "SET_PREVIEW_LIST":
      return {
        ...state,
        previewList: action.payload,
      };

    case "SET_CURRENT_IMAGE_INDEX":
      return {
        ...state,
        currentImageIndex: action.payload,
      };

    case "SET_API":
      return {
        ...state,
        api: action.payload,
      };

    case "REORDER_PREVIEWS": {
      const { oldIndex, newIndex } = action.payload;
      if (!state.previewList || oldIndex === newIndex) return state;

      const newPreviewList = arrayMove(state.previewList, oldIndex, newIndex);
      const newCurrentIndex = getNextSelectedIndex(
        state.currentImageIndex,
        oldIndex,
        newIndex
      );

      return {
        ...state,
        previewList: newPreviewList,
        currentImageIndex: newCurrentIndex,
      };
    }

    case "ADD_PREVIEWS": {
      const newPreviews = action.payload;
      const newPreviewList = state.previewList
        ? [...state.previewList, ...newPreviews]
        : newPreviews;

      // 첫 번째 이미지가 추가되면 자동으로 선택
      const newCurrentIndex =
        state.currentImageIndex === null && newPreviews.length > 0
          ? state.previewList?.length || 0
          : state.currentImageIndex;

      return {
        ...state,
        previewList: newPreviewList,
        currentImageIndex: newCurrentIndex,
      };
    }

    case "REMOVE_PREVIEW": {
      const indexToRemove = action.payload;
      if (!state.previewList || state.currentImageIndex === null) return state;

      const selectedImagePreview = state.previewList[indexToRemove];
      URL.revokeObjectURL(selectedImagePreview);

      const newPreviewList = state.previewList.filter(
        (_, i) => i !== indexToRemove
      );
      const remainingCount = newPreviewList.length;

      let newCurrentIndex: number | null;
      if (remainingCount === 0) {
        newCurrentIndex = null;
      } else if (indexToRemove >= remainingCount) {
        newCurrentIndex = remainingCount - 1;
      } else {
        newCurrentIndex = state.currentImageIndex;
      }

      return {
        ...state,
        previewList: newPreviewList,
        currentImageIndex: newCurrentIndex,
      };
    }

    case "CLEANUP_PREVIEWS":
      if (state.previewList) {
        state.previewList.forEach((preview) => URL.revokeObjectURL(preview));
      }
      return {
        ...state,
        previewList: null,
      };

    default:
      return state;
  }
};

interface ImageManagerContextType {
  state: ImageManagerState;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  currentImageCount: number;
  handleChangeCurrentImage: (index: number) => void;
  handleAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemove: () => void;
  handleReorder: (oldIndex: number, newIndex: number) => void;
  handleClickPreview: (image: string, index: number) => void;
  setApi: (api: any) => void;
}

const ImageManagerContext = createContext<ImageManagerContextType | null>(null);

interface ImageManagerProviderProps {
  form: CollectionFormType;
  children: React.ReactNode;
}

export const ImageManagerProvider: React.FC<ImageManagerProviderProps> = ({
  form,
  children,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [state, dispatch] = useReducer(imageManagerReducer, {
    previewList: null,
    currentImageIndex: 0,
    api: undefined,
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "images",
    shouldUnregister: true,
  });

  const handleClickPreview = useCallback(
    (image: string, index: number) => {
      if (state.api && state.previewList) {
        state.api.scrollTo(state.previewList.indexOf(image));
      }
      dispatch({ type: "SET_CURRENT_IMAGE_INDEX", payload: index });
    },
    [state.api, state.previewList]
  );

  const handleReorder = useCallback(
    (oldIndex: number, newIndex: number) => {
      if (!state.previewList || oldIndex === newIndex) return;

      // react-hook-form 필드 순서 변경
      move(oldIndex, newIndex);

      // 미리보기 리스트 순서 변경 및 선택 인덱스 갱신
      dispatch({
        type: "REORDER_PREVIEWS",
        payload: { oldIndex, newIndex },
      });
    },
    [move, state.previewList]
  );

  const handleChangeCurrentImage = useCallback((index: number) => {
    dispatch({ type: "SET_CURRENT_IMAGE_INDEX", payload: index });
  }, []);

  const handleAddImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
        } as ImageData);
      });

      dispatch({ type: "ADD_PREVIEWS", payload: newPreviewList });

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [fields.length, append]
  );

  const handleRemove = useCallback(() => {
    if (!state.previewList || state.currentImageIndex === null) return;

    remove(state.currentImageIndex);
    dispatch({ type: "REMOVE_PREVIEW", payload: state.currentImageIndex });
  }, [state.previewList, state.currentImageIndex, remove]);

  const setApi = useCallback((api: any) => {
    dispatch({ type: "SET_API", payload: api });
  }, []);

  // 컴포넌트 언마운트 시 자원 해제
  useEffect(() => {
    return () => {
      dispatch({ type: "CLEANUP_PREVIEWS" });
    };
  }, []);

  useEffect(() => {
    if (!state.api) return;

    const currentApi = state.api; // 지역 변수로 캡처
    handleChangeCurrentImage(currentApi.selectedScrollSnap());

    const handleSelect = () => {
      handleChangeCurrentImage(currentApi.selectedScrollSnap());
    };

    currentApi.on("select", handleSelect);

    return () => {
      currentApi.off("select", handleSelect);
    };
  }, [state.api, handleChangeCurrentImage]);

  useEffect(() => {
    if (state.api && typeof state.currentImageIndex === "number") {
      state.api.scrollTo(state.currentImageIndex);
    }
  }, [state.currentImageIndex, state.api]);

  const contextValue: ImageManagerContextType = {
    state,
    fileInputRef,
    currentImageCount: fields.length,
    handleChangeCurrentImage,
    handleAddImage,
    handleRemove,
    handleReorder,
    handleClickPreview,
    setApi,
  };

  return (
    <ImageManagerContext.Provider value={contextValue}>
      {children}
    </ImageManagerContext.Provider>
  );
};

export const useImageManager = () => {
  const context = useContext(ImageManagerContext);
  if (!context) {
    throw new Error(
      "useImageManager must be used within an ImageManagerProvider"
    );
  }
  return context;
};
