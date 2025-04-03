
import React from "react";
import { useLocation } from "react-router-dom";
import { DashboardNavProps } from "./DashboardLayout";
import { Heart, Home, Settings, Users, Mail, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "./nav/NavLink";

const SidebarNav = ({ className, ...props }: DashboardNavProps) => {
  const { pathname } = useLocation();

  const links = [
    {
      title: "כללי",
      href: "/dashboard/",
      icon: <Home className="h-4 w-4 ml-2" />,
    },
    {
      title: "מוזמנים",
      href: "/dashboard/guests",
      icon: <Users className="h-4 w-4 ml-2" />,
    },
    {
      title: "הודעות",
      href: "/dashboard/messages",
      icon: <Mail className="h-4 w-4 ml-2" />,
    },
    {
      title: "הגדרות",
      href: "/dashboard/settings",
      icon: <Settings className="h-4 w-4 ml-2" />,
    },
    {
      title: "עזרה ותמיכה",
      href: "/dashboard/help",
      icon: <HelpCircle className="h-4 w-4 ml-2" />,
    },
  ];

  return (
    <nav
      className={cn("flex md:flex-col space-y-0 md:space-y-1 space-x-0", className)}
      {...props}
    >
      {links.map((link) => (
        <NavLink 
          key={link.href}
          href={link.href}
          isActive={link.href === pathname}
          icon={link.icon}
          title={link.title}
        />
      ))}
    </nav>
  );
};

export default SidebarNav;
