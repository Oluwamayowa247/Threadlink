"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Match = {
  slug: string;
  name: string;
  reason: string;
};

export function SupplierAiMatch({ activeSlug }: { activeSlug: string }) {
  const [prompt, setPrompt] = useState(
    "Evening wear capsule — need silk with good drape, small MOQ.",
  );
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const placeholderMatches = useMemo<Match[]>(
    () => [
      {
        slug: activeSlug,
        name: "This supplier",
        reason:
          "Great starting point—then compare against two alternatives for your fabric + MOQ.",
      },
    ],
    [activeSlug],
  );

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, activeSlug }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }
      const data = (await res.json()) as { matches: Match[] };
      setMatches(data.matches);
    } catch (e) {
      setMatches(null);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
          Describe your piece
        </div>
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-white/10 text-white placeholder:text-white/55 border-white/15 focus-visible:ring-white/15 focus-visible:border-white/25"
          placeholder='e.g. "Resort set in linen, earthy palette, low MOQ"'
        />
      </div>

      <button
        type="button"
        onClick={run}
        disabled={loading || prompt.trim().length < 6}
        className="w-full rounded-full bg-white px-5 py-3 text-xs font-medium tracking-[0.14em] uppercase text-black hover:bg-white/90 disabled:opacity-60"
      >
        {loading ? "Matching…" : "AI Match"}
      </button>

      {error && (
        <div className="rounded-[18px] border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
            Error
          </div>
          <div className="mt-2 leading-7">{error}</div>
          <div className="mt-2 text-white/60">
            Tip: set <span className="text-white">ANTHROPIC_API_KEY</span> in
            your environment for real Claude responses.
          </div>
        </div>
      )}

      <div className="rounded-[22px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
            Top matches
          </div>
          <Badge variant="slate">{(matches ?? placeholderMatches).length}</Badge>
        </div>

        <div className="mt-4 space-y-3">
          {(matches ?? placeholderMatches).map((m, idx) => (
            <div
              key={`${m.slug}-${idx}`}
              className="rounded-[18px] border border-white/10 bg-[rgba(0,0,0,0.15)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-[family-name:var(--font-cormorant)] text-xl tracking-tight text-white">
                  {m.name}
                </div>
                <div className="text-[11px] tracking-[0.22em] uppercase text-white/60">
                  #{idx + 1}
                </div>
              </div>
              <div className="mt-2 text-sm leading-7 text-white/75">
                {m.reason}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

