import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

import { useCookie } from "./useCookie";

async function fetchUser() {
  const response = await fetch("/api/me");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default function WelcomePopUp() {
  // ************************************************
  // this should be in separate file so that I don't have to copy it from page.tsx
  // ************************************************
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const loggedIn = data?.loggedIn ?? false;
  // ************************************************

  const [isVisible, setIsVisible] = useState(true);
  const [isFirst, setIsFirst] = useState(false);
  const { setCookie, getCookie } = useCookie();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!getCookie("firstVisit")) {
        setCookie("firstVisit", "true", 30);
        setIsFirst(true);
      }
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [getCookie, setCookie]);

  function handleCloseWelcome() {
    setIsVisible(false);
    setIsFirst(false);
  }

  return (
    // <Card className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 z-20">
    //     <CardHeader>
    //         <CardTitle>
    //         Welcome to <b>TaskFlow</b>!
    //         </CardTitle>
    //         <CardDescription>
    //         Login to access your flow! Don&apos;t have an account yet? Create one!

    //         </CardDescription>
    //     </CardHeader>

    //     <CardContent className="mx-auto flex flex-shrink">
    //         <div className="mx-auto px-1">
    //             <Button
    //     asChild
    //     variant="destructive"
    //     className="bg-blue-500 font-bold hover:bg-blue-600"
    //     >
    //     <Link href="/login">Log In</Link>
    //   </Button>
    //       </div><div className="mx-auto px-1">

    //   <Button
    //     asChild
    //     variant="destructive"
    //     className="bg-blue-500 font-bold hover:bg-blue-600"
    //     >
    //     <Link href="/signup">Sign up</Link>
    //   </Button>
    //       </div>
    //     </CardContent>
    // </Card>
    <>
      {isVisible && !loggedIn && isFirst && (
        <div
          id="first_welcome"
          className="absolute z-20 flex h-screen w-screen items-center justify-center bg-black bg-opacity-30"
        >
          <div className="mx-auto flex h-1/3 w-1/2 flex-col items-center justify-center rounded-2xl border-solid border-slate-600 bg-white">
            <p className="text-3xl">
              Welcome to <b>TaskFLow</b>!
            </p>
            <p className="px-2 py-3 text-center">
              Login to your account, to access all your tasks. Don&apos;t have
              an account yet? Create one and save all your tasks across your
              devices!
            </p>
            <div className="pt-12">
              <Button
                asChild
                variant="destructive"
                className="mr-5 bg-blue-500 font-bold hover:bg-blue-600"
              >
                <Link href="/login">Log In</Link>
              </Button>

              <Button
                asChild
                variant="destructive"
                className="bg-blue-500 font-bold hover:bg-blue-600"
              >
                <Link href="/signup">Sign up</Link>
              </Button>
              <p
                onClick={handleCloseWelcome}
                className="mt-3 text-center text-sm text-gray-400 hover:cursor-pointer"
              >
                No, thank you.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
