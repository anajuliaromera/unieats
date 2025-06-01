// Localização provável: components/ui/badge.tsx
// (ou onde quer que seus componentes da UI lib estejam)

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/_lib/utils"; // Usando o seu caminho para cn

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80", // Usará --primary (laranja UniEats)
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80", // Usará --secondary (laranja claro UniEats)
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80", // Usará --destructive (vermelho UniEats)
        outline: "text-foreground", // Usará --foreground (cinza escuro UniEats)
        // Variante UniEats Accent (amarelo)
        uniAccent:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/80 shadow-sm", // Usará --accent e --accent-foreground
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
Badge.displayName = "Badge";

export { Badge, badgeVariants };
