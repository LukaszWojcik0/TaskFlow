"use client";
import Link from "next/link";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="bg-primary text-primary-foreground p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          TaskFlow
        </Link>
        <Link
          href="/auth"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
