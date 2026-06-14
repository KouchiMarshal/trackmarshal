import { supabase } from "@/lib/supabase";

export default async function TestPage() {

  const { data, error } = await supabase
    .from("events")
    .select("*");

  return (
    <main className="min-h-screen bg-black p-10 text-white">

      <h1 className="mb-8 text-4xl font-black">
        Supabase Connection Test
      </h1>

      {error && (
        <pre className="mb-6 rounded-xl bg-red-950 p-6 text-red-400">
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      <pre className="rounded-xl bg-zinc-900 p-6">
        {JSON.stringify(data, null, 2)}
      </pre>

    </main>
  );
}