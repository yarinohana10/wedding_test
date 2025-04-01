
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Heart, CheckCircle2, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FormValues {
  fullName: string;
  phoneNumber: string;
  attending: string;
  guests: string;
  foodPreference: string;
}

const foodOptions = [
  { value: 'regular', label: 'רגיל' },
  { value: 'vegetarian', label: 'צמחוני' },
  { value: 'vegan', label: 'טבעוני' },
  { value: 'gluten-free', label: 'ללא גלוטן' },
];

const RsvpForm = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      attending: 'yes',
      guests: '1',
      foodPreference: 'regular',
    },
  });

  const attending = form.watch('attending');

  const onSubmit = (data: FormValues) => {
    console.log(data);
    
    // Here you would typically submit to your backend
    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: attending === 'yes' ? "אישור הגעה נשלח בהצלחה!" : "תודה על העדכון",
        description: attending === 'yes' 
          ? "תודה שאישרת את הגעתך לאירוע." 
          : "קיבלנו את הודעתך שלא תוכל להגיע. נתראה בשמחות אחרות!",
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md text-center max-w-md mx-auto animate-fade-in">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">תודה על העדכון!</h2>
        <p className="text-gray-600 mb-6">
          {attending === 'yes' 
            ? "אנו מצפים לראותך באירוע. פרטי האירוע ישלחו אליך בהודעת SMS." 
            : "קיבלנו את הודעתך שלא תוכל להגיע. נתראה בשמחות אחרות!"}
        </p>
        <Button 
          asChild
          className="bg-wedding-primary hover:bg-wedding-accent text-white flex items-center gap-2"
        >
          <Link to="/location">
            <Navigation className="h-4 w-4" />
            <span>ניווט למקום האירוע</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-md max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="divider-heart mb-4">
          <Heart className="text-wedding-primary" size={24} />
        </div>
        <h2 className="text-2xl font-bold mb-4">אישור השתתפות</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                message: "אנא הכנס מספר טלפון תקין (10 ספרות)"
              }
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
            name="attending"
            render={({ field }) => (
              <FormItem>
                <FormLabel>האם תגיע/י לאירוע?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר אפשרות" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">כן, אגיע</SelectItem>
                    <SelectItem value="no">לא אוכל להגיע</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {attending === 'yes' && (
            <>
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מספר אורחים</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר מספר אורחים" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר העדפת אוכל" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {foodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button 
            type="submit" 
            className="w-full bg-wedding-primary hover:bg-wedding-accent text-white"
          >
            {attending === 'yes' ? 'אישור הגעה' : 'שליחת תשובה'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RsvpForm;
