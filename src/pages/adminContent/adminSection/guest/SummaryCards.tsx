import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, UserMinus } from "lucide-react";

interface SummaryProps {
  summary: {
    attending: number;
    notAttending: number;
    pending: number;
    totalGuests: number;
  };
  filterByStatus: (status: string) => void;
  guestsLength: number;
}

const SummaryCards: React.FC<SummaryProps> = ({
  summary,
  filterByStatus,
  guestsLength,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <Card
        className="p-4 hover:scale-[1.02] hover:bg-wedding-accent/20 border-wedding-primary/20 bg-wedding-primary/40 cursor-pointer"
        onClick={() => filterByStatus("אישר הגעה")}
      >
        <h3 className="text-lg font-medium text-right">אישרו הגעה</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-800" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{summary.totalGuests}</p>
            <p className="text-sm text-gray-500">סה"כ אורחים</p>
          </div>
        </div>
      </Card>

      <Card
        className="p-4 hover:scale-[1.02] hover:bg-wedding-accent/20 border-wedding-primary/20 bg-wedding-primary/40 cursor-pointer"
        onClick={() => filterByStatus("לא מגיע")}
      >
        <h3 className="text-lg font-medium text-right">לא מגיעים</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <UserMinus className="h-6 w-6 text-red-800" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{summary.notAttending}</p>
            <p className="text-sm text-gray-500">אנשים</p>
          </div>
        </div>
      </Card>

      <Card
        className="p-4 hover:scale-[1.02] hover:bg-wedding-accent/20 border-wedding-primary/20 bg-wedding-primary/40 cursor-pointer"
        onClick={() => filterByStatus("טרם אישר")}
      >
        <h3 className="text-lg font-medium text-right">טרם אישרו</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-amber-800 text-xl font-bold">
              {summary.pending}
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {Math.round(
                (summary.pending /
                  (summary.attending +
                    summary.notAttending +
                    summary.pending)) *
                  100 || 0
              )}
              %
            </p>
            <p className="text-sm text-gray-500">מכלל ההזמנות</p>
          </div>
        </div>
      </Card>

      <Card
        className="p-4 hover:scale-[1.02] hover:bg-wedding-accent/20 border-wedding-primary/20 bg-wedding-primary/40 cursor-pointer"
        onClick={() => filterByStatus("all")}
      >
        <h3 className="text-lg font-medium text-right">סה"כ הזמנות</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="h-12 w-12 rounded-full bg-wedding-primary/20 flex items-center justify-center">
            <span className="text-wedding-primary text-xl font-bold">
              {guestsLength}
            </span>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{summary.totalGuests}</p>
            <p className="text-sm text-gray-500">סה"כ אנשים</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryCards;
