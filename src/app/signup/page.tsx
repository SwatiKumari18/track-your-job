"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase-client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Account created!");
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>

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
        onClick={signUp}
        className="border px-4 py-2"
      >
        Create Account
      </button>
    </main>
  );
}