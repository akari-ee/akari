import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useCollectionForm } from "~/hooks/use-collection-form";
import { FILE_CONSTRAINTS } from "~/constant/validation-message";
import PcCarousel from "~/components/pc-carousel";
import DragDropRoll from "~/components/drag-drop-roll";
import { useImageManager } from "~/hooks/use-image-manager";

export default function CollectionNewRoute() {
  const { form, onSubmit } = useCollectionForm();
  const {
    fileInputRef,
    previewList,
    currentImageIndex,
    handleChangeCurrentImage,
    handleAddImage,
    handleRemove,
    currentImageCount,
  } = useImageManager(form);

  return (
    <main className="flex flex-col flex-grow max-w-5xl container mx-auto py-8 px-4 h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* 이미지 업로드 */}
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
            <PcCarousel
              images={previewList}
              height="600px"
              maxImageCount={FILE_CONSTRAINTS.IMAGE.MAX_COUNT}
              currentIndex={currentImageIndex}
              onRemove={handleRemove}
              onSelect={handleChangeCurrentImage}
            />
          )}

          {/* 메타데이터 - 이미지가 있을 때만 표시 */}
          {/* {fields.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <FormLabel>메타데이터</FormLabel>
              </div>
              {index !== null && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`images.${index}.camera_make`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="카메라 제조사"
                            {...field}
                            className="text-xs shadow-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`images.${index}.camera_model`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="카메라 모델"
                            {...field}
                            className="text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`images.${index}.lens_model`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="렌즈 모델"
                            {...field}
                            className="text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`images.${index}.focal_length`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="초점거리"
                            {...field}
                            className="text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`images.${index}.aperture`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="조리개"
                            {...field}
                            className="text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`images.${index}.shutter_speed`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="셔터스피드"
                            {...field}
                            className="text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`images.${index}.iso`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="ISO"
                            {...field}
                            className="text-xs"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </section>
          )} */}

          {/* 제목 */}
          {/* <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="hide-error-style">제목</FormLabel>
                <FormControl>
                  <Input
                    placeholder="제목을 입력하세요"
                    {...field}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* 설명 */}
          {/* <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>설명</FormLabel>
                <FormControl>
                  <Textarea placeholder="설명을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* 내용 */}
          {/* <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>내용</FormLabel>
                <FormControl>
                  <Textarea placeholder="내용을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <Button type="submit">제출</Button>
        </form>
      </Form>
    </main>
  );
}
