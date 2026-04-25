"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { SupplierWithSlug } from "@/lib/supplier-data";
import { cn } from "@/lib/utils";

const DEFAULT_CHIPS = [
  "adire",
  "aso oke",
  "ankara",
  "kente",
  "linen",
  "silk",
  "lace",
  "jersey",
];

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

export function SupplierExplorer({ suppliers }: { suppliers: SupplierWithSlug[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const chips = useMemo(() => {
    const fromData = new Set<string>();
    for (const s of suppliers) for (const f of s.fabrics) fromData.add(f);
    const ordered = [...DEFAULT_CHIPS, ...[...fromData].sort()].filter(
      (v, idx, arr) => arr.indexOf(v) === idx,
    );
    return ordered.slice(0, 12);
  }, [suppliers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suppliers.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.fabrics.some((f) => f.toLowerCase().includes(q));
      const matchesChips =
        selected.length === 0 ||
        selected.every((chip) =>
          s.fabrics.map((f) => f.toLowerCase()).includes(chip.toLowerCase()),
        );
      return matchesQuery && matchesChips;
    });
  }, [query, selected, suppliers]);

  const featured = filtered[0] ?? suppliers[0];
  const rest = filtered.filter((s) => s.slug !== featured?.slug);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-black/5 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
                Find suppliers
              </div>
              <div className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl leading-tight tracking-tight">
                Search + filter by fabric
              </div>
            </div>
            <Badge variant="accent">{filtered.length} results</Badge>
          </div>

          <div className="mt-6">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: “silk”, “Lagos”, “block print”…"
              aria-label="Search suppliers"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => {
              const on = selected.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() =>
                    setSelected((prev) =>
                      prev.includes(chip)
                        ? prev.filter((c) => c !== chip)
                        : [...prev, chip],
                    )
                  }
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs tracking-[0.14em] uppercase transition-colors",
                    on
                      ? "border-[#b85c2a]/35 bg-[#b85c2a]/10 text-[#7a3416]"
                      : "border-black/10 bg-white text-black/70 hover:bg-black/[0.03]",
                  )}
                >
                  {chip}
                </button>
              );
            })}
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => setSelected([])}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs tracking-[0.14em] uppercase text-black/55 hover:bg-black/[0.03]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[var(--slate-panel)] p-6 sm:p-8 text-white">
          <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
            Snapshot
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Stat label="Suppliers" value="200+" />
            <Stat label="Cities" value="12" />
            <Stat label="Response" value="48h" />
          </div>
          <div className="mt-6 text-sm leading-7 text-white/75">
            Muted slate panels keep focus on the product. The warm accent{" "}
            <span className="text-white">#b85c2a</span> nods to African textile
            context without overpowering the page.
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured && (
          <Link
            href={`/supplier/${featured.slug}`}
            className="group relative overflow-hidden rounded-[28px] border border-black/5 bg-white p-7 sm:p-8 md:col-span-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
                Featured supplier
              </div>
              <Badge variant="accent">
                {featured.city}, {featured.country}
              </Badge>
            </div>
            <div className="mt-3 font-[family-name:var(--font-cormorant)] text-4xl leading-[1.05] tracking-tight">
              {featured.name}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {featured.fabrics.slice(0, 5).map((f) => (
                <Badge key={f}>{f}</Badge>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-sm text-black/70">
              <Meta k="MOQ" v={`${featured.moq}`} />
              <Meta k="From" v={formatUsd(featured.pricePerYardUsd)} />
              <Meta k="Rating" v={`${featured.rating.toFixed(1)} / 5`} />
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#b85c2a]/15 blur-2xl" />
            </div>
          </Link>
        )}

        {rest.map((s) => (
          <Link
            key={s.slug}
            href={`/supplier/${s.slug}`}
            className="group rounded-[28px] border border-black/5 bg-white p-6 transition-colors hover:bg-black/[0.01]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="font-[family-name:var(--font-cormorant)] text-2xl leading-snug tracking-tight">
                {s.name}
              </div>
              <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
                {s.rating.toFixed(1)}
              </div>
            </div>
            <div className="mt-1 text-sm text-black/60">
              {s.city}, {s.country}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {s.fabrics.slice(0, 4).map((f) => (
                <Badge key={f}>{f}</Badge>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-black/70">
              <Meta k="MOQ" v={`${s.moq}`} />
              <Meta k="From" v={formatUsd(s.pricePerYardUsd)} />
            </div>
            <div className="mt-4 text-sm leading-6 text-black/55 line-clamp-3">
              {s.notes}
            </div>
            <div className="mt-5 text-[11px] tracking-[0.22em] uppercase text-black/45 group-hover:text-black/60">
              View profile →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
      <div className="text-[11px] tracking-[0.22em] uppercase text-white/65">
        {label}
      </div>
      <div className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl tracking-tight">
        {value}
      </div>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-[18px] border border-black/5 bg-black/[0.02] px-4 py-3">
      <div className="text-[11px] tracking-[0.22em] uppercase text-black/45">
        {k}
      </div>
      <div className="mt-1 font-medium text-black/80">{v}</div>
    </div>
  );
}

