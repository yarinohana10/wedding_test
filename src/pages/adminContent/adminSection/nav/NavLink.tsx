
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  title: string;
  isActive: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({ 
  href, 
  icon, 
  title, 
  isActive 
}) => {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "justify-start w-full text-right hover:bg-wedding-primary/10",
        isActive
          ? "bg-wedding-primary/10 text-wedding-primary font-medium hover:bg-wedding-primary/20"
          : ""
      )}
      asChild
    >
      <a href={href} className="flex items-center">
        {icon}
        <span className="hidden md:inline">{title}</span>
      </a>
    </Button>
  );
};
