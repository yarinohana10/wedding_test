import { useNavigate } from "react-router-dom";
import { Menu, X, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarNav from "./SidebarNav";
import { useState } from "react";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-b bg-wedding-light px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent  className="max-w-xs bg-gradient-to-b from-wedding-light to-wedding-primary/20">
          <SidebarNav />
        </SheetContent>
      </Sheet>
      <span className="font-medium">ניהול אירוע</span>
      <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
        <HomeIcon className="h-4 w-4 ml-1" />
        <span className="sr-only md:not-sr-only">דף הבית</span>
      </Button>
    </div>
  );
};

export default MobileNavigation;
