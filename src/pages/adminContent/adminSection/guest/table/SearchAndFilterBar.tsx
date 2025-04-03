import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileUp, Filter, Loader2, Plus, Search } from "lucide-react";

interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  exportToExcel: () => void;
  isExporting: boolean;
  setIsImportDialogOpen: (open: boolean) => void;
  setIsAddDialogOpen: (open: boolean) => void;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  exportToExcel,
  isExporting,
  setIsImportDialogOpen,
  setIsAddDialogOpen,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי שם או טלפון..."
            className="pr-3 pl-10 text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-shrink-0">
          <Select
            dir="rtl"
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="סנן לפי סטטוס" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="אישר הגעה">אישר הגעה</SelectItem>
              <SelectItem value="טרם אישר">טרם אישר</SelectItem>
              <SelectItem value="לא מגיע">לא מגיע</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <Button
          variant="outline"
          className="gap-2 border-wedding-primary/50 text-wedding-dark"
          onClick={exportToExcel}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              <span>מייצא...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 ml-2" />
              <span>ייצוא לאקסל</span>
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-wedding-primary/50 text-wedding-dark"
          onClick={() => setIsImportDialogOpen(true)}
        >
          <FileUp className="h-4 w-4 ml-2" />
          <span>ייבוא מאקסל</span>
        </Button>
        <Button
          className="gap-2 bg-wedding-primary hover:bg-wedding-accent text-white"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 ml-2" />
          <span>הוספת מוזמן</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
