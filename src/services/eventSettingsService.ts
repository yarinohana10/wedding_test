
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/types/supabase";

export interface EventSettings {
  id: string;
  couple_name: string;
  event_date: string;
  venue: string;
  address: string;
  venue_coordinates: {
    lat: number;
    lng: number;
  };
  hero_images: string[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches the event settings from Supabase
 * @returns The event settings object
 */
export const fetchEventSettings = async (): Promise<EventSettings | null> => {
  try {
    const { data, error } = await supabase
      .from("event_settings")
      .select("*")
      .single();

    if (error) throw error;

    if (data) {
      // Convert Supabase JSON type to our expected types
      return {
        ...data,
        venue_coordinates: data.venue_coordinates as unknown as {
          lat: number;
          lng: number;
        },
        hero_images: data.hero_images as unknown as string[],
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching event settings:", error);
    return null;
  }
};

/**
 * Saves event settings to Supabase
 * @param settings The event settings to save
 * @returns The saved event settings
 */
export const saveEventSettings = async (
  settings: Omit<EventSettings, "id" | "created_at" | "updated_at">
): Promise<EventSettings | null> => {
  try {
    // Check if we have existing settings
    const { data: existingData, error: fetchError } = await supabase
      .from("event_settings")
      .select("id")
      .single();

    if (fetchError && !fetchError.message.includes("No rows found")) {
      throw fetchError;
    }

    let data;
    if (existingData) {
      // Update existing settings
      const { data: updatedData, error: updateError } = await supabase
        .from("event_settings")
        .update(settings)
        .eq("id", existingData.id)
        .select()
        .single();

      if (updateError) throw updateError;
      data = updatedData;
    } else {
      // Insert new settings
      const { data: insertedData, error: insertError } = await supabase
        .from("event_settings")
        .insert([settings])
        .select()
        .single();

      if (insertError) throw insertError;
      data = insertedData;
    }

    if (data) {
      // Convert Supabase JSON type to our expected types
      return {
        ...data,
        venue_coordinates: data.venue_coordinates as unknown as {
          lat: number;
          lng: number;
        },
        hero_images: data.hero_images as unknown as string[],
      };
    }

    return null;
  } catch (error) {
    console.error("Error saving event settings:", error);
    return null;
  }
};

/**
 * Updates the hero images for the event
 * @param imageUrls The array of image URLs to save
 * @returns The updated event settings
 */
export const updateHeroImages = async (
  imageUrls: string[]
): Promise<EventSettings | null> => {
  try {
    // First check if there are any event settings
    const currentSettings = await fetchEventSettings();

    if (!currentSettings) {
      console.error("No event settings found to update hero images");
      return null;
    }

    // Update the hero images
    const { data, error } = await supabase
      .from("event_settings")
      .update({ hero_images: imageUrls })
      .eq("id", currentSettings.id)
      .select()
      .single();

    if (error) throw error;

    if (data) {
      // Convert Supabase JSON type to our expected types
      return {
        ...data,
        venue_coordinates: data.venue_coordinates as unknown as {
          lat: number;
          lng: number;
        },
        hero_images: data.hero_images as unknown as string[],
      };
    }

    return null;
  } catch (error) {
    console.error("Error updating hero images:", error);
    return null;
  }
};

/**
 * Uploads a hero image and adds it to the event settings
 * @param file The file to upload
 * @returns The URL of the uploaded image
 */
export const uploadHeroImage = async (file: File): Promise<string> => {
  try {
    // Create a unique filename
    const fileName = `hero_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('wedding')
      .upload(`hero/${fileName}`, file);
    
    if (error) throw error;
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('wedding')
      .getPublicUrl(`hero/${fileName}`);
    
    const imageUrl = publicUrlData.publicUrl;
    
    // Fetch current hero images
    const currentSettings = await fetchEventSettings();
    const currentImages = currentSettings?.hero_images || [];
    
    // Add new image to array
    await updateHeroImages([...currentImages, imageUrl]);
    
    return imageUrl;
  } catch (error) {
    console.error("Error uploading hero image:", error);
    throw error;
  }
};

/**
 * Removes a hero image from the event settings
 * @param imageUrl The URL of the image to remove
 * @returns The updated event settings
 */
export const removeHeroImage = async (imageUrl: string): Promise<EventSettings | null> => {
  try {
    // Fetch current hero images
    const currentSettings = await fetchEventSettings();
    
    if (!currentSettings) {
      throw new Error("No event settings found");
    }
    
    // Remove the image from array
    const updatedImages = currentSettings.hero_images.filter(img => img !== imageUrl);
    
    // Update the hero images
    return await updateHeroImages(updatedImages);
    
    // Note: We're not actually deleting the file from storage
    // This would be a good enhancement for the future
  } catch (error) {
    console.error("Error removing hero image:", error);
    throw error;
  }
};
