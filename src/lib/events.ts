import { supabase } from "./supabase";

export async function getEvents() {

  const { data, error } = await supabase
    .from("events")
    .select("*");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}