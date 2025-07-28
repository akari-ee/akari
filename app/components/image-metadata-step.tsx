import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { CollectionFormType } from "~/hooks/use-collection-form";
import { useImageManager } from "~/routes/image-manager-context";

export default function ImageMetadataStep({
  form,
}: {
  form: CollectionFormType;
}) {
  const {
    currentImageCount,
    state: { currentImageIndex },
  } = useImageManager();

  return (
    <section>
      {currentImageCount > 0 && currentImageIndex !== null && (
        <section className="space-y-4" key={currentImageIndex}>
          <div className="flex items-center gap-4">
            <FormLabel>메타데이터</FormLabel>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`images.${currentImageIndex}.camera_make`}
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
              name={`images.${currentImageIndex}.camera_model`}
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
              name={`images.${currentImageIndex}.lens_model`}
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
              name={`images.${currentImageIndex}.focal_length`}
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
              name={`images.${currentImageIndex}.aperture`}
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
              name={`images.${currentImageIndex}.shutter_speed`}
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
              name={`images.${currentImageIndex}.iso`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="ISO" {...field} className="text-xs" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>
      )}
    </section>
  );
}
