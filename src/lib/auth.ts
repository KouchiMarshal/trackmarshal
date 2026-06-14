import { supabase } from "./supabase";

export async function signUp(
  email: string,
  password: string,
  role: string
) {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return { error };
  }

  await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      role,
    });

  return { success: true };
}

export async function signIn(
  email: string,
  password: string
) {

  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {

  return await supabase.auth.signOut();
}