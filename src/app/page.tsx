import { Nav } from "@/components/threadlink/nav";
import { SupplierExplorer } from "@/components/threadlink/supplier-cards";
import { SwatchStrip } from "@/components/threadlink/swatches";
import { getSuppliers } from "@/lib/supplier-data";

export default async function Home() {
  const suppliers = await getSuppliers();
  return (
    <div className="min-h-full bg-white">
      <Nav />

      <main>
        <section className="mx-auto max-w-6xl px-6 pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <div className="text-[11px] tracking-[0.22em] uppercase text-black/55">
                Textile sourcing for designers
              </div>
              <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-5xl leading-[1.02] tracking-tight sm:text-6xl">
                Find African textile suppliers that match your next collection.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-black/65">
                Big serif headlines, slate panels for contrast, and lots of white
                space—so the product floats. Filter suppliers client-side with
                zero database, then demo the “AI Match” on any profile page.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[var(--slate-panel-2)] p-8 text-white">
              <div className="text-[11px] tracking-[0.22em] uppercase text-white/70">
                Today’s demo
              </div>
              <div className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl tracking-tight">
                Claude-powered match
              </div>
              <p className="mt-3 text-sm leading-7 text-white/75">
                On a supplier profile, type what you’re making and get top 3
                suppliers with reasons. Great for the pitch moment.
              </p>
              <div className="mt-5 text-[11px] tracking-[0.22em] uppercase text-white/55">
                Paystack button is stubbed (no integration today)
              </div>
            </div>
          </div>
        </section>

        <SwatchStrip />

        <SupplierExplorer suppliers={suppliers} />
      </main>
    </div>
  );
}
