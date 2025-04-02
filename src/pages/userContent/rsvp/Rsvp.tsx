import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { weddingData } from "@/pages/Index";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  MapPin,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import WeddingInfo from "./WeddingInfo";

interface FormValues {
  fullName: string;
  phoneNumber: string;
  attending: string;
  guests: string;
  customGuests?: string;
  foodPreference: string;
}

const foodOptions = [
  { value: "regular", label: "רגיל" },
  { value: "vegetarian", label: "צמחוני" },
  { value: "vegan", label: "טבעוני" },
  { value: "gluten-free", label: "ללא גלוטן" },
];

const Rsvp = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      attending: "",
      guests: "1",
      customGuests: "",
      foodPreference: "regular",
    },
  });

  const attending = form.watch("attending");
  const guests = form.watch("guests");

  const onSubmit = (data: FormValues) => {
    console.log(data);

    // Here you would typically submit to your backend
    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setIsSubmitted(true);
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
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl p-8 m-8 shadow-md text-center max-w-md mx-auto animate-fade-in text-right">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">תודה על העדכון!</h2>
        <p className="text-gray-600 mb-6">
          {attending === "yes"
            ? "אנו מצפים לראותך באירוע. פרטי האירוע ישלחו אליך בהודעת SMS."
            : "קיבלנו את הודעתך שלא תוכל להגיע. נתראה בשמחות אחרות!"}
        </p>
        <Button
          onClick={() =>
            attending === "yes" ? navigate("/location") : navigate("/gallery")
          }
          className="bg-wedding-primary hover:bg-wedding-accent text-white flex items-center gap-3 min-w-48 mx-auto py-6 text-lg"
        >
          {attending === "yes" ? (
            <>
              <span>ניווט למקום האירוע</span>
            </>
          ) : (
            <>
              <span>צפה בגלריה</span>
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div id="rsvp" className="bg-white rounded-xl p-8 m-8 shadow-xl ">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-4">אישור הזמנה</h2>
        <div className="divider-heart mb-4">
          <Heart
            className="text-wedding-primary"
            size={24}
            fill="currentColor"
          />
        </div>
      </div>
      <WeddingInfo />

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
                  <Input placeholder="ישראל ישראלי" {...field} />
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
                  <Input placeholder="0501234567" {...field} />
                </FormControl>
                <FormDescription>
                  לשליחת פרטי האירוע והודעות תזכורת
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>מספר אורחים</FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-4">
                    <RadioGroup
                      defaultValue={field.value}
                      className="flex justify-end gap-5"
                      onValueChange={(val) => {
                        field.onChange(val);
                        if (val !== "custom") {
                          form.setValue("customGuests", "");
                        }
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <FormItem key={num} className="flex gap-1 items-center">
                          <FormControl>
                            <RadioGroupItem
                              value={num.toString()}
                              id={`guests-${num}`}
                            />
                          </FormControl>
                          <FormLabel
                            className="font-normal  cursor-pointer "
                            htmlFor={`guests-${num}`}
                          >
                            {num}
                          </FormLabel>
                        </FormItem>
                      ))}
                      <FormItem className="flex gap-1 items-center">
                        <FormControl>
                          <RadioGroupItem value="custom" id="guests-custom" />
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
                                min="6"
                                type="number"
                                className="w-full"
                                placeholder="הזן מספר אורחים"
                                {...field}
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
                    className="flex justify-end gap-5"
                  >
                    {foodOptions.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex gap-1 items-center"
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

          <div className="pt-4">
            <p className="text-center mb-4 font-medium">
              האם תוכל/י להגיע לאירוע?
            </p>
            <div className="flex gap-4 w-full flex-wrap">
              <Button
                type="submit"
                className="w-full bg-gray-400 hover:bg-wedding-accent text-white min-w-40 py-6 text-lg"
                onClick={() => {
                  form.setValue("attending", "no");
                  setTimeout(() => {
                    form.handleSubmit(onSubmit)();
                  }, 100);
                }}
              >
                <ThumbsDown size={18} />
                <span>לא אוכל להגיע</span>
              </Button>
              <Button
                type="submit"
                onClick={() => form.setValue("attending", "yes")}
                className="w-full bg-wedding-primary hover:bg-wedding-accent text-white min-w-40 py-6 text-lg"
              >
                <ThumbsUp size={18} />
                אישור הגעה
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Rsvp;
