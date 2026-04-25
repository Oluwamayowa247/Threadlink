import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black shadow-sm transition-colors",
          "placeholder:text-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85c2a]/30 focus-visible:border-[#b85c2a]/60",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

