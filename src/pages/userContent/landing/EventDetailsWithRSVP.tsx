import React, { useState, useEffect } from "react";
import { MapPin, Clock, Calendar, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { CheckCircle2, ThumbsUp, ThumbsDown } from "lucide-react";

interface EventDetailsWithRSVPProps {
  venue: string;
  address: string;
  date: string;
  time: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Guest {
  id: string;
  name: string;
  phone: string;
  guests: number;
  status: string;
  food: string;
}

interface FormValues {
  fullName: string;
  phoneNumber: string;
  attending: string;
  guests: string;
  customGuests?: string;
  foodPreference: string;
}

const foodOptions = [
  { value: "רגיל", label: "רגיל" },
  { value: "צמחוני", label: "צמחוני" },
  { value: "טבעוני", label: "טבעוני" },
  { value: "ללא גלוטן", label: "ללא גלוטן" },
];

const EventDetailsWithRSVP: React.FC<EventDetailsWithRSVPProps> = ({
  venue,
  address,
  date,
  time,
  coordinates,
}) => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupPhone, setLookupPhone] = useState("");
  const [existingGuest, setExistingGuest] = useState<Guest | null>(null);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      fullName: existingGuest?.name || "",
      phoneNumber: existingGuest?.phone || "",
      attending:
        existingGuest?.status === "אישר הגעה"
          ? "yes"
          : existingGuest?.status === "לא מגיע"
          ? "no"
          : "",
      guests: existingGuest?.guests ? existingGuest.guests.toString() : "1",
      customGuests: "",
      foodPreference: existingGuest?.food || "רגיל",
    },
  });

  useEffect(() => {
    if (existingGuest) {
      form.reset({
        fullName: existingGuest.name,
        phoneNumber: existingGuest.phone,
        attending:
          existingGuest.status === "אישר הגעה"
            ? "yes"
            : existingGuest.status === "לא מגיע"
            ? "no"
            : "",
        guests: existingGuest.guests.toString(),
        foodPreference: existingGuest.food,
      });
    }
  }, [existingGuest, form]);

  const attending = form.watch("attending");
  const guests = form.watch("guests");

  // Function to create Google Calendar link
  const createGoogleCalendarLink = () => {
    // Convert event date to ISO format for Google link
    const eventDate = new Date();
    eventDate.setMonth(eventDate.getMonth() + 1); // One month from now
    eventDate.setHours(19, 0, 0, 0);

    const endDate = new Date(eventDate);
    endDate.setHours(23, 59, 0);

    const startTimeISO = eventDate.toISOString().replace(/-|:|\.\d+/g, "");
    const endTimeISO = endDate.toISOString().replace(/-|:|\.\d+/g, "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=חתונה%20של%20דנה%20ויוסי&dates=${startTimeISO}/${endTimeISO}&details=אנחנו%20מתחתנים!%20נשמח%20לראותכם%20בשמחתנו.&location=${encodeURIComponent(
      address
    )}&ctz=Asia/Jerusalem`;
  };

  const lookupGuestByPhone = async () => {
    if (!lookupPhone || lookupPhone.length < 9) {
      toast({
        title: "מספר טלפון לא תקין",
        description: "אנא הכנס מספר טלפון תקין",
        variant: "destructive",
      });
      return;
    }

    setIsLookingUp(true);

    try {
      const { data, error } = (await supabase
        .from("guests")
        .select("*")
        .eq("phone", lookupPhone)
        .single()) as { data: Guest | null; error: Error | null };

      if (error) {
        if (error.message.includes("No rows found")) {
          toast({
            title: "לא נמצא מוזמן",
            description: "לא נמצא מוזמן עם מספר הטלפון שהוזן, אנא מלא את הטופס",
            variant: "default",
          });
          setExistingGuest(null);
          setShowForm(true);
          form.setValue("phoneNumber", lookupPhone);
        } else {
          throw error;
        }
      } else if (data) {
        setExistingGuest(data);
        setShowForm(true);
        toast({
          title: "מוזמן נמצא!",
          description: `שלום ${data.name}, אנא עדכן את פרטיך`,
        });
      }
    } catch (err: any) {
      console.error("Error looking up guest:", err);
      toast({
        title: "שגיאה בחיפוש",
        description: err.message || "אירעה שגיאה בעת חיפוש המוזמן",
        variant: "destructive",
      });
    } finally {
      setIsLookingUp(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);

    const guestData = {
      name: data.fullName,
      phone: data.phoneNumber,
      guests:
        data.guests === "custom"
          ? Number(data.customGuests)
          : Number(data.guests),
      status: data.attending === "yes" ? "אישר הגעה" : "לא מגיע",
      food: data.attending === "yes" ? data.foodPreference : "-",
    };

    try {
      if (existingGuest) {
        // Update existing guest
        const { error } = (await supabase
          .from("guests")
          .update(guestData)
          .eq("phone", data.phoneNumber)) as { error: Error | null };

        if (error) throw error;

        toast({
          title: "פרטים עודכנו בהצלחה!",
          description:
            data.attending === "yes"
              ? "תודה שאישרת את הגעתך לאירוע."
              : "קיבלנו את הודעתך שלא תוכל להגיע. נתראה בשמחות אחרות!",
        });
      } else {
        // Add new guest
        const { error } = (await supabase
          .from("guests")
          .insert([guestData])) as { error: Error | null };

        if (error) throw error;

        toast({
          title:
            data.attending === "yes"
              ? "אישור הגעה נשלח בהצלחה!"
              : "תודה על העדכון",
          description:
            data.attending === "yes"
              ? "תודה שאישרת את הגעתך לאירוע."
              : "קיבלנו את הודעתך שלא תוכל להגיע. נתראה בשמחות אחרות!",
        });
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting RSVP:", err);
      toast({
        title: "שגיאה בשליחת הטופס",
        description: err.message || "אירעה שגיאה בעת שליחת הטופס",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEventDetails = () => (
    <div className="space-y-6 md:w-full lg:w-1/2">
      <div className="flex items-start p-5 bg-white rounded-lg shadow-md border border-wedding-primary/20 transition-transform hover:scale-[1.02]">
        <div>
          <p className="font-bold text-lg text-wedding-dark">{venue}</p>
          <p className="text-gray-600">{address}</p>
        </div>
        <MapPin
          className="text-wedding-primary mr-3 mt-1 flex-shrink-0"
          size={24}
        />
      </div>

      <div className="flex items-start p-5 bg-white rounded-lg shadow-md border border-wedding-primary/20 transition-transform hover:scale-[1.02]">
        <div>
          <p className="font-bold text-lg text-wedding-dark">תאריך האירוע</p>
          <p className="text-gray-600 mb-3">{date}</p>
          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-wedding-primary text-white hover:bg-wedding-accent transition-colors"
              onClick={() => window.open(createGoogleCalendarLink(), "_blank")}
            >
              <span className="ml-2">הוסף ליומן</span>
            </Button>
          </div>
        </div>
        <Calendar
          className="text-wedding-primary mr-3 mt-1 flex-shrink-0"
          size={24}
        />
      </div>

      <div className="flex items-start p-5 bg-white rounded-lg shadow-md border border-wedding-primary/20 transition-transform hover:scale-[1.02]">
        <div>
          <p className="font-bold text-lg text-wedding-dark">שעה</p>
          <div className="flex flex-col">
            <p className="text-gray-600">קבלת פנים: {time}</p>
            <p className="text-gray-600">חופה: 20:00</p>
          </div>
        </div>
        <Clock
          className="text-wedding-primary mr-3 mt-1 flex-shrink-0"
          size={24}
        />
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="rounded-xl overflow-hidden shadow-lg md:w-full lg:w-1/2 h-[300px] mt-6 lg:mt-0">
      <div className="h-full bg-gray-200 relative">
        <iframe
          src={`https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=15&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="מפת האירוע"
          className="w-full h-full"
        ></iframe>
      </div>

      <div className="bg-wedding-light p-4 flex justify-center space-x-4 space-x-reverse">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-wedding-dark border-wedding-primary hover:bg-wedding-primary/10"
          onClick={() =>
            window.open(
              `https://waze.com/ul?ll=${coordinates.lat},${coordinates.lng}&navigate=yes`,
              "_blank"
            )
          }
        >
          <span>נווט עם Waze</span>
          <img
            src="https://www.waze.com/favicon.ico"
            alt="Waze"
            className="w-5 h-5 mr-1"
          />
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 text-wedding-dark border-wedding-primary hover:bg-wedding-primary/10"
          onClick={() =>
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`,
              "_blank"
            )
          }
        >
          <span>נווט עם Google Maps</span>
          <img
            src="https://maps.google.com/favicon.ico"
            alt="Google Maps"
            className="w-5 h-5 mr-1"
          />
        </Button>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md text-center max-w-md mx-auto animate-fade-in text-right">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">תודה על העדכון!</h2>
        <p className="text-gray-600 mb-6">
          {attending === "yes"
            ? "אנו מצפים לראותך באירוע. פרטי האירוע ישלחו אליך בהודעת SMS."
            : "קיבלנו את הודעתך שלא תוכל להגיע. נתראה בשמחות אחרות!"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-wedding-primary hover:bg-wedding-accent text-white flex items-center gap-3 py-6 text-lg"
          >
            <span>חזור לפרטי האירוע</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mx-auto overflow-hidden">
      <div className="flex items-center justify-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-wedding-dark">
          פרטי האירוע
        </h2>
        <Heart
          className="text-wedding-primary mr-2"
          size={28}
          fill="currentColor"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {renderEventDetails()}
        {renderMap()}
      </div>

      {/* RSVP Form */}
      <div className="mt-12 border-t pt-8 text-right">
        <div className="text-center mb-6">
          <div className="divider-heart mb-4">
            <Heart
              className="text-wedding-primary mx-auto"
              size={24}
              fill="currentColor"
            />
          </div>
          <h2 className="text-2xl font-bold mb-1">אישור השתתפות</h2>
          <p className="text-gray-600">נשמח לדעת האם תוכלו להגיע לאירוע שלנו</p>
        </div>

        {!showForm ? (
          <div className="max-w-md mx-auto">
            <div className="mb-8 text-center">
              <p className="mb-4">
                הזן את מספר הטלפון שלך כדי לעדכן את סטטוס ההשתתפות שלך:
              </p>
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="הכנס מספר טלפון"
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  className="text-right"
                />
                <Button
                  onClick={lookupGuestByPhone}
                  disabled={isLookingUp}
                  className="bg-wedding-primary hover:bg-wedding-accent text-white"
                >
                  {isLookingUp ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "המשך"
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 text-right"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  rules={{ required: "שדה חובה" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם מלא</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ישראל ישראלי"
                          {...field}
                          className="text-right"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  rules={{
                    required: "שדה חובה",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "אנא הכנס מספר טלפון תקין (10 ספרות)",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>מספר טלפון</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0501234567"
                          {...field}
                          className="text-right"
                        />
                      </FormControl>
                      <FormDescription>
                        לשליחת פרטי האירוע והודעות תזכורת
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {attending === "" && (
                  <div className="pt-4">
                    <p className="text-center mb-4 font-medium">
                      האם תוכל/י להגיע לאירוע?
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        type="button"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-3 py-6"
                        onClick={() => form.setValue("attending", "yes")}
                      >
                        <ThumbsUp size={18} className="ml-2" />
                        <span>אגיע בשמחה</span>
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center gap-3 py-6"
                        onClick={() => {
                          form.setValue("attending", "no");
                          setTimeout(() => {
                            form.handleSubmit(onSubmit)();
                          }, 100);
                        }}
                      >
                        <ThumbsDown size={18} className="ml-2" />
                        <span>לא אוכל להגיע</span>
                      </Button>
                    </div>
                  </div>
                )}

                {attending === "yes" && (
                  <>
                    <FormField
                      control={form.control}
                      name="guests"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>מספר אורחים</FormLabel>
                          <FormControl>
                            <div>
                              <RadioGroup
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  if (val !== "custom") {
                                    form.setValue("customGuests", "");
                                  }
                                }}
                                defaultValue={field.value}
                                className="flex flex-wrap gap-2 pt-2"
                              >
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <FormItem
                                    key={num}
                                    className="flex items-center space-x-2 space-x-reverse"
                                  >
                                    <FormControl>
                                      <RadioGroupItem
                                        value={num.toString()}
                                        id={`guests-${num}`}
                                      />
                                    </FormControl>
                                    <FormLabel
                                      className="font-normal cursor-pointer mr-2"
                                      htmlFor={`guests-${num}`}
                                    >
                                      {num}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                                <FormItem className="flex items-center space-x-2 space-x-reverse">
                                  <FormControl>
                                    <RadioGroupItem
                                      value="custom"
                                      id="guests-custom"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className="font-normal cursor-pointer mr-2"
                                    htmlFor="guests-custom"
                                  >
                                    יותר מ-5
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>

                              {field.value === "custom" && (
                                <FormField
                                  control={form.control}
                                  name="customGuests"
                                  rules={{
                                    required: "יש להזין מספר אורחים",
                                    pattern: {
                                      value: /^[0-9]+$/,
                                      message: "יש להזין מספר בלבד",
                                    },
                                  }}
                                  render={({ field }) => (
                                    <FormItem className="mt-2">
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min="6"
                                          placeholder="הזן מספר אורחים"
                                          {...field}
                                          className="w-full text-right"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="foodPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>העדפות אוכל</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1 pt-1"
                            >
                              {foodOptions.map((option) => (
                                <FormItem
                                  key={option.value}
                                  className="flex items-center space-x-2 space-x-reverse"
                                >
                                  <FormControl>
                                    <RadioGroupItem
                                      value={option.value}
                                      id={`food-${option.value}`}
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className="font-normal cursor-pointer mr-2"
                                    htmlFor={`food-${option.value}`}
                                  >
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="submit"
                        className="bg-wedding-primary hover:bg-wedding-accent text-white min-w-40 py-6 text-lg"
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Loader2 className="h-4 w-4 animate-spin ml-2" />
                        )}
                        אישור הגעה
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsWithRSVP;
