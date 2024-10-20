"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="bg-primary p-4 text-primary-foreground">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          TaskFlow
        </Link>

        {isLoading ? (
          <div className="flex items-center space-x-4">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          </div>
        ) : isError ? (
          <div>Error loading user data.</div>
        ) : loggedIn ? (
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="mr-4 flex items-center">
                Welcome,{" "}
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  userEmail
                )}
              </span>
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
