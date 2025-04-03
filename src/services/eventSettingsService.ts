
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
