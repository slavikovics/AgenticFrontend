import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { AuthComponent } from "../auth";
import { HeaderLogo } from "./HeaderLogo";
import { NavButton } from "./NavButton";
import { useNavigation } from "./useNavigation";
import { NAVIGATION_ITEMS } from "./constants";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isActive, isInChat, handleNavigate } = useNavigation(() =>
    setIsMobileMenuOpen(false),
  );

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Три колонки: лого | nav | actions
            grid-cols-[1fr_auto_1fr] гарантирует что левая и правая
            колонки одинаковой ширины — навигация всегда точно по центру */}
        <div className="flex justify-between items-center h-16 md:grid md:grid-cols-[1fr_auto_1fr]">
          {/* Левая колонка — лого */}
          <HeaderLogo />

          {/* Центральная колонка — навигация */}
          <nav className="hidden md:flex items-center gap-1">
            {NAVIGATION_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={isActive(item.path)}
                isInChat={isInChat}
                onClick={() => handleNavigate(item.path)}
                variant="desktop"
              />
            ))}
          </nav>

          {/* Правая колонка — действия, прижаты к правому краю */}
          <div className="flex items-center gap-2 justify-end">
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <AuthComponent />
            </div>
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <AuthComponent />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-2">
            <div className="flex flex-col gap-1">
              {NAVIGATION_ITEMS.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  active={isActive(item.path)}
                  isInChat={isInChat}
                  onClick={() => handleNavigate(item.path)}
                  variant="mobile"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
