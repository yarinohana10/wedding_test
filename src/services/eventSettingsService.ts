
import { supabase } from "@/integrations/supabase/client";

export interface EventSettings {
  id?: string;
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

// Fetch event settings
export const fetchEventSettings = async (): Promise<EventSettings | null> => {
  const { data, error } = await supabase
    .from('event_settings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No settings found, return null instead of throwing
      return null;
    }
    console.error("Error fetching event settings:", error);
    throw error;
  }

  return data;
};

// Save or update event settings
export const saveEventSettings = async (settings: Omit<EventSettings, 'id' | 'created_at' | 'updated_at'>): Promise<EventSettings> => {
  // Check if settings already exist
  const existingSettings = await fetchEventSettings();

  if (existingSettings) {
    // Update existing settings
    const { data, error } = await supabase
      .from('event_settings')
      .update(settings)
      .eq('id', existingSettings.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating event settings:", error);
      throw error;
    }

    return data;
  } else {
    // Create new settings
    const { data, error } = await supabase
      .from('event_settings')
      .insert([settings])
      .select()
      .single();

    if (error) {
      console.error("Error creating event settings:", error);
      throw error;
    }

    return data;
  }
};

// Update hero images
export const updateHeroImages = async (images: string[]): Promise<EventSettings> => {
  const existingSettings = await fetchEventSettings();

  if (!existingSettings) {
    throw new Error("Event settings not found");
  }

  const { data, error } = await supabase
    .from('event_settings')
    .update({ hero_images: images })
    .eq('id', existingSettings.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating hero images:", error);
    throw error;
  }

  return data;
};

// Upload a hero image to Supabase Storage and add it to event settings
export const uploadHeroImage = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Generate a unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `hero_${Date.now()}.${fileExt}`;
  const filePath = `hero/${fileName}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('wedding_photos')
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading hero image:", uploadError);
    throw uploadError;
  }

  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from('wedding_photos')
    .getPublicUrl(filePath);

  // Add to hero_images in event settings
  const existingSettings = await fetchEventSettings();
  
  if (existingSettings) {
    const heroImages = [...existingSettings.hero_images, publicUrlData.publicUrl];
    await updateHeroImages(heroImages);
  } else {
    // If no settings exist yet, we'll create them later when the full form is submitted
  }

  return publicUrlData.publicUrl;
};

// Remove a hero image
export const removeHeroImage = async (imageUrl: string): Promise<void> => {
  const existingSettings = await fetchEventSettings();

  if (!existingSettings) {
    throw new Error("Event settings not found");
  }

  // Update settings to remove the image
  const updatedHeroImages = existingSettings.hero_images.filter(img => img !== imageUrl);
  await updateHeroImages(updatedHeroImages);

  // Try to delete the file from storage if possible
  try {
    const storagePath = imageUrl.split('wedding_photos/')[1];
    if (storagePath) {
      await supabase.storage
        .from('wedding_photos')
        .remove([storagePath]);
    }
  } catch (error) {
    console.error("Error removing hero image from storage:", error);
    // We don't throw here because the image is already removed from settings
  }
};
