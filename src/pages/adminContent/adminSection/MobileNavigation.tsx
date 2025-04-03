
import React from "react";
import { Link, Location } from "react-router-dom";
import { Menu, X, HomeIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavigationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleLogout: () => void;
  navigateHome: () => void;
  location: Location;
}

const dashboardNavItems = [
  {
    title: "ניהול מוזמנים",
    href: "/dashboard/guests",
    icon: function UsersIcon({ className }: { className?: string }) {
      return <span className={className}>👥</span>;
    },
  },
  {
    title: "הגדרות",
    href: "/dashboard/settings",
    icon: function SettingsIcon({ className }: { className?: string }) {
      return <span className={className}>⚙️</span>;
    },
  },
];

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  open,
  setOpen,
  handleLogout,
  navigateHome,
  location,
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-b bg-wedding-light px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">פתח תפריט</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="max-w-xs bg-gradient-to-b from-wedding-light to-wedding-primary/10"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b h-14 px-4">
              <h2 className="font-semibold">ניהול אירוע</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-4">
              <nav className="grid gap-2 px-2">
                {dashboardNavItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={index}
                      to={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isActive
                          ? "bg-wedding-primary/20 text-wedding-dark font-medium"
                          : "text-muted-foreground hover:bg-wedding-primary/10 hover:text-wedding-dark"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="mt-auto p-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 w-full justify-start text-wedding-dark"
                onClick={() => {
                  navigateHome();
                  setOpen(false);
                }}
              >
                <HomeIcon className="h-4 w-4 ml-2" />
                <span>דף הבית</span>
              </Button>
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-wedding-dark hover:bg-wedding-primary/10"
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>התנתקות</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <span className="font-medium">ניהול אירוע</span>
      <Button variant="ghost" size="sm" onClick={navigateHome}>
        <HomeIcon className="h-4 w-4 ml-1" />
        <span className="sr-only md:not-sr-only">דף הבית</span>
      </Button>
    </div>
  );
};

export default MobileNavigation;
