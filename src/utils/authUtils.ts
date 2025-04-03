
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

/**
 * Checks if the user is authenticated
 * @returns True if the user is authenticated, false otherwise
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
};

/**
 * Gets the current authenticated user
 * @returns The user object or null if not authenticated
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

/**
 * Signs in a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns An object with success status and optional error message
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error signing in:", error);
    return {
      success: false,
      error: error.message || "An error occurred during sign in",
    };
  }
};

/**
 * Signs up a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns An object with success status and optional error message
 */
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error signing up:", error);
    return {
      success: false,
      error: error.message || "An error occurred during sign up",
    };
  }
};

/**
 * Signs out the current user
 * @returns An object with success status and optional error message
 */
export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error signing out:", error);
    return {
      success: false,
      error: error.message || "An error occurred during sign out",
    };
  }
};

/**
 * Requests a password reset for the given email
 * @param email User's email
 * @returns An object with success status and optional error message
 */
export const resetPassword = async (
  email: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error requesting password reset:", error);
    return {
      success: false,
      error: error.message || "An error occurred while requesting password reset",
    };
  }
};

/**
 * Updates the user's password
 * @param password New password
 * @returns An object with success status and optional error message
 */
export const updatePassword = async (
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating password:", error);
    return {
      success: false,
      error: error.message || "An error occurred while updating password",
    };
  }
};
