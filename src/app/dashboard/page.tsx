"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import Navbar from "../_components/Navbar";

async function fetchUser() {
  const response = await fetch("/api/me");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

const Dashboard = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const userEmailQuery = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: Infinity,
  });

  let userEmailMessage;
  if (userEmailQuery.isLoading) {
    userEmailMessage = "Loading...";
  } else if (userEmailQuery.data?.user?.email) {
    userEmailMessage = `Current Email: ${userEmailQuery.data.user.email}`;
  } else {
    userEmailMessage = "No email found";
  }

  const changeEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }
      return email;
    },
    onSuccess: (email) => {
      queryClient.setQueryData(
        ["user"],
        (oldData: { user: { email: string } }) => ({
          ...oldData,
          user: { ...oldData.user, email },
        }),
      );
      setNewEmail("");
      router.push("/");
    },
    onError: (error: Error) => {
      setEmailMessage(error.message || "An error occurred. Please try again.");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({
      password,
      confirmPassword,
    }: {
      password: string;
      confirmPassword: string;
    }) => {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }
    },
    onSuccess: () => {
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Password changed successfully");
      router.push("/");
    },
    onError: (error: Error) => {
      setPasswordMessage(
        error.message || "An error occurred. Please try again.",
      );
    },
  });

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage("");
    changeEmailMutation.mutate(newEmail);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage("");
    changePasswordMutation.mutate({ password: newPassword, confirmPassword });
  };

  const [emailMessage, setEmailMessage] = useState<string>("");
  const [passwordMessage, setPasswordMessage] = useState<string>("");

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Profile settings
        </h1>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Change Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailChange} className="grid gap-4">
              <Label className="mb-2 block">{userEmailMessage}</Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
                required
              />
              <Button type="submit" disabled={changeEmailMutation.isPending}>
                {changeEmailMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Email"
                )}
              </Button>
              {emailMessage && (
                <p className="mt-2 text-red-600">{emailMessage}</p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="mx-auto mt-6 max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="grid gap-4">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
              {passwordMessage && (
                <p className="mt-2 text-red-600">{passwordMessage}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
