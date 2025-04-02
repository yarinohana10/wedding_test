
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">תקנון האתר</h1>
            
            <div className="space-y-6 text-right">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. כללי</h2>
                <p>
                  ברוכים הבאים לאתר החתונה שלנו. אתר זה נועד לשימוש אישי בלבד של המוזמנים לחתונה. 
                  השימוש באתר זה מהווה הסכמה לתנאים המפורטים בתקנון זה.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">2. קניין רוחני</h2>
                <p>
                  כל התכנים באתר זה, לרבות טקסטים, תמונות, סרטונים, עיצובים, לוגו וכל חומר אחר, 
                  מוגנים בזכויות יוצרים ושייכים לבעלי האתר או לצדדים שלישיים שהעניקו רישיון שימוש בהם.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">3. העלאת תכנים</h2>
                <p>
                  אנו מאפשרים למוזמנים להעלות תמונות לאתר. בהעלאת תמונות, המשתמש מצהיר כי:
                </p>
                <ul className="list-disc mr-6 mt-2 space-y-1">
                  <li>הוא בעל זכויות היוצרים בתמונה או שקיבל אישור מבעל הזכויות להעלאתה</li>
                  <li>התמונה אינה פוגעת בפרטיות או בזכויות של אנשים המצולמים בה</li>
                  <li>התמונה אינה מכילה תוכן פוגעני, מיני, אלים או בלתי חוקי</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">4. אישור הגעה</h2>
                <p>
                  המידע שנמסר בטופס אישור ההגעה ישמש אך ורק לצורך ארגון האירוע ולא יועבר לגורמים שלישיים, 
                  למעט במקרים הנדרשים לארגון האירוע (כגון מנהלי האולם).
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">5. שינויים בתקנון</h2>
                <p>
                  בעלי האתר שומרים לעצמם את הזכות לשנות את התקנון בכל עת, לפי שיקול דעתם הבלעדי. 
                  שינויים בתקנון יכנסו לתוקף מיד עם פרסומם באתר.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-2">6. יצירת קשר</h2>
                <p>
                  לכל שאלה או בירור בנוגע לתקנון זה, ניתן ליצור קשר עם בעלי האתר באמצעות פרטי הקשר 
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

export default Terms;
