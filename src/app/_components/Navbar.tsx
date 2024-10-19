"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

async function fetchUser() {
  const response = await fetch("/api/me");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

const Navbar: React.FC = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const loggedIn = user?.loggedIn ?? false;
  const userEmail = user?.user?.email ?? "";

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("tasks");
    window.location.reload();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user data.</div>;
  }

  return (
    <div className="bg-primary p-4 text-primary-foreground">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          TaskFlow
        </Link>

        {loggedIn ? (
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="mr-4">Welcome, {userEmail}</span>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="h-10 rounded font-bold hover:bg-red-600"
              >
                Log Out
              </Button>
            </div>
            <Button
              asChild
              variant="destructive"
              className="h-10 font-bold hover:bg-red-600"
            >
              <Link href="/dashboard">Profile</Link>
            </Button>
          </div>
        ) : (
          <Button
            asChild
            variant="destructive"
            className="bg-blue-500 font-bold hover:bg-blue-600"
          >
            <Link href="/login">Log In</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
