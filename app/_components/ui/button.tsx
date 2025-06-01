// Localização provável: components/ui/button.tsx
// (ou onde quer que seus componentes da UI lib estejam, ex: app/_components/ui/button.tsx se você ajustou os imports)

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/_lib/utils"; // Usando o seu caminho para cn

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Usará --primary (laranja UniEats)
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90", // Usará --destructive (vermelho UniEats)
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Usará --border, --background, --accent UniEats
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80", // Usará --secondary (laranja claro UniEats)
        ghost: "hover:bg-accent hover:text-accent-foreground", // Usará --accent (amarelo UniEats no hover)
        link: "text-primary underline-offset-4 hover:underline", // Usará --primary (laranja UniEats)
      },
      size: {
        default: "h-10 py-2", // Seu tamanho padrão (sem padding horizontal explícito aqui, virá do px- se usado)
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
