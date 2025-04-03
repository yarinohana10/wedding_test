
import React from 'react';
import Navbar from '@/pages/Navbar';
import Footer from '@/pages/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">מדיניות פרטיות</h1>
            
            <div className="space-y-6 text-right">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. איסוף מידע</h2>
                <p>
                  בעת השימוש באתר זה, אנו אוספים מידע אישי כגון שם, מספר טלפון ופרטי הגעה לאירוע. 
                  בנוסף, אנו אוספים מידע על התנהגות המשתמש באתר באמצעות קובצי עוגיות (Cookies).
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">2. שימוש במידע</h2>
                <p>
                  המידע שנאסף משמש לצורך:
                </p>
                <ul className="list-disc mr-6 mt-2 space-y-1">
                  <li>ארגון האירוע וניהול המוזמנים</li>
                  <li>יצירת קשר עם המוזמנים לפני ואחרי האירוע</li>
                  <li>שיפור השירות והחוויה באתר</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">3. שיתוף מידע</h2>
                <p>
                  אנו לא משתפים את המידע האישי של המשתמשים עם צדדים שלישיים, למעט במקרים הבאים:
                </p>
                <ul className="list-disc mr-6 mt-2 space-y-1">
                  <li>ספקי שירות הקשורים לארגון האירוע (כגון מנהלי האולם, קייטרינג)</li>
                  <li>במקרים שבהם נדרש על פי חוק</li>
                  <li>בהסכמת המשתמש</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">4. אבטחת מידע</h2>
                <p>
                  אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע האישי שנאסף. 
                  עם זאת, לא ניתן להבטיח אבטחה מוחלטת בעת העברת מידע ברשת האינטרנט.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">5. זכויות המשתמש</h2>
                <p>
                  למשתמש יש זכות לבקש עיון במידע האישי שנאסף עליו, לבקש את תיקונו או מחיקתו. 
                  לביצוע פעולות אלה, ניתן לפנות אלינו באמצעות פרטי הקשר המופיעים באתר.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">6. שינויים במדיניות הפרטיות</h2>
                <p>
                  אנו שומרים לעצמנו את הזכות לשנות את מדיניות הפרטיות בכל עת. 
                  שינויים במדיניות יכנסו לתוקף מיד עם פרסומם באתר.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">7. יצירת קשר</h2>
                <p>
                  בכל שאלה או בקשה בנוגע למדיניות הפרטיות, ניתן ליצור קשר באמצעות פרטי הקשר 
                  המופיעים בדף "צור קשר".
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

export default Privacy;
