
import { WeddingData } from "@/pages/Index";
import { Heart } from "lucide-react";
import WeddingInfo from "./WeddingInfo";
import RsvpForm from "./RsvpForm";

interface RsvpProps {
  weddingData: WeddingData;
}

const Rsvp = ({ weddingData }: RsvpProps) => {
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
