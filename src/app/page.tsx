"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    const { data, error } = await supabase
      .from("applications")
      .select("*");

    console.log(data);
    console.log(error);
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Track your Job</h1>

      <button
        className="mt-4 border px-4 py-2"
        onClick={async () => {
          console.log("Button clicked");

          const { data, error } = await supabase
            .from("applications")
            .insert([
              {
                user_id: "11111111-1111-1111-1111-111111111111",
                company: "Google",
                position: "Software Engineer",
                status: "Applied",
                applied_date: "2026-06-04",
                notes: "Submitted via LinkedIn",
              },
            ]);

          console.log("Data:", data);
          console.log("Error:", error);
        }}
      >
        Add Test Job
      </button>
    </main>
  );

}