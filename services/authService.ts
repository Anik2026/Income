import { supabase } from './supabaseClient';

export interface AuthResult {
  success: boolean;
  message?: string;
  user?: { username: string; avatarUrl?: string };
}

export const login = async (username: string, password: string): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      return { success: false, message: 'ব্যবহারকারী পাওয়া যায়নি (User not found)' };
    }

    if (data.password !== password) {
      return { success: false, message: 'ভুল পাসওয়ার্ড (Invalid password)' };
    }

    return { 
      success: true, 
      user: { 
        username: data.username,
        avatarUrl: data.avatar_url 
      } 
    };
  } catch (error) {
    return { success: false, message: 'Login error' };
  }
};

export const register = async (username: string, password: string): Promise<AuthResult> => {
  try {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) {
      return { success: false, message: 'এই নাম ব্যবহার করা হয়েছে (Username taken)' };
    }

    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password }])
      .select()
      .single();

    if (error) {
      return { success: false, message: 'Registration failed: ' + error.message };
    }

    return { 
      success: true, 
      user: { 
        username: data.username,
        avatarUrl: undefined
      } 
    };
  } catch (error) {
    return { success: false, message: 'Registration error' };
  }
};

export const updateAvatar = async (username: string, avatarUrl: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('username', username);
      
    if (error) {
      console.error("Error updating avatar:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Error in updateAvatar:", e);
    return false;
  }
};