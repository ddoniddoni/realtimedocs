import Link from "next/link";

import Navigation from "./navigation";

export function Menu() {
  return (
    <header
      className="sticky top-0 left-0 right-0 z-999
    flex items-center justify-between
    gap-5
    px-5 py-2.5
    min-h-[68px]
    w-screen
    border-b border-[#2f2f3a]
    overflow-hidden
    bg-[linear-gradient(180deg,#18181d_0%,#18181d_63%,rgba(38,38,46,0.5)_100%)]
    transition-colors
    before:content-['']
    before:absolute before:inset-0
    before:block
    before:z-[-1]
    before:opacity-0
    before:bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_79%,rgba(255,255,255,0.7)_100%)]
    before:transition-opacity"
    >
      <Link href="/" className="text-xl font-bold tracking-tight pl-5">
        RSD
      </Link>
      <Navigation />
    </header>
  );
}
