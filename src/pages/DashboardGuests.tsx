
import React, { useState, useEffect } from 'react';
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
  XCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Summary stats
  const [summary, setSummary] = useState({
    attending: 0,
    notAttending: 0,
    pending: 0,
    totalGuests: 0
  });

  // For the new guest form
  const [newGuest, setNewGuest] = useState<Omit<Guest, 'id'>>({
    name: "",
    phone: "",
    guests: 1,
    status: "טרם אישר",
    food: "-"
  });

  // Load guests from Supabase
  const fetchGuests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setGuests(data || []);
    } catch (err: any) {
      console.error('Error fetching guests:', err);
      setError(err.message || 'Error fetching guests');
      toast({
        title: "שגיאה בטעינת הנתונים",
        description: err.message || 'Error fetching guests',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('guests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'guests' }, (payload) => {
        console.log('Realtime update:', payload);
        fetchGuests(); // Refresh data when changes occur
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Update summary stats when guests change
    const attending = guests.filter(g => g.status === "אישר הגעה");
    const notAttending = guests.filter(g => g.status === "לא מגיע");
    const pending = guests.filter(g => g.status === "טרם אישר");
    
    setSummary({
      attending: attending.length,
      notAttending: notAttending.length,
      pending: pending.length,
      totalGuests: attending.reduce((acc, g) => acc + g.guests, 0)
    });
  }, [guests]);

  // Filter guests based on search term and status filter
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      guest.phone.includes(searchTerm);
    
    const matchesStatus = 
      filterStatus === "all" || 
      guest.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (guest: Guest) => {
    setGuestToDelete(guest);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (guestToDelete) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('guests')
          .delete()
          .eq('id', guestToDelete.id);
        
        if (error) throw error;
        
        // Optimistically update the UI
        setGuests(guests.filter(g => g.id !== guestToDelete.id));
        
        toast({
          title: "מוזמן נמחק",
          description: `${guestToDelete.name} הוסר מרשימת המוזמנים`,
        });
      } catch (err: any) {
        console.error('Error deleting guest:', err);
        toast({
          title: "שגיאה במחיקת מוזמן",
          description: err.message || 'Failed to delete guest',
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        setGuestToDelete(null);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (editingGuest) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('guests')
          .update({
            name: editingGuest.name,
            phone: editingGuest.phone,
            guests: editingGuest.guests,
            status: editingGuest.status,
            food: editingGuest.food
          })
          .eq('id', editingGuest.id);
        
        if (error) throw error;
        
        // Optimistically update the UI
        setGuests(guests.map(g => g.id === editingGuest.id ? editingGuest : g));
        
        toast({
          title: "מוזמן עודכן",
          description: `פרטי ${editingGuest.name} עודכנו בהצלחה`,
        });
      } catch (err: any) {
        console.error('Error updating guest:', err);
        toast({
          title: "שגיאה בעדכון מוזמן",
          description: err.message || 'Failed to update guest',
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setIsEditDialogOpen(false);
        setEditingGuest(null);
      }
    }
  };

  const handleAddGuest = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert([newGuest])
        .select();
      
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
      console.error('Error adding guest:', err);
      toast({
        title: "שגיאה בהוספת מוזמן",
        description: err.message || 'Failed to add guest',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsAddDialogOpen(false);
      setNewGuest({
        name: "",
        phone: "",
        guests: 1,
        status: "טרם אישר",
        food: "-"
      });
    }
  };

  const exportToExcel = () => {
    setIsExporting(true);
    
    try {
      // Prepare data for export
      const exportData = guests.map(guest => ({
        'שם': guest.name,
        'טלפון': guest.phone,
        'כמות אורחים': guest.guests,
        'סטטוס': guest.status,
        'העדפת אוכל': guest.food
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
      console.error('Error exporting to Excel:', err);
      toast({
        title: "שגיאה בייצוא לאקסל",
        description: err.message || 'Failed to export to Excel',
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'אישר הגעה':
        return 'bg-green-100 text-green-800';
      case 'לא מגיע':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  // Mobile card view for guest
  const renderGuestCard = (guest: Guest) => {
    return (
      <Card className="p-4 mb-4" key={guest.id}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg">{guest.name}</h3>
            <p className="text-sm text-gray-500">{guest.phone}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColorClass(guest.status)}`}>
            {guest.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div>
            <span className="text-gray-500">כמות אורחים:</span> {guest.guests}
          </div>
          <div>
            <span className="text-gray-500">העדפת אוכל:</span> {guest.food}
          </div>
        </div>

        <div className="flex justify-end mt-2 gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(guest)}>
            <Edit className="h-4 w-4 ml-1" />
            <span>ערוך</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(guest)}>
            <Trash2 className="h-4 w-4 ml-1" />
            <span>מחק</span>
          </Button>
        </div>
      </Card>
    );
  };

  if (isLoading && guests.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-muted-foreground" />
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
          <p className="text-destructive font-medium mb-2">שגיאה בטעינת נתונים</p>
          <p className="text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={fetchGuests}>נסה שנית</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-right">
        <h1 className="text-3xl font-bold tracking-tight">ניהול מוזמנים</h1>
        <p className="text-muted-foreground">
          רשימת המוזמנים לאירוע
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card className="p-4">
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
        
        <Card className="p-4">
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
        
        <Card className="p-4">
          <h3 className="text-lg font-medium text-right">טרם אישרו</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-800 text-xl font-bold">{summary.pending}</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{Math.round(summary.pending / (summary.attending + summary.notAttending + summary.pending) * 100 || 0)}%</p>
              <p className="text-sm text-gray-500">מכלל ההזמנות</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium text-right">סה"כ הזמנות</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-800 text-xl font-bold">{guests.length}</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{guests.reduce((acc, guest) => acc + guest.guests, 0)}</p>
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
              className="pr-3 pl-10"
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
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
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
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 ml-2" />
            <span>הוספת מוזמן</span>
          </Button>
        </div>
      </div>

      {/* Desktop table view */}
      {!isMobile && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right font-bold">שם מלא</TableHead>
                <TableHead className="text-right font-bold">מספר טלפון</TableHead>
                <TableHead className="text-right font-bold">כמות אורחים</TableHead>
                <TableHead className="text-right font-bold">סטטוס</TableHead>
                <TableHead className="text-right font-bold">העדפת אוכל</TableHead>
                <TableHead className="text-right font-bold">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium">{guest.name}</TableCell>
                    <TableCell>{guest.phone}</TableCell>
                    <TableCell>{guest.guests}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColorClass(guest.status)}`}>
                        {guest.status}
                      </span>
                    </TableCell>
                    <TableCell>{guest.food}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(guest)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(guest)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    לא נמצאו מוזמנים התואמים את החיפוש
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mobile card view */}
      {isMobile && (
        <div className="mt-4">
          {filteredGuests.length > 0 ? (
            filteredGuests.map(guest => renderGuestCard(guest))
          ) : (
            <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-md">
              לא נמצאו מוזמנים התואמים את החיפוש
            </div>
          )}
        </div>
      )}

      {/* Edit Guest Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">סגור</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-right">עריכת פרטי מוזמן</DialogTitle>
          </DialogHeader>
          {editingGuest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1">שם מלא</Label>
                <Input
                  value={editingGuest.name}
                  onChange={(e) => setEditingGuest({...editingGuest, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1">טלפון</Label>
                <Input
                  value={editingGuest.phone}
                  onChange={(e) => setEditingGuest({...editingGuest, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1">מספר אורחים</Label>
                <Input
                  type="number"
                  min="1"
                  value={editingGuest.guests}
                  onChange={(e) => setEditingGuest({...editingGuest, guests: parseInt(e.target.value) || 1})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right col-span-1">סטטוס</Label>
                <Select 
                  value={editingGuest.status}
                  onValueChange={(value) => setEditingGuest({...editingGuest, status: value})}
                >
                  <SelectTrigger className="col-span-3">
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
                  value={editingGuest.food}
                  onValueChange={(value) => setEditingGuest({...editingGuest, food: value})}
                >
                  <SelectTrigger className="col-span-3">
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
          )}
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>ביטול</Button>
            <Button onClick={handleSaveEdit} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
              שמור שינויים
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <p className="text-center">האם אתה בטוח שברצונך למחוק את {guestToDelete?.name} מרשימת המוזמנים?</p>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>ביטול</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
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
                onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                className="col-span-3"
                placeholder="הכנס שם מלא"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">טלפון</Label>
              <Input
                value={newGuest.phone}
                onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                className="col-span-3"
                placeholder="050-1234567"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">מספר אורחים</Label>
              <Input
                type="number"
                min="1"
                value={newGuest.guests}
                onChange={(e) => setNewGuest({...newGuest, guests: parseInt(e.target.value) || 1})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">סטטוס</Label>
              <Select 
                value={newGuest.status}
                onValueChange={(value) => setNewGuest({...newGuest, status: value})}
              >
                <SelectTrigger className="col-span-3">
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
                onValueChange={(value) => setNewGuest({...newGuest, food: value})}
              >
                <SelectTrigger className="col-span-3">
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
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>ביטול</Button>
            <Button onClick={handleAddGuest} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : null}
              הוסף מוזמן
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardGuests;
