"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">Login</h1>

      <input
        className="border p-2 block mb-2"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 block mb-4"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="border px-4 py-2"
      >
        Login
      </button>

      <p className="text-md text-gray-600 mt-6">
        Don’t have an account?
      </p>

      <Link
        href="/signup"
        className="text-blue-600 hover:underline font-medium"
      >
        Sign up
      </Link>

    </main>
  );
}