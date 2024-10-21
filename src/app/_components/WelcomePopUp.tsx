import React,{ useState } from "react";
import Cookies from "js-cookie";
import { Card,
    CardContent,
    CardDescription,
    CardTitle,
CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";




export default function WelcomePopUp () {
    const [cookieValue, setCookieValue] = useState<string | undefined>(undefined)
    
    const setCookie = (name: string, value: string, days: number) => {
        Cookies.set(name, value, {expires: days});
        setCookieValue(Cookies.get(name))
    };

    const getCookie = (name: string) => {
        const value = Cookies.get(name);
        setCookieValue(value)
    };
    
    
    
    return(
        <Card className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 z-20">
            <CardHeader>
                <CardTitle>
                Welcome to <b>TaskFlow</b>!
                </CardTitle>
                <CardDescription>
                Login to access your flow! Don&apos;t have an account yet? Create one!

                </CardDescription>
            </CardHeader>
                
            <CardContent className="mx-auto flex flex-shrink">
                <div className="mx-auto px-1">
                    <Button
            asChild
            variant="destructive"
            className="bg-blue-500 font-bold hover:bg-blue-600"
            >
            <Link href="/login">Log In</Link>
          </Button>
              </div><div className="mx-auto px-1">

          <Button
            asChild
            variant="destructive"
            className="bg-blue-500 font-bold hover:bg-blue-600"
            >
            <Link href="/signup">Sign up</Link>
          </Button>
              </div>
            </CardContent>
        </Card>
    )
};