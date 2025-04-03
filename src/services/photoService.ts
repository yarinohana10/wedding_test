import { supabase } from "@/integrations/supabase/client";

export type PhotoCategory = "preCeremony" | "ceremony" | "reception";

export interface Photo {
  id: string;
  path: string;
  description: string | null;
  category: PhotoCategory;
  featured: boolean;
  approved: boolean;
  rating: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches photos by category from Supabase
 * @param category The category to fetch photos for
 * @returns Array of photos
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
 * Fetches all approved and featured photos
 * @returns Array of photos
 */
export const fetchFeaturedPhotos = async (): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("featured", true)
      .eq("approved", true)
      .order("rating", { ascending: false });

    if (error) throw error;

    return data as Photo[];
  } catch (error) {
    console.error("Error fetching featured photos:", error);
    return [];
  }
};

/**
 * Fetches all approved photos across all categories
 * @returns Array of photos
 */
export const fetchAllApprovedPhotos = async (): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data as Photo[];
  } catch (error) {
    console.error("Error fetching all photos:", error);
    return [];
  }
};

/**
 * Uploads a photo to Supabase
 * @param file The file to upload
 * @param category The category for the photo
 * @returns The uploaded photo object
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
      .upload(`gallery/${fileName}`, file);
    
    if (error) throw error;
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('wedding')
      .getPublicUrl(`gallery/${fileName}`);
    
    const path = publicUrlData.publicUrl;
    
    // Insert metadata into the photos table
    const photoData: Omit<Photo, "id" | "created_at" | "updated_at"> = {
      path,
      description: null,
      category,
      featured: false,
      approved: true,
      rating: 0
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
    // First get the photo to get the path
    const { data, error } = await supabase
      .from("photos")
      .select("path")
      .eq("id", photoId)
      .single();
    
    if (error) throw error;
    
    // Extract the file path from the URL
    const fileUrl = data.path;
    const filePath = fileUrl.split('/').slice(-2).join('/'); // Get 'gallery/filename.jpg'
    
    // Delete from photos table
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId);
    
    if (deleteError) throw deleteError;
    
    // Optionally delete the file from storage
    // This is commented out because we might want to keep the files
    // for historical purposes, or they might be referenced elsewhere
    /*
    const { error: storageError } = await supabase.storage
      .from('wedding')
      .remove([filePath]);
      
    if (storageError) {
      console.error("Error deleting file from storage:", storageError);
    }
    */
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
};

/**
 * Updates a photo's featured status
 * @param photoId The ID of the photo to update
 * @param featured Whether the photo should be featured
 */
export const togglePhotoFeatured = async (
  photoId: string,
  featured: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("photos")
      .update({ featured })
      .eq("id", photoId);
    
    if (error) throw error;
  } catch (error) {
    console.error("Error updating photo featured status:", error);
    throw error;
  }
};

/**
 * Fetches all photos for the admin dashboard
 * @returns Array of photos
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
    console.error("Error fetching all photos:", error);
    return [];
  }
};
