// @ts-nocheck - Type checking disabled due to optional Supabase configuration
import { supabase, Database } from "./supabase";

type User = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

type Post = Database["public"]["Tables"]["posts"]["Row"];
type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type PostUpdate = Database["public"]["Tables"]["posts"]["Update"];

type Comment = Database["public"]["Tables"]["comments"]["Row"];
type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];

type Like = Database["public"]["Tables"]["likes"]["Row"];
type LikeInsert = Database["public"]["Tables"]["likes"]["Insert"];

type Habit = Database["public"]["Tables"]["habits"]["Row"];
type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
type HabitUpdate = Database["public"]["Tables"]["habits"]["Update"];

type HabitCompletion = Database["public"]["Tables"]["habit_completions"]["Row"];
type HabitCompletionInsert = Database["public"]["Tables"]["habit_completions"]["Insert"];

// Helper to check if Supabase is available
const checkSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Please add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to your environment variables.");
  }
  return supabase;
};

// ============================================
// USER OPERATIONS
// ============================================

export async function createUserProfile(userData: UserInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Create user profile error:", error);
    return { data: null, error };
  }
}

export async function getUserProfile(userId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Get user profile error:", error);
    return { data: null, error };
  }
}

export async function updateUserProfile(userId: string, updates: UserUpdate) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Update user profile error:", error);
    return { data: null, error };
  }
}

// ============================================
// POST OPERATIONS
// ============================================

export async function createPost(postData: PostInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("posts")
      .insert(postData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Create post error:", error);
    return { data: null, error };
  }
}

export async function getPosts(category?: string) {
  try {
    const client = checkSupabase();
    let query = client.from("posts").select("*").order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Get posts error:", error);
    return { data: null, error };
  }
}

export async function getPost(postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Get post error:", error);
    return { data: null, error };
  }
}

export async function deletePost(postId: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.from("posts").delete().eq("id", postId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Delete post error:", error);
    return { error };
  }
}

// ============================================
// COMMENT OPERATIONS
// ============================================

export async function createComment(commentData: CommentInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("comments")
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;

    // Update post comments count
    await client.rpc("increment_comments_count", { post_id: commentData.post_id });

    return { data, error: null };
  } catch (error) {
    console.error("Create comment error:", error);
    return { data: null, error };
  }
}

export async function getPostComments(postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Get comments error:", error);
    return { data: null, error };
  }
}

// ============================================
// LIKE OPERATIONS
// ============================================

export async function likePost(userId: string, postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("likes")
      .insert({ user_id: userId, post_id: postId })
      .select()
      .single();

    if (error) throw error;

    // Update post likes count
    await client.rpc("increment_likes_count", { post_id: postId });

    return { data, error: null };
  } catch (error) {
    console.error("Like post error:", error);
    return { data: null, error };
  }
}

export async function unlikePost(userId: string, postId: string) {
  try {
    const client = checkSupabase();
    const { error } = await client
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) throw error;

    // Update post likes count
    await client.rpc("decrement_likes_count", { post_id: postId });

    return { error: null };
  } catch (error) {
    console.error("Unlike post error:", error);
    return { error };
  }
}

export async function checkIfUserLikedPost(userId: string, postId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("likes")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return { liked: !!data, error: null };
  } catch (error) {
    console.error("Check like error:", error);
    return { liked: false, error };
  }
}

// ============================================
// HABIT OPERATIONS
// ============================================

export async function createHabit(habitData: HabitInsert) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habits")
      .insert(habitData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Create habit error:", error);
    return { data: null, error };
  }
}

export async function getUserHabits(userId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Get habits error:", error);
    return { data: null, error };
  }
}

export async function updateHabit(habitId: string, updates: HabitUpdate) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habits")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", habitId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Update habit error:", error);
    return { data: null, error };
  }
}

export async function deleteHabit(habitId: string) {
  try {
    const client = checkSupabase();
    const { error } = await client.from("habits").delete().eq("id", habitId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Delete habit error:", error);
    return { error };
  }
}

export async function completeHabit(
  habitId: string,
  userId: string,
  completedDate: string
) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habit_completions")
      .insert({
        habit_id: habitId,
        user_id: userId,
        completed_date: completedDate,
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Complete habit error:", error);
    return { data: null, error };
  }
}

export async function uncompleteHabit(habitId: string, completedDate: string) {
  try {
    const client = checkSupabase();
    const { error } = await client
      .from("habit_completions")
      .delete()
      .eq("habit_id", habitId)
      .eq("completed_date", completedDate);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Uncomplete habit error:", error);
    return { error };
  }
}

export async function getHabitCompletions(habitId: string) {
  try {
    const client = checkSupabase();
    const { data, error } = await client
      .from("habit_completions")
      .select("*")
      .eq("habit_id", habitId)
      .order("completed_date", { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Get habit completions error:", error);
    return { data: null, error };
  }
}
