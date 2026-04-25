"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

const SWATCHES = [
  { name: "Indigo", className: "bg-[#1d2a5a]" },
  { name: "Clay", className: "bg-[#b85c2a]" },
  { name: "Palm", className: "bg-[#2f5f4f]" },
  { name: "Sand", className: "bg-[#d6c1a3]" },
  { name: "Charcoal", className: "bg-[#15181d]" },
];

export function SwatchStrip() {
  const [active, setActive] = useState<number | null>(null);
  const widthClasses = useMemo(() => {
    const base = "w-[54px]";
    const expanded = "w-[132px]";
    return SWATCHES.map((_, idx) => (active === idx ? expanded : base));
  }, [active]);

  return (
    <section aria-label="Fabric swatches" className="mx-auto max-w-6xl px-6">
      <div className="mt-8 flex items-center gap-2">
        {SWATCHES.map((s, idx) => (
          <button
            key={s.name}
            type="button"
            onMouseEnter={() => setActive(idx)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              "h-[42px] rounded-full transition-all duration-200",
              "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]",
              widthClasses[idx],
              s.className,
            )}
            aria-label={s.name}
            title={s.name}
          />
        ))}
        <div className="ml-3 hidden sm:block text-[11px] tracking-[0.22em] uppercase text-black/55">
          Hover to expand
        </div>
      </div>
    </section>
  );
}

