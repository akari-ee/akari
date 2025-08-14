import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  useCreatorForm,
  type CreatorFormValues,
} from "~/hooks/use-creator-form";
import { useSubmitCreator } from "~/hooks/use-submit-creator";
import { SOCIAL_FIELDS } from "~/types/social-fields";
import ActivateCreatorButton from "./activate-creator-button";
import { LoaderIcon } from "lucide-react";

interface CreatorProfileSettingProps {
  defaultValue: CreatorFormValues;
  isCreator: boolean;
  loading: boolean;
  onToggle: () => void;
}

export default function CreatorProfileSetting({
  defaultValue,
  isCreator,
  loading,
  onToggle,
}: CreatorProfileSettingProps) {
  const { mutateAsync, isPending } = useSubmitCreator();
  const { form, onSubmit } = useCreatorForm({
    onMutate: mutateAsync,
    defaultValues: defaultValue,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full h-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>작가명</FormLabel>
              <FormControl>
                <Input
                  placeholder="작가명을 입력하세요"
                  {...field}
                  autoComplete="off"
                  className="shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>소개</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="작가소개를 입력하세요"
                  {...field}
                  className="[resize:none] h-32 shadow-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <aside className="flex flex-col gap-2">
          <FormLabel>소셜</FormLabel>
          <div className="flex flex-col gap-2">
            {SOCIAL_FIELDS.map(({ value, label, placeholder, icon: Icon }) => (
              <FormField
                key={value}
                control={form.control}
                name={`social.${value}`}
                render={({ field }) => (
                  <FormItem className="*:not-first:mt-2">
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder={placeholder}
                          {...field}
                          value={field.value ?? ""}
                          autoComplete="off"
                          className="shadow-none peer ps-10"
                        />
                        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 pe-1.5 peer-disabled:opacity-50">
                          <Icon
                            className="w-5 h-5"
                            aria-hidden
                            weight="duotone"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </aside>
        <div className="flex justify-between items-center">
          <ActivateCreatorButton
            className="text-destructive hover:text-destructive"
            isCreator={isCreator}
            onToggle={onToggle}
            loading={loading}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="rounded-full"
            size={"lg"}
          >
            {isPending ? (
              <LoaderIcon className="w-5 h-5 animate-spin" />
            ) : isCreator ? (
              "수정"
            ) : (
              "등록"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
