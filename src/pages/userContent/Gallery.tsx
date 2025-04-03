
import React, { useState, useEffect } from "react";
import Navbar from "@/pages/Navbar";
import Footer from "@/pages/Footer";
import { fetchAllApprovedPhotos, fetchPhotosByCategory, type Photo, type PhotoCategory } from "@/services/photoService";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);
        let fetchedPhotos: Photo[] = [];

        if (activeTab === "all") {
          fetchedPhotos = await fetchAllApprovedPhotos();
        } else {
          fetchedPhotos = await fetchPhotosByCategory(activeTab as PhotoCategory);
        }

        setPhotos(fetchedPhotos);
        setError(null);
      } catch (err) {
        console.error("Error loading photos:", err);
        setError("אירעה שגיאה בטעינת התמונות. אנא נסה שוב מאוחר יותר.");
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto py-20 px-4 flex-grow">
        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold mb-4">גלריית תמונות</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            אוסף התמונות היפות ביותר מהאירוע שלנו. לחצו על תמונה להגדלה.
          </p>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="all" className="rounded-md py-2 px-4">
                כל התמונות
              </TabsTrigger>
              <TabsTrigger value="preCeremony" className="rounded-md py-2 px-4">
                לפני האירוע
              </TabsTrigger>
              <TabsTrigger value="ceremony" className="rounded-md py-2 px-4">
                חופה
              </TabsTrigger>
              <TabsTrigger value="reception" className="rounded-md py-2 px-4">
                חגיגה
              </TabsTrigger>
            </TabsList>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wedding-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : photos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">
                אין תמונות עדיין בקטגוריה זו.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.path}
                      alt={photo.description || "תמונת חתונה"}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {photo.description && (
                    <div className="p-3 text-center">
                      <p className="text-gray-700">{photo.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
