
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

import SummaryCards from "@/pages/adminContent/adminSection/guest/SummaryCards";
import SearchAndFilterBar from "@/pages/adminContent/adminSection/guest/table/SearchAndFilterBar";
import AddGuestDialog from "@/pages/adminContent/adminSection/guest/dialogs/AddGuestDialog";
import DeleteGuestDialog from "@/pages/adminContent/adminSection/guest/dialogs/DeleteGuestDialog";
import ImportGuestsDialog from "@/pages/adminContent/adminSection/guest/dialogs/ImportGuestsDialog";
import GuestCard from "./GuestCard";
import GuestsTable from "./table/GuestsTable";

interface Guest {
  id: string;
  name: string;
  phone: string;
  guests: number;
  status: string;
  food: string;
  created_at?: string | null;
  updated_at?: string | null;
}

const DashboardGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // For the new guest form
  const [newGuest, setNewGuest] = useState<Omit<Guest, "id">>({
    name: "",
    phone: "",
    guests: 1,
    status: "טרם אישר",
    food: "רגיל",
  });

  // Summary stats
  const [summary, setSummary] = useState({
    attending: 0,
    notAttending: 0,
    pending: 0,
    totalGuests: 0,
  });

  // Load guests from Supabase
  const fetchGuests = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = (await supabase
        .from("guests")
        .select("*")
        .order("created_at", { ascending: false })) as {
        data: Guest[] | null;
        error: Error | null;
      };

      if (error) {
        throw error;
      }

      setGuests(data || []);
    } catch (err: any) {
      console.error("Error fetching guests:", err);
      setError(err.message || "שגיאה בטעינת נתונים");
      toast({
        title: "שגיאה בטעינת הנתונים",
        description: err.message || "שגיאה בטעינת נתונים",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();

    // Set up realtime subscription
    const subscription = supabase
      .channel("guests-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guests" },
        () => {
          fetchGuests(); // Refresh data when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Update summary stats when guests change
    const attending = guests.filter((g) => g.status === "אישר הגעה");
    const notAttending = guests.filter((g) => g.status === "לא מגיע");
    const pending = guests.filter((g) => g.status === "טרם אישר");

    setSummary({
      attending: attending.length,
      notAttending: notAttending.length,
      pending: pending.length,
      totalGuests: attending.reduce((acc, g) => acc + g.guests, 0),
    });
  }, [guests]);

  // Filter guests based on search term and status filter
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm);

    const matchesStatus =
      filterStatus === "all" || guest.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = (guest: Guest) => {
    setGuestToDelete(guest);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (guestToDelete) {
      setIsLoading(true);
      try {
        const { error } = (await supabase
          .from("guests")
          .delete()
          .eq("id", guestToDelete.id)) as { error: Error | null };

        if (error) throw error;

        // Optimistically update the UI
        setGuests(guests.filter((g) => g.id !== guestToDelete.id));

        toast({
          title: "מוזמן נמחק",
          description: `${guestToDelete.name} הוסר מרשימת המוזמנים`,
        });
      } catch (err: any) {
        console.error("Error deleting guest:", err);
        toast({
          title: "שגיאה במחיקת מוזמן",
          description: err.message || "נכשל בניסיון למחוק את המוזמן",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        setGuestToDelete(null);
      }
    }
  };

  const handleUpdateField = async (
    guest: Guest,
    field: keyof Guest,
    value: any
  ) => {
    try {
      const updatedGuest = { ...guest, [field]: value };

      const { error } = (await supabase
        .from("guests")
        .update({ [field]: value })
        .eq("id", guest.id)) as { error: Error | null };

      if (error) throw error;

      // Optimistically update the UI
      setGuests((prevGuests) =>
        prevGuests.map((g) => (g.id === guest.id ? updatedGuest : g))
      );
    } catch (err: any) {
      console.error(`Error updating ${field}:`, err);
      toast({
        title: "שגיאה בעדכון",
        description: err.message || `שגיאה בעדכון ${field}`,
        variant: "destructive",
      });
    }
  };

  const handleAddGuest = async () => {
    if (!newGuest.name.trim() || !newGuest.phone.trim()) {
      toast({
        title: "שגיאה",
        description: "שם וטלפון הם שדות חובה",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if phone number already exists
      const { data: existingGuests, error: lookupError } = (await supabase
        .from("guests")
        .select("phone")
        .eq("phone", newGuest.phone)) as {
        data: { phone: string }[] | null;
        error: Error | null;
      };

      if (lookupError) throw lookupError;

      if (existingGuests && existingGuests.length > 0) {
        toast({
          title: "מספר טלפון קיים",
          description:
            "מספר הטלפון שהזנת כבר קיים במערכת. כל מספר טלפון חייב להיות ייחודי.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = (await supabase
        .from("guests")
        .insert([newGuest])
        .select()) as {
        data: Guest[] | null;
        error: Error | null;
      };

      if (error) throw error;

      if (data && data.length > 0) {
        // Optimistically update the UI
        setGuests([data[0], ...guests]);

        toast({
          title: "מוזמן נוסף",
          description: `${newGuest.name} נוסף לרשימת המוזמנים`,
        });
      }
    } catch (err: any) {
      console.error("Error adding guest:", err);
      toast({
        title: "שגיאה בהוספת מוזמן",
        description: err.message || "נכשל בניסיון להוסיף מוזמן",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsAddDialogOpen(false);
      setNewGuest({
        name: "",
        phone: "",
        guests: 1,
        status: "טרם אישר",
        food: "רגיל",
      });
    }
  };

  const exportToExcel = () => {
    setIsExporting(true);

    try {
      // Prepare data for export
      const exportData = guests.map((guest) => ({
        שם: guest.name,
        טלפון: guest.phone,
        "כמות אורחים": guest.guests,
        סטטוס: guest.status,
        "העדפת אוכל": guest.food,
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "רשימת מוזמנים");

      // Generate file and trigger download
      XLSX.writeFile(wb, "guests_list.xlsx");

      toast({
        title: "ייצוא לאקסל",
        description: "רשימת המוזמנים יוצאה לקובץ אקסל בהצלחה",
      });
    } catch (err: any) {
      console.error("Error exporting to Excel:", err);
      toast({
        title: "שגיאה בייצוא לאקסל",
        description: err.message || "נכשל בניסיון לייצא לאקסל",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadExcelTemplate = () => {
    try {
      // Create template data with example row
      const templateData = [
        {
          שם: "ישראל ישראלי",
          טלפון: "0501234567",
        },
        {
          שם: "רונית כהן",
          טלפון: "0529876543",
        },
      ];

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(templateData);

      // Add comments/instructions to cells
      const A1 = ws["A1"];
      const B1 = ws["B1"];
      A1.c = [{ a: "גדי ירושלמי", t: "שם מלא של המוזמן" }];
      B1.c = [{ a: "גדי ירושלמי", t: "מספר טלפון (10 ספרות, ללא מקפים)" }];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "תבנית מוזמנים");

      // Generate file and trigger download
      XLSX.writeFile(wb, "guests_template.xlsx");

      toast({
        title: "תבנית אקסל",
        description: "תבנית האקסל הורדה בהצלחה",
      });
    } catch (err: any) {
      console.error("Error creating Excel template:", err);
      toast({
        title: "שגיאה ביצירת תבנית",
        description: err.message || "נכשל בניסיון ליצור תבנית אקסל",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    importGuestsFromExcel(file);
  };

  const importGuestsFromExcel = async (file: File) => {
    setIsImporting(true);

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        if (!e.target || !e.target.result) return;

        try {
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          // Get first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Array<{
            שם?: string;
            טלפון?: string;
            name?: string;
            phone?: string;
          }>;

          if (jsonData.length === 0) {
            throw new Error("הקובץ ריק או בפורמט לא תקין");
          }

          // Validate and prepare data
          const newGuests: Omit<Guest, "id">[] = [];
          const errors: string[] = [];
          let skipped = 0;

          for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];
            // Support both Hebrew and English column names
            const name = row["שם"] || row["name"] || "";
            const phone = row["טלפון"] || row["phone"] || "";

            if (!name || !phone) {
              errors.push(`שורה ${i + 1}: חסר שם או מספר טלפון`);
              continue;
            }

            // Validate phone format: 10 digits only
            if (!/^\d{10}$/.test(phone.toString())) {
              errors.push(
                `שורה ${i + 1}: מספר טלפון ${phone} אינו תקין (נדרשים 10 ספרות)`
              );
              continue;
            }

            // Check if phone already exists in current db
            const existingInDB = guests.find(
              (g) => g.phone === phone.toString()
            );
            if (existingInDB) {
              skipped++;
              continue;
            }

            // Check if this phone number is already in our new guests list
            const existingInNewGuests = newGuests.find(
              (g) => g.phone === phone.toString()
            );
            if (existingInNewGuests) {
              errors.push(
                `שורה ${i + 1}: מספר טלפון ${phone} מופיע יותר מפעם אחת בקובץ`
              );
              continue;
            }

            newGuests.push({
              name: name.toString(),
              phone: phone.toString(),
              guests: 1,
              status: "טרם אישר",
              food: "רגיל",
            });
          }

          if (newGuests.length === 0) {
            if (skipped > 0) {
              toast({
                title: "לא יובאו מוזמנים חדשים",
                description: `כל המוזמנים בקובץ (${skipped}) כבר קיימים במערכת`,
                variant: "default",
              });
            } else {
              toast({
                title: "שגיאה בייבוא מוזמנים",
                description: `לא נמצאו מוזמנים תקינים לייבוא. בדוק את הפורמט של הקובץ.`,
                variant: "destructive",
              });
            }
            setIsImporting(false);
            setIsImportDialogOpen(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }

          // Insert into database
          const { data: insertedData, error: insertError } = (await supabase
            .from("guests")
            .insert(newGuests)
            .select()) as { data: Guest[] | null; error: Error | null };

          if (insertError) throw insertError;

          // Success message
          toast({
            title: "ייבוא מוזמנים הושלם",
            description: `יובאו ${newGuests.length} מוזמנים חדשים בהצלחה${
              skipped > 0 ? `, דילוג על ${skipped} מוזמנים קיימים` : ""
            }${errors.length > 0 ? `, ${errors.length} שגיאות` : ""}`,
          });

          // Update UI
          if (insertedData) {
            setGuests((prev) => [...insertedData, ...prev]);
          }

          // Show errors if any
          if (errors.length > 0) {
            console.error("Import errors:", errors);
            setTimeout(() => {
              toast({
                title: `${errors.length} שגיאות בייבוא`,
                description: "ראה את הקונסול לפירוט השגיאות",
                variant: "destructive",
              });
            }, 1000);
          }
        } catch (error: any) {
          console.error("Error processing Excel:", error);
          toast({
            title: "שגיאה בעיבוד קובץ האקסל",
            description: error.message || "שגיאה בעיבוד קובץ האקסל",
            variant: "destructive",
          });
        }

        setIsImporting(false);
        setIsImportDialogOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      };

      reader.onerror = () => {
        toast({
          title: "שגיאה בקריאת הקובץ",
          description: "לא ניתן לקרוא את הקובץ שנבחר",
          variant: "destructive",
        });
        setIsImporting(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      console.error("Error importing from Excel:", err);
      toast({
        title: "שגיאה בייבוא מאקסל",
        description: err.message || "נכשל בניסיון לייבא מאקסל",
        variant: "destructive",
      });
      setIsImporting(false);
    }
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "אישר הגעה":
        return "bg-green-100 text-green-800";
      case "לא מגיע":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  // Filter guests based on status card click
  const filterByStatus = (status: string) => {
    setFilterStatus(status);
  };

  if (isLoading && guests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-wedding-primary" />
          <p className="text-muted-foreground">טוען רשימת מוזמנים...</p>
        </div>
      </div>
    );
  }

  if (error && guests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <X className="h-10 w-10 mx-auto mb-4 text-destructive" />
          <p className="text-destructive font-medium mb-2">
            שגיאה בטעינת נתונים
          </p>
          <p className="text-muted-foreground">{error}</p>
          <Button
            className="mt-4 bg-wedding-primary hover:bg-wedding-accent text-white"
            onClick={fetchGuests}
          >
            נסה שנית
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-right">
        <h1 className="text-3xl font-bold tracking-tight">ניהול מוזמנים</h1>
        <p className="text-muted-foreground">רשימת המוזמנים לאירוע</p>
      </div>
      <SummaryCards 
        summary={summary} 
        filterByStatus={filterByStatus}
        guestsLength={guests.length}
      />
      <SearchAndFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        exportToExcel={exportToExcel}
        isExporting={isExporting}
        setIsImportDialogOpen={setIsImportDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
      />
      <GuestsTable
        filteredGuests={filteredGuests}
        handleUpdateField={handleUpdateField}
        handleDelete={handleDelete}
      />

      
      <DeleteGuestDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        guestToDelete={guestToDelete}
        confirmDelete={confirmDelete}
        isLoading={isLoading}
      />
      <AddGuestDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        newGuest={newGuest as Guest}
        setNewGuest={setNewGuest as (guest: Guest) => void}
        handleAddGuest={handleAddGuest}
        isLoading={isLoading}
      />
      <ImportGuestsDialog
        isOpen={isImportDialogOpen}
        setIsOpen={setIsImportDialogOpen}
        isImporting={isImporting}
        downloadExcelTemplate={downloadExcelTemplate}
        handleFileChange={handleFileChange}
        fileInputRef={fileInputRef}
      />
    </div>
  );
};

export default DashboardGuests;
