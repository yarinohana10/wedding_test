
import { supabase } from "@/integrations/supabase/client";

// Define the photo categories as a union type
export type PhotoCategory = "preCeremony" | "ceremony" | "reception" | "venue";

// Define the photo interface
export interface Photo {
  id: string;
  path: string;
  category: PhotoCategory;
  description?: string;
  featured: boolean;
  approved: boolean;
  rating: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches all photos from Supabase
 */
export const fetchPhotos = async (): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as Photo[];
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
};

/**
 * Fetches photos by category
 * @param category The category to filter by
 */
export const fetchPhotosByCategory = async (
  category: PhotoCategory
): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as Photo[];
  } catch (error) {
    console.error(`Error fetching ${category} photos:`, error);
    return [];
  }
};

/**
 * Fetches featured photos
 */
export const fetchFeaturedPhotos = async (): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as Photo[];
  } catch (error) {
    console.error("Error fetching featured photos:", error);
    return [];
  }
};

/**
 * Uploads a photo to Supabase Storage and adds it to the photos table
 * @param file The file to upload
 * @param category The photo category
 */
export const uploadPhoto = async (
  file: File,
  category: PhotoCategory
): Promise<Photo> => {
  try {
    // Create a unique filename
    const fileName = `${category}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('wedding')
      .upload(`photos/${fileName}`, file);
    
    if (error) throw error;
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('wedding')
      .getPublicUrl(`photos/${fileName}`);
    
    const photoUrl = publicUrlData.publicUrl;
    
    // Create a record in the photos table
    const photoData: Omit<Photo, "id" | "created_at" | "updated_at"> = {
      path: photoUrl,
      category,
      featured: false,
      approved: true,
      rating: 0,
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from("photos")
      .insert([photoData])
      .select()
      .single();
    
    if (insertError) throw insertError;
    
    return insertData as Photo;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

/**
 * Deletes a photo from Supabase
 * @param photoId The ID of the photo to delete
 */
export const deletePhoto = async (photoId: string): Promise<void> => {
  try {
    // First get the photo URL
    const { data, error: fetchError } = await supabase
      .from("photos")
      .select("path")
      .eq("id", photoId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete from photos table
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId);
    
    if (deleteError) throw deleteError;
    
    // Extract the file path from the URL to delete from storage
    // This assumes the URL is in the format: https://xxx.supabase.co/storage/v1/object/public/wedding/photos/filename
    // Skipping this step for now as it's complex to parse the URL correctly
    // To implement in the future
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
};

/**
 * Updates a photo's rating
 * @param photoId The ID of the photo
 * @param rating The new rating value
 */
export const ratePhoto = async (
  photoId: string,
  rating: number
): Promise<Photo> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .update({ rating })
      .eq("id", photoId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Photo;
  } catch (error) {
    console.error("Error updating photo rating:", error);
    throw error;
  }
};

/**
 * Toggles a photo's featured status
 * @param photoId The ID of the photo
 * @param featured The new featured status
 */
export const togglePhotoFeatured = async (
  photoId: string,
  featured: boolean
): Promise<Photo> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .update({ featured })
      .eq("id", photoId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Photo;
  } catch (error) {
    console.error("Error updating photo featured status:", error);
    throw error;
  }
};
