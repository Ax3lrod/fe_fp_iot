"use client";

import React from "react";
import { useState, useEffect } from "react";
//import { User } from "@/types/entity/user";
import { baseURL } from "@/lib/api";
//import useNFCListener from "@/nfc/NFCListener";

export default function Home() {
  const [nfcUID, setnfcUID] = useState("");
  //const [user, setUser] = useState<User | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState("");
  const [userCreatedAt, setUserCreatedAt] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");

  //const router = useRouter();

  useEffect(() => {
    const eventSource = new EventSource(`${baseURL}/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.message === "Kartu belum terdaftar") {
        setIsRegistered(false);
      } else {
        setIsRegistered(true);
      }

      setMessage(data.message);

      setnfcUID(data.user.nfc_uid);
      setUserName(data.user.name);
      setUserCreatedAt(data.user.created_at);
      setAddress(data.user.address);
      setGender(data.user.gender);
      setDateofbirth(data.user.dob);

      /*if(data.user){
        setIsRegistered(true);
      }else{
        setIsRegistered(false);
      }*/

      eventSource.onerror = (error) => {
        console.error("Error with EventSource:", error);
        eventSource.close();
      };

      return () => {
        eventSource.close(); // Pastikan koneksi ditutup saat komponen dibersihkan
      };
    };
  }, []);

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
        body: JSON.stringify({
          nfc_uid: nfcUID,
          name,
          address,
          gender,
          dob: dateofbirth,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setName("");

        //router.push("/");
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
    <main className="w-full min-h-screen items-center bg-gray-400 flex justify-center">
      {message === "" ? (
        <section className="w-3/5 h-[500px] flex items-center justify-center bg-white rounded-lg shadow-lg text-black">
          <h1>Waiting for NFC tag...</h1>
        </section>
      ) : isRegistered ? (
        <section className="w-3/5 h-[500px] font-bold flex flex-col items-center justify-center bg-white rounded-lg shadow-lg text-black">
          <h1>Welcome, {userName}!</h1>
          <p>Member since: {new Date(userCreatedAt).toLocaleDateString()}</p>
          <p>NFC UID: {nfcUID}</p>
          <p>Address: {address}</p>
          <p>Gender: {gender}</p>
          <p>Date of Birth: {dateofbirth}</p>
        </section>
      ) : (
        <form
          className="w-3/5 h-[500px] flex flex-col items-center justify-center bg-white rounded-lg drop-shadow-lg p-5"
          onSubmit={handleRegister}
        >
          <h1 className="text-xl font-semibold mb-4 text-black">
            Hello new member! What&apos;s your name?
          </h1>
          <p className="text-black">NFC ID: {nfcUID}</p>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[80%] p-2 mb-4 border border-gray-300 rounded-lg text-black"
          />
          <input
            type="text"
            placeholder="Your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-[80%] p-2 mb-4 border border-gray-300 rounded-lg text-black"
          />
          <input
            type="text"
            placeholder="Your gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-[80%] p-2 mb-4 border border-gray-300 rounded-lg text-black"
          />
          <input
            type="text"
            placeholder="Your date of birth"
            value={dateofbirth}
            onChange={(e) => setDateofbirth(e.target.value)}
            className="w-[80%] p-2 mb-4 border border-gray-300 rounded-lg text-black"
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
      )}
    </main>
  );
}
