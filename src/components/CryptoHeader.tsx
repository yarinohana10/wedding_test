
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const CryptoHeader = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-10 bg-crypto-bg/80 backdrop-blur-md border-b border-border/40 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Crypto Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Track prices and market trends
            </p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search coins..."
              className="pl-9 bg-muted border-border"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default CryptoHeader;
