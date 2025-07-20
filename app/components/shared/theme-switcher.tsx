import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) return null; // 클라이언트에서만 렌더링

  return (
    <div>
      <div className="relative flex items-center gap-2">
        <Switch
          id="theme-switcher"
          checked={theme === "light"}
          onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
        />
        <Label
          htmlFor="theme-switcher"
          className="text-xs text-muted-foreground"
        >
          {theme === "light" ? "라이트" : "다크"} 모드 적용 중
        </Label>
      </div>
    </div>
  );
}
