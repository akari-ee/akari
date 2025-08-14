import ThemeSwitcher from "~/components/shared/theme-switcher";

export default function PhotographerSettingElseRoute() {
  return (
    <main className="flex flex-col gap-6">
      <header>
        <h1 className="font-black text-2xl mb-4">기타 설정</h1>
      </header>
      <section className="w-full flex flex-col gap-6">
        <div className="flex flex-row items-center gap-4">
          <p className="text-sm font-medium basis-1/5">테마</p>
          <div className="">
            <ThemeSwitcher />
          </div>
        </div>
        <aside className="text-xs text-destructive">
          현재 다크 모드는 베타 상태이며, 일부 기능이 제대로 작동하지 않을 수
          있습니다.
        </aside>
      </section>
    </main>
  );
}
