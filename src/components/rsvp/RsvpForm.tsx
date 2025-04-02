
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from 'react-hook-form';
import { Heart, CheckCircle2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface FormValues {
  fullName: string;
  phoneNumber: string;
  attending: string;
  guests: string;
  customGuests?: string;
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
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      attending: '',
      guests: '1',
      customGuests: '',
      foodPreference: 'regular',
    },
  });

  const attending = form.watch('attending');
  const guests = form.watch('guests');

  const onSubmit = (data: FormValues) => {
    console.log(data);
    
    // Here you would typically submit to your backend
    // For now, we'll simulate a successful submission
    setTimeout(() => {
      setIsSubmitted(true);
      toast({
        title: data.attending === 'yes' ? "אישור הגעה נשלח בהצלחה!" : "תודה על העדכון",
        description: data.attending === 'yes' 
          ? "תודה שאישרת את הגעתך לאירוע." 
          : "קיבלנו את הודעתך שלא תוכל להגיע. נתראה בשמחות אחרות!",
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-md text-center max-w-md mx-auto animate-fade-in text-right">
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
          onClick={() => attending === 'yes' ? navigate('/location') : navigate('/gallery')}
          className="bg-wedding-primary hover:bg-wedding-accent text-white flex items-center gap-3 min-w-48 mx-auto py-6 text-lg"
        >
          {attending === 'yes' ? (
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
    <div className="bg-white rounded-xl p-8 shadow-md max-w-md mx-auto text-right">
      <div className="text-center mb-6">
        <div className="divider-heart mb-4">
          <Heart className="text-wedding-primary" size={24} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold mb-4">אישור השתתפות</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-right">
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

          {attending === '' && (
            <div className="pt-4">
              <p className="text-center mb-4 font-medium">האם תוכל/י להגיע לאירוע?</p>
              <div className="flex gap-4 justify-center">
                <Button
                  type="button"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-3 py-6"
                  onClick={() => form.setValue('attending', 'yes')}
                >
                  <ThumbsUp size={18} className="ml-2" />
                  <span>אגיע בשמחה</span>
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white flex items-center justify-center gap-3 py-6"
                  onClick={() => {
                    form.setValue('attending', 'no');
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

          {attending === 'yes' && (
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
                            if (val !== 'custom') {
                              form.setValue('customGuests', '');
                            }
                          }}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-2 pt-2"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <FormItem key={num} className="flex items-center space-x-2 space-x-reverse">
                              <FormControl>
                                <RadioGroupItem value={num.toString()} id={`guests-${num}`} />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer mr-2" htmlFor={`guests-${num}`}>
                                {num}
                              </FormLabel>
                            </FormItem>
                          ))}
                          <FormItem className="flex items-center space-x-2 space-x-reverse">
                            <FormControl>
                              <RadioGroupItem value="custom" id="guests-custom" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer mr-2" htmlFor="guests-custom">
                              יותר מ-5
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                        
                        {field.value === 'custom' && (
                          <FormField
                            control={form.control}
                            name="customGuests"
                            rules={{ 
                              required: "יש להזין מספר אורחים", 
                              pattern: { 
                                value: /^[0-9]+$/, 
                                message: "יש להזין מספר בלבד" 
                              } 
                            }}
                            render={({ field }) => (
                              <FormItem className="mt-2">
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="6"
                                    placeholder="הזן מספר אורחים" 
                                    {...field}
                                    className="w-full"
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
                          <FormItem key={option.value} className="flex items-center space-x-2 space-x-reverse">
                            <FormControl>
                              <RadioGroupItem value={option.value} id={`food-${option.value}`} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer mr-2" htmlFor={`food-${option.value}`}>
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
                >
                  אישור הגעה
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
};

export default RsvpForm;
