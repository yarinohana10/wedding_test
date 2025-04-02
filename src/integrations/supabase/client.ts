
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dbwyevnpwriumspqlujk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3lldm5wd3JpdW1zcHFsdWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTA1OTQsImV4cCI6MjA1OTA4NjU5NH0.dDCB2tG6ZtagvjvIlWmf9GUoYLaK28ZaGuRD4rrMseU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Function to save settings to Supabase
export const saveEventSettings = async (settings: any) => {
  try {
    const { data, error } = await supabase
      .from('event_settings')
      .upsert({ 
        id: 1, // Using a fixed ID for the single event
        settings: settings
      })
      .select();
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, error };
  }
};

// Function to get event settings from Supabase
export const getEventSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('event_settings')
      .select('*')
      .eq('id', 1)
      .single();
      
    if (error) throw error;
    return { success: true, data: data?.settings || {} };
  } catch (error) {
    console.error('Error getting settings:', error);
    return { success: false, error, data: {} };
  }
};

// Function to save gallery images metadata
export const saveGalleryImages = async (images: any[]) => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .upsert(
        images.map(img => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          category: img.category,
          featured: img.featured,
          rating: img.rating || 0,
          approved: img.approved !== undefined ? img.approved : true
        })),
        { onConflict: 'id' }
      )
      .select();
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving gallery images:', error);
    return { success: false, error };
  }
};

// Function to get gallery images
export const getGalleryImages = async () => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('rating', { ascending: false });
      
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error getting gallery images:', error);
    return { success: false, error, data: [] };
  }
};

// Function to get top images for carousel
export const getTopImagesForCarousel = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('featured', true)
      .eq('approved', true)
      .order('rating', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error getting top images:', error);
    return { success: false, error, data: [] };
  }
};
