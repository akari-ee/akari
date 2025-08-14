import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { Link, useLocation } from "react-router";
import SearchBar from "./search-bar";
import { cn } from "~/lib/utils";
import { ROUTE_LINK } from "~/constant/route";
import MobileSideMenu from "./mobile-side-menu";
import UserButton from "../user-button";

export default function NavBar() {
  const { pathname } = useLocation();

  return (
    <header className="px-4 md:px-12 sticky top-0 left-0 z-50 w-full bg-background transition-all duration-300">
      <div className="flex h-20 items-center justify-between gap-6">
        {/* Left side */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-2xl font-light font-josefin h-fit mt-1">
            <Link to={"/"}>AKARI</Link>
          </div>
          {/* Main nav */}
          <div className="hidden md:flex gap-4 justify-start ml-2">
            {/* Navigation menu */}
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {ROUTE_LINK.slice(0, 3).map(({ path, label }, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={path}
                      className={cn(
                        "text-muted-foreground hover:text-primary py-1.5 font-medium hover:bg-inherit",
                        pathname === path ? "text-primary font-medium" : ""
                      )}
                    >
                      {label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex basis-full justify-center">
          <SearchBar />
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4 lg:min-w-80 lg:justify-end">
          <UserButton />
        </div>

        {/* Mobile Side Menu */}
        <div className="flex md:hidden">
          <MobileSideMenu />
        </div>
      </div>
    </header>
  );
}
