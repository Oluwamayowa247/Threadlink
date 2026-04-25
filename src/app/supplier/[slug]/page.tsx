import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Nav } from "@/components/threadlink/nav";
import { getSupplierBySlug, getSuppliers } from "@/lib/supplier-data";
import { SupplierReviewsPanel } from "./supplier-reviews-panel";

export async function generateStaticParams() {
  const suppliers = await getSuppliers();
  return suppliers.map((s) => ({ slug: s.slug }));
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

export default async function SupplierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supplier = await getSupplierBySlug(slug);
  if (!supplier) notFound();

  return (
    <div className="min-h-full bg-white">
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
              Supplier profile
            </div>
            <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl leading-[1.02] tracking-tight">
              {supplier.name}
            </h1>
            <div className="mt-3 text-base text-black/65">
              {supplier.city}, {supplier.country}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="accent">{supplier.rating.toFixed(1)} / 5</Badge>
            <Badge>{supplier.responseTimeHours}h response</Badge>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-[28px] border border-black/5 bg-white p-7 sm:p-8">
            <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
              Fabrics
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {supplier.fabrics.map((f) => (
                <Badge key={f}>{f}</Badge>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 text-sm text-black/70">
              <Meta k="MOQ" v={`${supplier.moq}`} />
              <Meta k="From" v={formatUsd(supplier.pricePerYardUsd)} />
              <Meta k="City" v={supplier.city} />
            </div>

            <div className="mt-8 rounded-[22px] border border-black/5 bg-black/[0.02] p-6">
              <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
                Notes
              </div>
              <p className="mt-3 text-sm leading-7 text-black/65">
                {supplier.notes}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/"
                className="text-[11px] tracking-[0.22em] uppercase text-black/55 hover:text-black/75"
              >
                ← Back to suppliers
              </Link>

              <button
                type="button"
                className="rounded-full border border-[#b85c2a]/25 bg-[#b85c2a]/10 px-5 py-2 text-xs font-medium tracking-[0.14em] uppercase text-[#7a3416] hover:bg-[#b85c2a]/15"
              >
                Pay with Paystack (stub)
              </button>
            </div>
          </section>

          <SupplierReviewsPanel supplier={supplier} />
        </div>
      </main>
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

