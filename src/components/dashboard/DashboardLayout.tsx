
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { 
  UsersRound, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const dashboardNavItems: NavItem[] = [
  {
    title: "דף הבית",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // In a real app, this would clear authentication state, tokens, etc.
    toast({
      title: "התנתקות מוצלחת",
      description: "הועברת לדף הבית",
    });
    
    navigate('/');
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-white lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <span className="font-medium">ניהול אירוע</span>
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
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
