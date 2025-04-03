
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Photo category types
export type PhotoCategory = "preCeremony" | "ceremony" | "reception";

// Photo metadata interface
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

// Fetch all photos
export const fetchPhotos = async (): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching photos:", error);
    throw error;
  }

  return data || [];
};

// Fetch photos by category
export const fetchPhotosByCategory = async (category: PhotoCategory): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${category} photos:`, error);
    throw error;
  }

  return data || [];
};

// Fetch featured photos
export const fetchFeaturedPhotos = async (limit = 10): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('featured', true)
    .eq('approved', true)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured photos:", error);
    throw error;
  }

  return data || [];
};

// Upload a photo to Supabase Storage
export const uploadPhoto = async (file: File, category: PhotoCategory, description?: string): Promise<Photo> => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Generate a unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${category}/${fileName}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('wedding_photos')
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    throw uploadError;
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('wedding_photos')
    .getPublicUrl(filePath);

  // Save metadata to database
  const photoData: Omit<Photo, 'id' | 'created_at' | 'updated_at'> = {
    path: publicUrlData.publicUrl,
    category,
    description: description || '',
    featured: false,
    approved: true,
    rating: 0
  };

  const { data, error } = await supabase
    .from('photos')
    .insert([photoData])
    .select()
    .single();

  if (error) {
    console.error("Error saving photo metadata:", error);
    // Try to delete the uploaded file if metadata save fails
    await supabase.storage.from('wedding_photos').remove([filePath]);
    throw error;
  }

  return data;
};

// Update photo metadata
export const updatePhoto = async (id: string, updates: Partial<Photo>): Promise<Photo> => {
  const { data, error } = await supabase
    .from('photos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating photo:", error);
    throw error;
  }

  return data;
};

// Toggle photo featured status
export const togglePhotoFeatured = async (id: string, featured: boolean): Promise<Photo> => {
  return updatePhoto(id, { featured });
};

// Rate a photo
export const ratePhoto = async (id: string, rating: number): Promise<Photo> => {
  return updatePhoto(id, { rating });
};

// Delete a photo
export const deletePhoto = async (id: string): Promise<void> => {
  // First get the photo to get its path
  const { data: photo, error: fetchError } = await supabase
    .from('photos')
    .select('path')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error("Error fetching photo for deletion:", fetchError);
    throw fetchError;
  }

  if (!photo) {
    throw new Error("Photo not found");
  }

  // Extract the storage path from the public URL
  const storagePath = photo.path.split('wedding_photos/')[1];

  // Delete from database
  const { error: deleteError } = await supabase
    .from('photos')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error("Error deleting photo metadata:", deleteError);
    throw deleteError;
  }

  // Delete from storage
  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from('wedding_photos')
      .remove([storagePath]);

    if (storageError) {
      console.error("Error deleting photo file:", storageError);
      // We don't throw here because the metadata is already deleted
      // and the file might still be accessible, but orphaned
    }
  }
};
