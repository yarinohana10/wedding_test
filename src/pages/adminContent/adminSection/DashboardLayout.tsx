import { Outlet, useNavigate } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import SidebarNav from "./SidebarNav";
import MobileNavigation from "./MobileNavigation";
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gradient-to-b from-wedding-light to-wedding-primary/10 lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2 p-4">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <span className="font-medium text-wedding-dark">ניהול אירוע</span>
            <Button
              size="sm"
              variant="ghost"
              className="mr-auto"
              onClick={() => navigate("/")}
            >
              <HomeIcon className="h-4 w-4 ml-1" />
              <span>דף הבית</span>
            </Button>
          </div>
          <SidebarNav />
        </div>
      </div>
      <MobileNavigation />
      <main className="overflow-auto p-4 pt-16 lg:p-6 lg:pt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
