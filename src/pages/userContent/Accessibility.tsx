
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Accessibility = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">הצהרת נגישות</h1>
            
            <div className="space-y-6 text-right">
              <section>
                <h2 className="text-xl font-semibold mb-2">מבוא</h2>
                <p>
                  אתר זה נבנה תוך שימת דגש על נגישות לאנשים עם מוגבלויות, 
                  מתוך אמונה כי לכל אדם הזכות לחיות בשוויון, בכבוד ובמיצוי הפוטנציאל שלו.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">התאמות נגישות באתר</h2>
                <p>האתר כולל התאמות נגישות הבאות:</p>
                <ul className="list-disc mr-6 mt-2 space-y-1">
                  <li>תמיכה בשינוי גודל הטקסט באמצעות דפדפן</li>
                  <li>ניגודיות צבעים מותאמת</li>
                  <li>תיאורי תמונות (alt text) לקוראי מסך</li>
                  <li>ניווט פשוט וברור</li>
                  <li>תמיכה בניווט מקלדת</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">הנגשת האירוע הפיזי</h2>
                <p>
                  האולם בו מתקיים האירוע הינו נגיש לאנשים עם מוגבלויות. פרטים נוספים על נגישות האולם 
                  ניתן למצוא בעמוד פרטי האירוע או ליצור קשר ישירות עם הזוג.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">יצירת קשר בנושא נגישות</h2>
                <p>
                  במידה ונתקלתם בבעיית נגישות באתר, או שיש לכם בקשות מיוחדות בנושא נגישות באירוע, 
                  אנא פנו אלינו באמצעות פרטי הקשר המופיעים באתר. אנו מתחייבים לעשות כל מאמץ 
                  כדי להנגיש את האירוע והאתר לכל המוזמנים.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">אישור נגישות</h2>
                <p>
                  אנו פועלים לעמידה בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות 
                  (התאמות נגישות לשירות), תשע"ג-2013 במסגרת האפשרויות הטכנולוגיות הקיימות.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">עדכון אחרון</h2>
                <p>
                  הצהרת נגישות זו עודכנה לאחרונה בתאריך: 12 באפריל 2023
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Accessibility;
