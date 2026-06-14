import { supabase } from "./supabase";

export async function getApplications() {

  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      profiles (
        country,
        disciplines,
        experience,
        languages,
        bio
      )
    `);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}