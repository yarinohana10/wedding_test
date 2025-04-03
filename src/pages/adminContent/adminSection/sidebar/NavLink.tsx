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
  isActive,
}) => {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "justify-start hover:bg-wedding-accent/20",
        isActive &&
          "bg-wedding-accent/50  font-medium hover:bg-wedding-accent/20"
      )}
    >
      <a href={href} className="flex w-full items-center">
        {icon}
        {title}
      </a>
    </Button>
  );
};
