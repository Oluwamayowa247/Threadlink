import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs tracking-[0.14em] uppercase whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "border-black/10 bg-white text-black hover:bg-black/[0.03]",
        accent:
          "border-[#b85c2a]/25 bg-[#b85c2a]/10 text-[#7a3416] hover:bg-[#b85c2a]/15",
        slate:
          "border-white/10 bg-white/10 text-white hover:bg-white/15 backdrop-blur",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

