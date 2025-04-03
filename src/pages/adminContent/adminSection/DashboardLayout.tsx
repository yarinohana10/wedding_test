import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogOut, HomeIcon } from "lucide-react";

import SidebarNav from "./SidebarNav";
import MobileNavigation from "./MobileNavigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface DashboardNavProps {
  className?: string;
}

const dashboardNavItems: NavItem[] = [
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

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
              onClick={() => navigate("/")}
            >
              <HomeIcon className="h-4 w-4 ml-1" />
              <span>דף הבית</span>
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <SidebarNav />
          </div>
        </div>
      </div>

      <MobileNavigation />

      <div className="flex flex-col lg:pt-0 pt-14 bg-wedding-light/50">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
