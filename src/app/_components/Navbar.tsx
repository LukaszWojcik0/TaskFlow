"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("/api/me");
        const data = await response.json();
        if (data.loggedIn) {
          setLoggedIn(true);
          setUserEmail(data.user.email);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setLoggedIn(false);
    setUserEmail("");
  };

  return (
    <div className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          TaskFlow
        </Link>
        {loggedIn ? (
          <div className="flex items-center">
            <span className="mr-4">Welcome, {userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Log In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
