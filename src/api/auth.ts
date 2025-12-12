// @ts-nocheck - Type checking disabled due to optional Supabase configuration
import { supabase } from "./supabase";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

// Helper to check if Supabase is available
const checkSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your environment variables.");
  }
  return supabase;
};

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string, name: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    return { user: data.user, error: null };
  } catch (error) {
    console.error("Sign up error:", error);
    return { user: null, error };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error("Sign in error:", error);
    return { user: null, session: null, error };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const client = checkSupabase();
    const { error } = await client.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return { error };
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const client = checkSupabase();
    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error) throw error;

    return { user, error: null };
  } catch (error) {
    console.error("Get current user error:", error);
    return { user: null, error };
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  try {
    const client = checkSupabase();
    const {
      data: { session },
      error,
    } = await client.auth.getSession();

    if (error) throw error;

    return { session, error: null };
  } catch (error) {
    console.error("Get session error:", error);
    return { session: null, error };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: "nossamaternidade://reset-password",
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error };
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Update password error:", error);
    return { error };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const client = checkSupabase();
  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.user_metadata?.name,
      });
    } else {
      callback(null);
    }
  });

  return subscription;
}
