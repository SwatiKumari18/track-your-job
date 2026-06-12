"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect user to dashboard on load
    router.push("/dashboard");
  }, [router]);

  return (
    <main className="flex items-center justify-center h-screen">
      <p className="text-gray-500">
        Redirecting to dashboard...
      </p>
    </main>
  );
}