"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { baseURL } from "@/lib/api";

export default function Member({ nfcUID }: { nfcUID: string }) {
  const [userName, setUserName] = useState("");
  const [userCreatedAt, setUserCreatedAt] = useState("");
  const [isClient, setIsClient] = useState(false); // To check if we're on the client-side
  const router = useRouter();

  useEffect(() => {
    // Ensure this is only running on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && nfcUID) {
      const getUser = async () => {
        try {
          const response = await fetch(`${baseURL}/user/${nfcUID}`);
          if (response.ok) {
            const user = await response.json();
            setUserName(user.name);
            setUserCreatedAt(user.createdAt);
          } else if (response.status === 404) {
            // Handle case where user is not found
            console.error("User not found. Redirecting to register page...");
            router.push("/register");
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      getUser();
    }
  }, [nfcUID, isClient, router]);

  if (!isClient) return null; // Don't render anything until client-side

  return (
    <section className="w-3/5 h-[500px] flex flex-col items-center justify-center bg-white rounded-lg drop-shadow-lg">
      {userName ? (
        <>
          <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
          <p className="text-gray-600 mt-2">
            Member since: {new Date(userCreatedAt).toLocaleDateString()}
          </p>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => router.push("/")}
          >
            Logout
          </button>
        </>
      ) : (
        <h1 className="text-xl text-gray-600">Loading member data...</h1>
      )}
    </section>
  );
}
