import ThemeSwitcher from "../shared/theme-switcher";

export default function SettingPage() {
  return (
    <main>
      <header className="border-b">
        <h1 className="font-black text-2xl mb-4">기타 설정</h1>
      </header>
      <section className="w-full flex flex-col">
        <div className="flex flex-row items-center py-[14px] gap-4 h-20">
          <p className="text-[#212126] text-sm font-medium basis-1/5">테마</p>
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
