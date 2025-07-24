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
import { useToggleCreator } from "~/hooks/use-toggle-creator";
import { CToast } from "../shared/custom-toast";

export default function CreatorRegisterPage() {
  const { mutateAsync, isPending } = useSubmitCreator();
  const { form, onSubmit } = useCreatorForm({ onMutate: mutateAsync });
  const { isCreator, loading, handleToggle } = useToggleCreator({
    toastComponent: (props) => <CToast {...props} />,
    onActivateMsg: "작가 활성화",
    onDeactivateMsg: "작가 비활성화",
    onErrorMsg: "상태 변경 실패",
  });

  return (
    <main className="flex flex-col gap-6">
      <header className="border-b">
        <h1 className="font-black text-2xl mb-4">작가 등록</h1>
      </header>
      <section className="flex-grow flex items-center justify-center">
        {!isCreator ? (
          <div className="w-full flex flex-col items-center justify-center py-16">
            <span className="text-sm font-semibold text-center text-muted-foreground">
              작가로 전환하면 사진을 업로드하고 수익을 얻을 수 있어요.
            </span>
            <ActivateCreatorButton
              className="mt-4"
              isCreator={isCreator}
              onToggle={handleToggle}
              loading={loading}
            />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
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
                name="bio"
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
                  {SOCIAL_FIELDS.map(
                    ({ value, label, placeholder, icon: Icon }) => (
                      <FormField
                        key={value}
                        control={form.control}
                        name={`socials.${value}`}
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
                    )
                  )}
                </div>
              </aside>
              <div className="flex justify-between items-center sticky bottom-0 bg-background/50 backdrop-blur-md rounded-full">
                <ActivateCreatorButton
                  className="text-destructive hover:text-destructive"
                  isCreator={isCreator}
                  onToggle={handleToggle}
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
        )}
      </section>
    </main>
  );
}

function ActivateCreatorButton({
  className = "",
  isCreator,
  onToggle,
  loading,
}: {
  className?: string;
  isCreator: boolean;
  onToggle: () => void | Promise<void>;
  loading?: boolean;
}) {
  return (
    <Button
      type="button"
      variant={isCreator ? "ghost" : "secondary"}
      size="sm"
      className={className}
      onClick={onToggle}
      disabled={loading}
    >
      {loading ? (
        <LoaderIcon className="w-4 h-4 animate-spin" />
      ) : isCreator ? (
        "비활성화"
      ) : (
        "활성화"
      )}
    </Button>
  );
}
