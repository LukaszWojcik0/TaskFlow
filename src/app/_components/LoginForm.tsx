import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FormInputs = {
  email: string;
  password: string;
};

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/");
      } else {
        const responseData = await response.json();
        alert(responseData.message || "An error occurred");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              {...register("email")}
              onBlur={(e) => e.target.reportValidity()}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
