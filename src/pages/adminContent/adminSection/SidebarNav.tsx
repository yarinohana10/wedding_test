import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItem } from "../DashboardLayout";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const location = useLocation();

  return (
    <nav className="grid items-start gap-2 px-2 text-sm font-medium">
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive =
          location.pathname === item.href ||
          (item.href !== "/dashboard" &&
            location.pathname.startsWith(item.href));

        return (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors",
              isActive
                ? "bg-muted text-foreground"
                : "hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon
              className={cn("h-4 w-4", isActive ? "text-foreground" : "")}
            />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
