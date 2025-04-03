
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export type PhotoCategory = "hero" | "gallery" | "couple" | "venue" | "other";

export interface Photo {
  id: string;
  path: string;
  category: PhotoCategory;
  description: string;
  featured: boolean;
  approved: boolean;
  rating: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches all photos from the database
 * @returns Array of photos
 */
export const fetchPhotos = async (): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase.from("photos").select("*");

    if (error) throw error;

    // Convert the database data to our Photo type
    return (data || []).map(photo => ({
      ...photo,
      category: photo.category as PhotoCategory
    }));
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
};

/**
 * Fetches photos by category
 * @param category The category to filter by
 * @returns Array of photos in the specified category
 */
export const fetchPhotosByCategory = async (
  category: PhotoCategory
): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("category", category);

    if (error) throw error;

    // Convert the database data to our Photo type
    return (data || []).map(photo => ({
      ...photo,
      category: photo.category as PhotoCategory
    }));
  } catch (error) {
    console.error(`Error fetching photos with category ${category}:`, error);
    return [];
  }
};

export interface NewPhoto extends Omit<Photo, "id" | "created_at" | "updated_at"> {
  file: File;
}

/**
 * Uploads a single photo to Supabase Storage and adds an entry to the photos table
 * @param newPhoto The photo object containing metadata and file
 * @returns The newly created photo object
 */
export const uploadPhoto = async (newPhoto: NewPhoto): Promise<Photo | null> => {
  try {
    const { file, ...photoMetadata } = newPhoto;
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${newPhoto.category}/${fileName}`;

    // 1. Upload the file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("wedding_photos")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from("wedding_photos")
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Create a database entry for the photo
    const photoData = {
      ...photoMetadata,
      path: publicUrl,
    };

    const { data: insertData, error: insertError } = await supabase
      .from("photos")
      .insert([photoData])
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      ...insertData,
      category: insertData.category as PhotoCategory
    };
  } catch (error) {
    console.error("Error uploading photo:", error);
    return null;
  }
};

/**
 * Updates a photo's metadata
 * @param id The photo ID
 * @param updates The updates to apply
 * @returns The updated photo
 */
export const updatePhoto = async (
  id: string,
  updates: Partial<Omit<Photo, "id" | "created_at" | "updated_at" | "path">>
): Promise<Photo | null> => {
  try {
    const { data, error } = await supabase
      .from("photos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      category: data.category as PhotoCategory
    };
  } catch (error) {
    console.error(`Error updating photo ${id}:`, error);
    return null;
  }
};

/**
 * Deletes a photo from both storage and the database
 * @param id The ID of the photo to delete
 * @param path The storage path of the photo
 * @returns Whether the deletion was successful
 */
export const deletePhoto = async (id: string): Promise<boolean> => {
  try {
    // First get the photo to extract the path
    const { data: photo, error: fetchError } = await supabase
      .from("photos")
      .select("path")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // The path in the database is the full URL, we need to extract the storage path
    // Example: https://supabase-url.storage.googleapis.com/wedding_photos/abc.jpg
    // We need: wedding_photos/abc.jpg
    let storagePath = "";
    if (photo?.path) {
      const url = new URL(photo.path);
      storagePath = url.pathname.split("/").slice(2).join("/");
    }

    // Delete from storage if we have a path
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("wedding_photos")
        .remove([storagePath]);

      if (storageError) {
        console.error("Failed to delete file from storage:", storageError);
        // Continue to delete from DB even if storage delete fails
      }
    }

    // Delete from database
    const { error } = await supabase.from("photos").delete().eq("id", id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error(`Error deleting photo ${id}:`, error);
    return false;
  }
};
