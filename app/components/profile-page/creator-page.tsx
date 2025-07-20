import { useUser } from "@clerk/react-router";
import { Button } from "../ui/button";
import { useCreatorForm } from "~/hooks/use-creator-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { SOCIAL_FIELDS } from "~/types/social-fields";
import { useSubmitCreator } from "~/hooks/use-submit-creator";
import { LoaderIcon } from "lucide-react";

export default function CreatorPage() {
  const { user } = useUser();
  const { mutateAsync, isPending } = useSubmitCreator();
  const { form, onSubmit } = useCreatorForm({ onMutate: mutateAsync });
  const isCreator = user?.unsafeMetadata.isCreator;

  return (
    <main className="flex flex-col gap-8">
      <header className="border-b">
        <h1 className="font-black text-2xl mb-4">작가 등록</h1>
      </header>
      <section className="flex-grow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>소개</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="작가소개를 입력하세요"
                      {...field}
                      className="[resize:none] h-40"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <aside className="flex flex-col gap-2">
              <FormLabel>소셜</FormLabel>
              <div className="space-y-2">
                {SOCIAL_FIELDS.map(
                  ({ value, label, placeholder, icon: Icon }) => (
                    <FormField
                      key={value}
                      control={form.control}
                      name={`socials.${value}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center">
                          <FormLabel>
                            <span className="flex items-center gap-2 hover:bg-accent p-2 rounded-lg transition-colors cursor-pointer">
                              <Icon className="w-5 h-5" />
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={placeholder}
                              {...field}
                              value={field.value ?? ""}
                              autoComplete="off"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </aside>
            <div className="text-right">
              <Button type="submit" disabled={isPending}>
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
      </section>
    </main>
  );
}
