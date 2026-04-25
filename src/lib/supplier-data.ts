import fs from "node:fs/promises";
import path from "node:path";

export type Supplier = {
  name: string;
  city: string;
  country: string;
  fabrics: string[];
  moq: number;
  pricePerYardUsd: number;
  rating: number;
  responseTimeHours: number;
  notes: string;
};

export type SupplierWithSlug = Supplier & { slug: string };

export function slugifySupplierName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getSuppliers(): Promise<SupplierWithSlug[]> {
  const filePath = path.join(process.cwd(), "data", "suppliers.json");
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as Supplier[];
  return parsed.map((s) => ({
    ...s,
    slug: slugifySupplierName(s.name),
  }));
}

export async function getSupplierBySlug(slug: string) {
  const all = await getSuppliers();
  return all.find((s) => s.slug === slug) ?? null;
}

