import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";

import { ChevronDownIcon } from "lucide-react";
import { useLocation } from "react-router";
import SearchBar from "./search-bar";
import { cn } from "~/lib/utils";
import AuthProfile from "./auth-profile";
import ThemeSwitcher from "./theme-switcher";

const navigationLinks = [
  { href: "/", label: "사진" },
  { href: "/collection", label: "컬렉션" },
  { href: "/photographer", label: "작가" },
];


export default function NavBar() {
  const { pathname } = useLocation();
  const dropdownLabel = navigationLinks.find(
    (link) => link.href === pathname
  )?.label;

  return (
    <header className="px-4 md:px-6 sticky top-0 left-0 z-50 w-full bg-background">
      <div className="flex h-20 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="group lg:hidden gap-4" variant="ghost">
                <span>{dropdownLabel}</span>
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index} className="w-full">
                      <NavigationMenuLink href={link.href} className="py-1.5">
                        {link.label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>

          {/* Main nav */}
          <div className="hidden lg:flex gap-4 justify-start ml-2">
            {/* Navigation menu */}
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className={cn(
                        "text-muted-foreground hover:text-primary py-1.5 font-medium",
                        pathname === link.href ? "text-primary font-medium" : ""
                      )}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex basis-1/5 md:basis-full md:justify-center">
          <SearchBar />
        </div>

        {/* Right side, Auth & Theme */}
        <div className="flex items-center gap-4">
          <AuthProfile />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
