"use client";
import Link from "next/link";
import React, { useState } from "react";
import { use } from "react";

interface PageProps {
  params: Promise<{ role: string }>;
}

export default function LoginPage({ params }: PageProps) {
  const { role } = use(params);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logging in as ${roleName} with email: ${email}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1e3a8a] to-[#071c49] text-white">
      {/* Header */}
      <header className="flex justify-around items-center gap-3 bg-[#1A0C4E] p-4">
        <img
          width="200"
          height="50"
          src="https://licet.ac.in/wp-content/uploads/2021/02/licet-e1617087721530.png"
          alt="LICET Logo"
        />
        <div className="text-center">
          <h1 className="text-4xl mb-2">
            LOYOLA-ICAM COLLEGE OF ENGINEERING AND TECHNOLOGY
          </h1>
          <p className="text-xl">(Autonomous)</p>
        </div>
      </header>

      {/* Department Banner */}
      <section className="border border-white bg-gradient-to-t from-sky-600 to-[#1A0C4E] p-3 text-2xl text-center">
        DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
      </section>

      {/* Login Form */}
      <section className="flex flex-col items-center justify-center mt-10 mx-auto w-[90%] max-w-xl  bg-opacity-10 rounded-3xl p-6">
        <h2 className="text-3xl mb-6">{roleName} Login</h2>
        <form className="w-full border-2 border-white rounded-2xl p-6" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2">Email:</label>
            <input
              className="w-full p-3 bg-blue-900 rounded-2xl focus:outline-none text-white placeholder-white"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`${role} email`}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">Password:</label>
            <input
              className="w-full p-3 bg-blue-900 rounded-2xl focus:outline-none text-white placeholder-white"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`${role} password`}
              required
            />
          </div>

          <div className="flex justify-center items-center mb-6">
            <p className="mr-2">Don't have Account?</p>
            <Link href={`/Signup/${roleName}`} className="underline text-sky-300">
              Sign up
            </Link>
          </div>

          <div className="flex justify-between">
            <Link
              href="/"
              className="w-[150px] text-center border-2 border-white rounded-xl p-3 hover:bg-blue-800"
            >
              Back
            </Link>
            <button
              className="w-[150px] border-2 border-white rounded-xl p-3 hover:bg-blue-800"
              type="submit"
            >
              Login as {roleName}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
