import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
  Filter,
  UserMinus,
  Loader2,
  X,
  CheckCircle2,
  XCircle,
  Save,
  FilePlus,
  FileUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

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

// Component for inline editing
interface EditableCellProps {
  value: string | number;
  onChange: (value: string | number) => void;
  onSave: () => void;
  type: "text" | "number" | "select";
  options?: { value: string; label: string }[];
  className?: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  onSave,
  type,
  options = [],
  className = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave();
  };

  if (isEditing) {
    if (type === "select") {
      return (
        <Select
          value={String(value)}
          onValueChange={(val) => {
            onChange(val);
            setIsEditing(false);
            onSave();
          }}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditing(false);
              onSave();
            }
          }}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) =>
          onChange(type === "number" ? Number(e.target.value) : e.target.value)
        }
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`h-8 min-w-[80px] text-right ${className}`}
        min={type === "number" ? 1 : undefined}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors flex items-center"
    >
      <span className="flex-1">{value}</span>
      <Edit className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 mr-1" />
    </div>
  );
};

const DashboardGuests = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
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
    food: "-",
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
      // Using type assertion to work around TypeScript limitations with Supabase schema
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
        (payload) => {
          console.log("Realtime update:", payload);
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
        // Using type assertion to work around TypeScript limitations
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

      // Using type assertion to work around TypeScript limitations
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

      // Using type assertion to work around TypeScript limitations
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
        food: "-",
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
              food: "-",
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

  // Mobile card view for guest
  const renderGuestCard = (guest: Guest) => {
    const statusOptions = [
      { value: "אישר הגעה", label: "אישר הגעה" },
      { value: "טרם אישר", label: "טרם אישר" },
      { value: "לא מגיע", label: "לא מגיע" },
    ];

    const foodOptions = [
      { value: "רגיל", label: "רגיל" },
      { value: "צמחוני", label: "צמחוני" },
      { value: "טבעוני", label: "טבעוני" },
      { value: "ללא גלוטן", label: "ללא גלוטן" },
      { value: "-", label: "לא רלוונטי" },
    ];

    return (
      <Card className="p-4 mb-4" key={guest.id}>
        <div className="flex justify-between items-start mb-3">
          <div className="w-full">
            <div className="group mb-2">
              <EditableCell
                value={guest.name}
                onChange={(value) => handleUpdateField(guest, "name", value)}
                onSave={() => {}}
                type="text"
                className="text-lg font-medium"
              />
            </div>
            <div className="group">
              <EditableCell
                value={guest.phone}
                onChange={(value) => handleUpdateField(guest, "phone", value)}
                onSave={() => {}}
                type="text"
                className="text-sm text-gray-500"
              />
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs ${getStatusColorClass(
              guest.status
            )}`}
          >
            {guest.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="group">
            <span className="text-gray-500 block mb-1">כמות אורחים:</span>
            <EditableCell
              value={guest.guests}
              onChange={(value) => handleUpdateField(guest, "guests", value)}
              onSave={() => {}}
              type="number"
            />
          </div>
          <div className="group">
            <span className="text-gray-500 block mb-1">העדפת אוכל:</span>
            <EditableCell
              value={guest.food}
              onChange={(value) => handleUpdateField(guest, "food", value)}
              onSave={() => {}}
              type="select"
              options={foodOptions}
            />
          </div>
        </div>

        <div className="flex justify-between mt-2 gap-2">
          <div className="group">
            <span className="text-gray-500 block mb-1">סטטוס:</span>
            <EditableCell
              value={guest.status}
              onChange={(value) => handleUpdateField(guest, "status", value)}
              onSave={() => {}}
              type="select"
              options={statusOptions}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => handleDelete(guest)}
            >
              <Trash2 className="h-4 w-4 ml-1" />
              <span>מחק</span>
            </Button>
          </div>
        </div>
      </Card>
    );
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
          <XCircle className="h-10 w-10 mx-auto mb-4 text-destructive" />
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 border-wedding-primary/20 bg-wedding-light">
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

        <Card className="p-4 border-wedding-primary/20 bg-wedding-light">
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

        <Card className="p-4 border-wedding-primary/20 bg-wedding-light">
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

        <Card className="p-4 border-wedding-primary/20 bg-wedding-light">
          <h3 className="text-lg font-medium text-right">סה"כ הזמנות</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="h-12 w-12 rounded-full bg-wedding-primary/20 flex items-center justify-center">
              <span className="text-wedding-primary text-xl font-bold">
                {guests.length}
              </span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                {guests.reduce((acc, guest) => acc + guest.guests, 0)}
              </p>
              <p className="text-sm text-gray-500">סה"כ אנשים</p>
            </div>
          </div>
        </Card>
      </div>

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
            <Select value={filterStatus} onValueChange={setFilterStatus}>
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

      <div className="md:hidden rounded-md border border-wedding-primary/20 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right font-bold">שם מלא</TableHead>
              <TableHead className="text-right font-bold">מספר טלפון</TableHead>
              <TableHead className="text-right font-bold">
                כמות אורחים
              </TableHead>
              <TableHead className="text-right font-bold">סטטוס</TableHead>
              <TableHead className="text-right font-bold">העדפת אוכל</TableHead>
              <TableHead className="text-right font-bold">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.length > 0 ? (
              filteredGuests.map((guest) => {
                const statusOptions = [
                  { value: "אישר הגעה", label: "אישר הגעה" },
                  { value: "טרם אישר", label: "טרם אישר" },
                  { value: "לא מגיע", label: "לא מגיע" },
                ];

                const foodOptions = [
                  { value: "רגיל", label: "רגיל" },
                  { value: "צמחוני", label: "צמחוני" },
                  { value: "טבעוני", label: "טבעוני" },
                  { value: "ללא גלוטן", label: "ללא גלוטן" },
                  { value: "-", label: "לא רלוונטי" },
                ];

                return (
                  <TableRow key={guest.id} className="group">
                    <TableCell className="font-medium">
                      <EditableCell
                        value={guest.name}
                        onChange={(value) =>
                          handleUpdateField(guest, "name", value)
                        }
                        onSave={() => {}}
                        type="text"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={guest.phone}
                        onChange={(value) =>
                          handleUpdateField(guest, "phone", value)
                        }
                        onSave={() => {}}
                        type="text"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={guest.guests}
                        onChange={(value) =>
                          handleUpdateField(guest, "guests", value)
                        }
                        onSave={() => {}}
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={guest.status}
                        onChange={(value) =>
                          handleUpdateField(guest, "status", value)
                        }
                        onSave={() => {}}
                        type="select"
                        options={statusOptions}
                      />
                    </TableCell>
                    <TableCell>
                      <EditableCell
                        value={guest.food}
                        onChange={(value) =>
                          handleUpdateField(guest, "food", value)
                        }
                        onSave={() => {}}
                        type="select"
                        options={foodOptions}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(guest)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  לא נמצאו מוזמנים התואמים את החיפוש
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden mt-4">
        {filteredGuests.length > 0 ? (
          filteredGuests.map((guest) => renderGuestCard(guest))
        ) : (
          <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-md">
            לא נמצאו מוזמנים התואמים את החיפוש
          </div>
        )}
      </div>

      {/* Delete Guest Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">סגור</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-right">מחיקת מוזמן</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">
              האם אתה בטוח שברצונך למחוק את {guestToDelete?.name} מרשימת
              המוזמנים?
            </p>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              ביטול
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              מחק
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Guest Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">סגור</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-right">הוספת מוזמן חדש</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">שם מלא</Label>
              <Input
                value={newGuest.name}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, name: e.target.value })
                }
                className="col-span-3 text-right"
                placeholder="הכנס שם מלא"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">טלפון</Label>
              <Input
                value={newGuest.phone}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, phone: e.target.value })
                }
                className="col-span-3 text-right"
                placeholder="050-1234567"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">מספר אורחים</Label>
              <Input
                type="number"
                min="1"
                value={newGuest.guests}
                onChange={(e) =>
                  setNewGuest({
                    ...newGuest,
                    guests: parseInt(e.target.value) || 1,
                  })
                }
                className="col-span-3 text-right"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">סטטוס</Label>
              <Select
                value={newGuest.status}
                onValueChange={(value) =>
                  setNewGuest({ ...newGuest, status: value })
                }
              >
                <SelectTrigger className="col-span-3 text-right">
                  <SelectValue placeholder="בחר סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="אישר הגעה">אישר הגעה</SelectItem>
                  <SelectItem value="טרם אישר">טרם אישר</SelectItem>
                  <SelectItem value="לא מגיע">לא מגיע</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">העדפת אוכל</Label>
              <Select
                value={newGuest.food}
                onValueChange={(value) =>
                  setNewGuest({ ...newGuest, food: value })
                }
              >
                <SelectTrigger className="col-span-3 text-right">
                  <SelectValue placeholder="בחר העדפת אוכל" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="רגיל">רגיל</SelectItem>
                  <SelectItem value="צמחוני">צמחוני</SelectItem>
                  <SelectItem value="טבעוני">טבעוני</SelectItem>
                  <SelectItem value="-">לא רלוונטי</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              ביטול
            </Button>
            <Button
              onClick={handleAddGuest}
              disabled={isLoading}
              className="bg-wedding-primary hover:bg-wedding-accent text-white"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              הוסף מוזמן
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">סגור</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-right">
              ייבוא מוזמנים מאקסל
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-500 mb-6 text-right">
              העלה קובץ אקסל עם רשימת מוזמנים. הקובץ צריך להכיל עמודות "שם"
              ו"טלפון". מספרי טלפון זהים לא יתווספו בשנית. ניתן להוריד תבנית
              לדוגמה.
            </p>

            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                className="flex gap-2"
                onClick={downloadExcelTemplate}
              >
                <FilePlus className="h-4 w-4 ml-1" />
                הורד תבנית לדוגמה
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                ref={fileInputRef}
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />

              {isImporting ? (
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto mb-2 text-wedding-primary" />
                  <p>מייבא מוזמנים...</p>
                </div>
              ) : (
                <div>
                  <FileUp className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="mb-2">גרור קובץ לכאן או</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-wedding-primary/10 hover:bg-wedding-primary/20 border-wedding-primary/20 text-wedding-dark"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    בחר קובץ
                  </Button>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(false)}
            >
              ביטול
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardGuests;
