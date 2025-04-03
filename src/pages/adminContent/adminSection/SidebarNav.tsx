import { useLocation, useNavigate } from "react-router-dom";
import { Settings, Users, HelpCircle, LogOut, X } from "lucide-react";

import { NavLink } from "./nav/NavLink";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const SidebarNav = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    // In a real app, this would clear authentication state, tokens, etc.
    toast({
      title: "התנתקות מוצלחת",
      description: "הועברת לדף הבית",
    });
    navigate("/");
  };

  const links = [
    {
      title: "מוזמנים",
      href: "/dashboard",
      icon: <Users className="h-4 w-4 ml-2" />,
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
    <div className={"flex flex-col py-4 h-full justify-between overflow-auto"}>
      <nav className={"flex flex-col gap-1"}>
        {links.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            title={link.title}
            isActive={link.href === pathname}
          />
        ))}
      </nav>
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="text-muted-foreground flex w-full items-center justify-start gap-2 hover:text-foreground hover:bg-wedding-accent/20"
      >
        <LogOut className="h-4 w-4" />
        <span>התנתקות</span>
      </Button>
    </div>
  );
};

export default SidebarNav;
