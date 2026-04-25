import { Badge } from "@/components/ui/badge";
import type { SupplierWithSlug } from "@/lib/supplier-data";

type Review = {
  buyerName: string;
  rating: number;
  comment: string;
  purchasedFor: string;
  monthsAgo: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function roundToHalf(n: number) {
  return Math.floor(n * 2 + 0.5) / 2;
}

function seededPick<T>(seed: number, arr: T[]) {
  return arr[Math.abs(seed) % arr.length]!;
}

function seedFromSlug(slug: string) {
  let s = 0;
  for (let i = 0; i < slug.length; i++) s = (s * 31 + slug.charCodeAt(i)) >>> 0;
  return s;
}

function makeDemoReviews(supplier: SupplierWithSlug): Review[] {
  const seed = seedFromSlug(supplier.slug);
  const buyerNames = ["Ada", "Zainab", "Kofi", "Amaka", "Yara", "Tomi", "Laila", "Seyi"];
  const purchasedFor = [
    "capsule drop",
    "bridal order",
    "resort set",
    "uniform run",
    "eveningwear",
    "accessories line",
  ];
  const comments = [
    "Quality matched the swatch, and the colors held up after finishing.",
    "Fast comms, realistic timelines, and consistent yardage across rolls.",
    "Great hand-feel and drape. Would love slightly better packaging next time.",
    "We got helpful guidance on MOQ and alternatives without upselling.",
    "Clear photos + quick samples. Production came in on time for our launch.",
  ];

  const base = clamp(roundToHalf(supplier.rating), 3.5, 5);
  return [0, 1, 2].map((idx) => {
    const localSeed = seed + idx * 97;
    const jitter = ((localSeed % 5) - 2) * 0.1; // -0.2..+0.2
    return {
      buyerName: seededPick(localSeed, buyerNames),
      rating: clamp(roundToHalf(base + jitter), 3, 5),
      comment: seededPick(localSeed + 11, comments),
      purchasedFor: seededPick(localSeed + 23, purchasedFor),
      monthsAgo: 2 + (localSeed % 9),
    };
  });
}

function Stars({ rating }: { rating: number }) {
  const clamped = clamp(rating, 0, 5);
  const r = clamp(roundToHalf(clamped), 0, 5);
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < full;
        const isHalf = !isFull && half && i === full;
        return (
          <span
            key={i}
            className="relative inline-block leading-none"
            aria-hidden="true"
          >
            <span className="text-white/25">★</span>
            {(isFull || isHalf) && (
              <span
                className="absolute inset-0 text-amber-300"
                style={isHalf ? { clipPath: "inset(0 50% 0 0)" } : undefined}
              >
                ★
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = href ? (
    <a
      href={href}
      className="text-white/90 underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
    >
      {value}
    </a>
  ) : (
    <span className="text-white/90">{value}</span>
  );

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-[11px] tracking-[0.22em] uppercase text-white/60">
        {label}
      </div>
      <div className="text-sm leading-7 text-right">{content}</div>
    </div>
  );
}

export function SupplierReviewsPanel({ supplier }: { supplier: SupplierWithSlug }) {
  const reviews = makeDemoReviews(supplier);
  const email = `hello+${supplier.slug}@threadlink.demo`;
  const phone = "+234 810 000 0000";
  const whatsapp = "+234 810 000 0000";

  return (
    <section className="rounded-[28px] border border-white/10 bg-[var(--slate-panel)] p-7 sm:p-8 text-white">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
            Buyer reviews
          </div>
          <div className="mt-2 font-[family-name:var(--font-cormorant)] text-3xl tracking-tight">
            What past buyers say
          </div>
        </div>
        <Badge variant="slate">{reviews.length} reviews</Badge>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-white/5 px-5 py-4">
        <div className="space-y-1">
          <div className="text-[11px] tracking-[0.22em] uppercase text-white/60">
            Overall
          </div>
          <div className="flex items-center gap-3">
            <div className="font-[family-name:var(--font-cormorant)] text-3xl tracking-tight">
              {supplier.rating.toFixed(1)}
            </div>
            <Stars rating={supplier.rating} />
          </div>
        </div>
        <div className="text-sm text-white/70">
          Typical response: <span className="text-white">{supplier.responseTimeHours}h</span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {reviews.map((r, idx) => (
          <div
            key={`${r.buyerName}-${idx}`}
            className="rounded-[22px] border border-white/10 bg-[rgba(0,0,0,0.15)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <div className="font-[family-name:var(--font-cormorant)] text-xl tracking-tight">
                    {r.buyerName}
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <div className="mt-1 text-sm text-white/65">
                  Purchased for{" "}
                  <span className="text-white/85">{r.purchasedFor}</span> •{" "}
                  {r.monthsAgo}mo ago
                </div>
              </div>
              <Badge variant="slate">Verified</Badge>
            </div>
            <p className="mt-3 text-sm leading-7 text-white/75">{r.comment}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-[22px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
            Supplier contact
          </div>
          <Badge variant="slate">Direct</Badge>
        </div>

        <div className="mt-4 space-y-3">
          <ContactRow label="Email" value={email} href={`mailto:${email}`} />
          <ContactRow label="Phone" value={phone} href={`tel:${phone.replace(/\s/g, "")}`} />
          <ContactRow
            label="WhatsApp"
            value={whatsapp}
            href={`https://wa.me/${whatsapp.replace(/[+\s]/g, "")}`}
          />
          <ContactRow label="Location" value={`${supplier.city}, ${supplier.country}`} />
        </div>
      </div>
    </section>
  );
}

