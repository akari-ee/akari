import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { useCollectionForm } from "~/hooks/use-collection-form";
import { ImageManagerProvider } from "./image-manager-context";
import ImageUploadStep from "~/components/image-upload-step";
import ImageMetadataStep from "~/components/image-metadata-step";

export default function CollectionNewRoute() {
  const { form, onSubmit } = useCollectionForm();

  return (
    <ImageManagerProvider form={form}>
      <main className="flex flex-col flex-grow max-w-5xl container mx-auto py-8 px-4 h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <ImageUploadStep form={form} />
            <ImageMetadataStep form={form} />

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
    </ImageManagerProvider>
  );
}
