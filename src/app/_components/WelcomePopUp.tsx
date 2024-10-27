import React,{ useState, useRef } from "react";
import { useCookie } from './useCookie';

import { Card,
    CardContent,
    CardDescription,
    CardTitle,
CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Link from "next/link";


function handleCloseWelcome()
{
    return
}

export default function WelcomePopUp () {
    
    
    
    
    return(
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

        <div id="first_welcome" className="bg-black bg-opacity-30 absolute h-screen  w-screen z-20 flex justify-center items-center">
            <div className="bg-white rounded-3xl border-solid border-2 border-slate-600 mx-auto w-1/2 h-1/3 flex justify-center items-center flex-col">
            <p className="text-3xl">Welcome to <b>TaskFLow</b>!</p>
            <p className="px-2 py-3 text-center">Login to your account, to access all your tasks. Don&apos;t have an account yet? Create one and save all your tasks across your devices!</p>
            <div className="pt-12">
            <Button
            asChild
            variant="destructive"
            className="bg-blue-500 font-bold hover:bg-blue-600 mr-5"
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
          <p onClick={handleCloseWelcome} className="mt-3 text-center text-gray-400  hover:cursor-pointer text-sm">No, thank you.</p>
                </div>

            </div>
        </div>
        
    )
};

