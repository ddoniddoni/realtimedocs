"use client";

import Link from "next/link";

import { useUserStore } from "@lib/store/user";

export default function Navigation() {
  return (
    <nav className="flex-1 flex">
      <ul className="flex items-center gap-[18px]">
        <li>
          <Link href="/" className="relative">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
}
