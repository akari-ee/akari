import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { FILE_CONSTRAINTS } from "~/constant/validation-message";
import DragDropRoll from "~/components/drag-drop-roll";
import MobileCarousel from "~/components/mobile-carousel";
import type { CollectionFormType } from "~/hooks/use-collection-form";
import { useImageManager } from "~/routes/image-manager-context";

export default function ImageUploadStep({
  form,
}: {
  form: CollectionFormType;
}) {
  const {
    fileInputRef,
    handleAddImage,
    handleRemove,
    handleReorder,
    handleClickPreview,
    setApi,
    currentImageCount,
    state: { previewList, currentImageIndex },
  } = useImageManager();

  return (
    <section>
      <FormField
        control={form.control}
        name="images"
        render={() => {
          return (
            <FormItem hidden>
              <FormLabel>
                이미지 업로드 (최대 {FILE_CONSTRAINTS.IMAGE.MAX_COUNT}개)
              </FormLabel>
              <FormControl>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp,image/heic,image/heif,image/avif"
                  multiple
                  onChange={handleAddImage}
                  disabled={
                    currentImageCount >= FILE_CONSTRAINTS.IMAGE.MAX_COUNT
                  }
                />
              </FormControl>
              <FormDescription>
                JPEG, PNG, JPG, WebP 형식만 지원. 최대{" "}
                {FILE_CONSTRAINTS.IMAGE.MAX_COUNT}개
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <DragDropRoll
        onClick={() => fileInputRef.current?.click()}
        onChange={handleAddImage}
        currentImageCount={currentImageCount}
        maxImageCount={FILE_CONSTRAINTS.IMAGE.MAX_COUNT}
      />

      {previewList && currentImageIndex !== null && (
        <MobileCarousel
          images={previewList}
          height="600px"
          maxImageCount={FILE_CONSTRAINTS.IMAGE.MAX_COUNT}
          currentIndex={currentImageIndex}
          currentImageCount={currentImageCount}
          onRemove={handleRemove}
          onReorder={handleReorder}
          onClickFileRef={() => fileInputRef.current?.click()}
          onClickPreview={handleClickPreview}
          onSetApi={setApi}
        />
      )}
    </section>
  );
}
