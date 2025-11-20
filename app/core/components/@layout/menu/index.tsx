import Link from "next/link";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Menu() {
  return (
    <header className="flex items-center justify-between w-full h-[72px] px-2 border-b">
      <div className="flex items-center">
        <SidebarTrigger />
        <Link href="/board">
          <img
            src="/static/gw_logo.png"
            alt="Good Worker"
            className="w-[120px] h-[72px]"
          />
        </Link>
      </div>
      <ModeToggle />
    </header>
  );
}
