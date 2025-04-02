
import React, { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { 
  UsersRound, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

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
    title: "הודעות",
    href: "/dashboard/messages",
    icon: MessageSquare,
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
  const isMobile = useIsMobile();

  const handleLogout = () => {
    // In a real app, this would clear authentication state, tokens, etc.
    toast({
      title: "התנתקות מוצלחת",
      description: "הועברת לדף הבית",
    });
    
    navigate('/');
  };

  const isSettingsPage = location.pathname === "/dashboard/settings";

  const previewHomePage = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-white lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <span className="font-medium">ניהול אירוע</span>
            {isSettingsPage && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-auto" 
                onClick={previewHomePage}
              >
                <ExternalLink className="h-4 w-4 ml-1" />
                <span>תצוגה מקדימה</span>
              </Button>
            )}
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
      <div className="fixed top-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">פתח תפריט</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="max-w-xs">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b h-14 px-4">
                <h2 className="font-semibold">ניהול אירוע</h2>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
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
                            ? 'bg-muted text-foreground font-medium' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
                {isSettingsPage && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mb-4 w-full justify-start" 
                    onClick={() => {
                      previewHomePage();
                      setOpen(false);
                    }}
                  >
                    <ExternalLink className="h-4 w-4 ml-2" />
                    <span>תצוגה מקדימה</span>
                  </Button>
                )}
                <button 
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
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
        {isSettingsPage && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={previewHomePage}
          >
            <ExternalLink className="h-4 w-4 ml-1" />
            <span className="sr-only md:not-sr-only">תצוגה מקדימה</span>
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:pt-0 pt-14">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
