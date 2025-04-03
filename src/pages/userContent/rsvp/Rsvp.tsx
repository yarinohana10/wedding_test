import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { WeddingData } from "@/pages/Index";
import { CheckCircle2, Heart } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import WeddingInfo from "./WeddingInfo";
import RsvpForm from "./RsvpForm";

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
interface RsvpProps {
  weddingData: WeddingData;
}
const Rsvp = ({ weddingData }: RsvpProps) => {
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
      <WeddingInfo weddingData={weddingData} />
      <RsvpForm />
    </div>
  );
};

export default Rsvp;
