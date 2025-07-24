import { NavLink } from "react-router";
import { ROUTE_LINK } from "~/constant/route";
import { cn } from "~/lib/utils";

export default function MobileMenu() {
  return (
    <nav
      className={cn(
        `sticky top-0 z-50 w-full flex justify-center bg-linear-to-b
        from-background to-transparent p-4 md:hidden`
      )}
    >
      <menu
        className="flex items-center gap-1 rounded-xl border border-muted
          bg-background/75 p-1 backdrop-blur-xl w-full justify-evenly"
      >
        {ROUTE_LINK.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            prefetch="intent"
            className={({ isActive }) =>
              cn(
                `flex gap-1 rounded-lg border px-3 py-1 transition-colors
                 active:inset-shadow-xs text-sm sm:text-sm max-sm:px-2 w-full justify-center`,
                `hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200`,
                isActive
                  ? "border-neutral-300 bg-neutral-100 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  : "border-muted bg-white text-muted-foreground hover:border-neutral-300 hover:bg-neutral-50 dark:border-muted dark:bg-neutral-900 dark:text-muted-foreground dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="size-5 sm:size-5" weight="duotone" />
                <span className={!isActive ? "max-sm:sr-only" : ""}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </menu>
    </nav>
  );
}
