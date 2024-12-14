"use client";

import React, { useState } from "react";
import { baseURL } from "@/lib/api";
import { useRouter } from "next/router";

export default function Register({ nfcUID }: { nfcUID: string }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Name is required!");
      return;
    }

    try {
      const response = await fetch(`${baseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nfc_uid: nfcUID, name }),
      });

      if (response.ok) {
        setSuccess(true);
        setName("");

        router.push("/");
      } else {
        const result = await response.json();
        setError(result.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <form
      className="w-3/5 h-[500px] flex flex-col items-center justify-center bg-white rounded-lg drop-shadow-lg p-5"
      onSubmit={handleRegister}
    >
      <h1 className="text-xl font-semibold mb-4">
        Hello new member! What&apos;s your name?
      </h1>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-[80%] p-2 mb-4 border border-gray-300 rounded-lg"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && (
        <p className="text-green-500 mb-2">Registration successful!</p>
      )}
      <button
        type="submit"
        className="w-[80%] bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
      >
        Register
      </button>
    </form>
  );
}
