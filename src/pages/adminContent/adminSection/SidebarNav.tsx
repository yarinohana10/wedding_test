
import React from "react";
import { useLocation } from "react-router-dom";
import { DashboardNavProps } from "./DashboardLayout";
import { Heart, Home, Settings, Users, Mail, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        <Button
          key={link.href}
          variant={link.href === pathname ? "secondary" : "ghost"}
          className={cn(
            "justify-start w-full text-right hover:bg-wedding-primary/10",
            link.href === pathname
              ? "bg-wedding-primary/10 text-wedding-primary font-medium hover:bg-wedding-primary/20"
              : ""
          )}
          asChild
        >
          <a href={link.href} className="flex items-center">
            {link.icon}
            <span className="hidden md:inline">{link.title}</span>
          </a>
        </Button>
      ))}
    </nav>
  );
};

export default SidebarNav;
