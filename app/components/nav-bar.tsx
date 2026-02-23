"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./theme-toggle";
import Avatar from "./avatar";

export default function NavBar() {
  const [mockUser, setMockUser] = useState<string | null>(null);

  useEffect(() => {
    setMockUser(localStorage.getItem("mock_user"));
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/explore" className="text-xl font-semibold tracking-tight">
          elev8
        </Link>

        {/* Search placeholder */}
        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="w-full px-4 py-2 rounded-full bg-surface border border-border text-muted text-sm">
            Search threads...
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {mockUser ? (
            <Link href="/profile">
              <Avatar name="Cole Hoffman" size="sm" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
