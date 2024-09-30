"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

async function getUserEmailFromToken() {
  const cookieStorage = document.cookie;
  const token = cookieStorage
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      return payload.email as string;
    } catch (error) {
      console.error("Token verification failed:", error);
    }
  }
  return "";
}

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    async function fetchUserEmail() {
      const email = await getUserEmailFromToken();
      setUserEmail(email);
    }

    fetchUserEmail();
  }, []);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmailMessage("Email changed successfully");
        setUserEmail(newEmail);
      } else {
        setEmailMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setEmailMessage("An error occurred. Please try again.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setPasswordMessage("Password changed successfully");
      } else {
        setPasswordMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setPasswordMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Change Email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailChange}>
            <label className="block mb-2">Current Email: {userEmail}</label>
            <input
              type="email"
              className="border border-gray-300 p-2 rounded w-full mb-4"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email"
              required
            />
            <Button type="submit" className="w-full">
              Change Email
            </Button>
            {emailMessage && (
              <p className="mt-2 text-red-600">{emailMessage}</p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange}>
            <input
              type="password"
              className="border border-gray-300 p-2 rounded w-full mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <Button type="submit" className="w-full">
              Change Password
            </Button>
            {passwordMessage && (
              <p className="mt-2 text-red-600">{passwordMessage}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
