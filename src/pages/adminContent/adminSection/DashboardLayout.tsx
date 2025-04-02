import React, { useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";

import { UsersRound, Settings, LogOut, Menu, X, HomeIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "./SidebarNav";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const dashboardNavItems: NavItem[] = [
  {
    title: "ניהול מוזמנים",
    href: "/dashboard/guests",
    icon: UsersRound,
  },
  {
    title: "הגדרות",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    // In a real app, this would clear authentication state, tokens, etc.
    toast({
      title: "התנתקות מוצלחת",
      description: "הועברת לדף הבית",
    });

    navigate("/");
  };

  const navigateHome = () => {
    navigate("/");
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gradient-to-b from-wedding-light to-wedding-primary/10 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <span className="font-medium text-wedding-dark">ניהול אירוע</span>
            <Button
              variant="ghost"
              size="sm"
              className="mr-auto"
              onClick={navigateHome}
            >
              <HomeIcon className="h-4 w-4 ml-1" />
              <span>דף הבית</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <SidebarNav items={dashboardNavItems} />
          </div>
          <div className="mt-auto p-4">
            <button
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>התנתקות</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
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

      <div className="flex flex-col lg:pt-0 pt-14 bg-wedding-light/50">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
