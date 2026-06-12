"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase-client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("User:", user);

     if (!user) {
      router.push("/login");
      return;
    }

    setEmail(user.email || "");
    setLoading(false);
  }

  //Fetching applications for the logged in user
  useEffect(() => {
    getUser();
    fetchApplications();
  }, []);

  async function fetchApplications() 
  {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id);

    setApplications(data || []);
  }

  const applied = applications.filter(
    (a) => a.status === "Applied"
  ).length;

  const interview = applications.filter(
    (a) => a.status === "Interview"
  ).length;

  const offer = applications.filter(
    (a) => a.status === "Offer"
  ).length;

  const rejected = applications.filter(
    (a) => a.status === "Rejected"
  ).length;

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  //Route protection: if loading, show loading. If no user, redirect to login. 
  // Only show dashboard if user exists and loading is false.
  if (loading) {
    return <div>Loading...</div>;
}

  return (
    <main className="p-10">
      <p className="mt-4">Logged in as: {email}</p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        
        <div className="p-4 border rounded bg-blue-50">
          <h2 className="text-blue-700 font-bold">Applied</h2>
          <p className="text-2xl">{applied}</p>
        </div>

        <div className="p-4 border rounded bg-yellow-50">
          <h2 className="text-yellow-700 font-bold">Interview</h2>
          <p className="text-2xl">{interview}</p>
        </div>

        <div className="p-4 border rounded bg-green-50">
          <h2 className="text-green-700 font-bold">Offer</h2>
          <p className="text-2xl">{offer}</p>
        </div>

        <div className="p-4 border rounded bg-red-50">
          <h2 className="text-red-700 font-bold">Rejected</h2>
          <p className="text-2xl">{rejected}</p>
        </div>

      </div>

      <button
        onClick={handleLogout}
        className="mt-4 border px-4 py-2"
      >
        Logout
      </button>
    </main>
  );
}