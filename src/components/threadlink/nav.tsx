import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-[family-name:var(--font-cormorant)] text-2xl leading-none tracking-tight">
            Threadlink
          </span>
          <span className="text-[11px] tracking-[0.22em] uppercase text-black/55">
            Supplier discovery
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Badge variant="accent">Hackathon MVP</Badge>
        </nav>
      </div>
    </header>
  );
}

