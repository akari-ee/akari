import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { useCollectionForm } from "~/hooks/use-collection-form";
import { ImageManagerProvider } from "./image-manager-context";
import ImageUploadStep from "~/components/image-upload-step";
import ImageMetadataStep from "~/components/image-metadata-step";
import CollectionInfoStep from "~/components/collection-info-step";

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
            <CollectionInfoStep form={form} />
            <Button type="submit">제출</Button>
          </form>
        </Form>
      </main>
    </ImageManagerProvider>
  );
}
