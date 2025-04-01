
import React, { useState } from 'react';
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
  UserMinus
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

// Sample guest data
const initialGuests = [
  { id: 1, name: "דניאל כהן", phone: "050-1234567", guests: 2, status: "אישר הגעה", food: "רגיל" },
  { id: 2, name: "מיכל לוי", phone: "052-7654321", guests: 1, status: "אישר הגעה", food: "צמחוני" },
  { id: 3, name: "יוסי אברהם", phone: "054-9876543", guests: 4, status: "טרם אישר", food: "-" },
  { id: 4, name: "רונית דוד", phone: "053-1472583", guests: 2, status: "אישר הגעה", food: "רגיל" },
  { id: 5, name: "אייל גולן", phone: "058-3698521", guests: 3, status: "טרם אישר", food: "-" },
  { id: 6, name: "שרה לוי", phone: "050-9876543", guests: 2, status: "לא מגיע", food: "-" },
  { id: 7, name: "דוד ישראלי", phone: "052-3456789", guests: 5, status: "אישר הגעה", food: "רגיל" },
  { id: 8, name: "נועה כהן", phone: "053-7891234", guests: 1, status: "טרם אישר", food: "-" },
];

interface Guest {
  id: number;
  name: string;
  phone: string;
  guests: number;
  status: string;
  food: string;
}

const DashboardGuests = () => {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // For the new guest form
  const [newGuest, setNewGuest] = useState<Omit<Guest, 'id'>>({
    name: "",
    phone: "",
    guests: 1,
    status: "טרם אישר",
    food: "-"
  });

  // Filter guests based on search term and status filter
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.includes(searchTerm) || 
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

  const confirmDelete = () => {
    if (guestToDelete) {
      setGuests(guests.filter(g => g.id !== guestToDelete.id));
      toast({
        title: "מוזמן נמחק",
        description: `${guestToDelete.name} הוסר מרשימת המוזמנים`,
      });
    }
    setIsDeleteDialogOpen(false);
    setGuestToDelete(null);
  };

  const handleSaveEdit = () => {
    if (editingGuest) {
      setGuests(guests.map(g => g.id === editingGuest.id ? editingGuest : g));
      toast({
        title: "מוזמן עודכן",
        description: `פרטי ${editingGuest.name} עודכנו בהצלחה`,
      });
    }
    setIsEditDialogOpen(false);
    setEditingGuest(null);
  };

  const handleAddGuest = () => {
    const newId = Math.max(...guests.map(g => g.id)) + 1;
    const guestToAdd = { ...newGuest, id: newId };
    setGuests([...guests, guestToAdd]);
    toast({
      title: "מוזמן נוסף",
      description: `${newGuest.name} נוסף לרשימת המוזמנים`,
    });
    setIsAddDialogOpen(false);
    setNewGuest({
      name: "",
      phone: "",
      guests: 1,
      status: "טרם אישר",
      food: "-"
    });
  };

  const exportToExcel = () => {
    // In a real app, this would generate and download an Excel file
    toast({
      title: "ייצוא לאקסל",
      description: "רשימת המוזמנים יוצאה לקובץ אקסל בהצלחה",
    });
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

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ניהול מוזמנים</h1>
        <p className="text-muted-foreground">
          רשימת המוזמנים לאירוע
        </p>
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
          <Button variant="outline" className="gap-2" onClick={exportToExcel}>
            <Download className="h-4 w-4" />
            <span>ייצוא לאקסל</span>
          </Button>
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
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
                  onChange={(e) => setEditingGuest({...editingGuest, guests: parseInt(e.target.value)})}
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
            <Button onClick={handleSaveEdit}>שמור שינויים</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Guest Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-right">מחיקת מוזמן</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center">האם אתה בטוח שברצונך למחוק את {guestToDelete?.name} מרשימת המוזמנים?</p>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>ביטול</Button>
            <Button variant="destructive" onClick={confirmDelete}>מחק</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Guest Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
                onChange={(e) => setNewGuest({...newGuest, guests: parseInt(e.target.value)})}
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
            <Button onClick={handleAddGuest}>הוסף מוזמן</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardGuests;
