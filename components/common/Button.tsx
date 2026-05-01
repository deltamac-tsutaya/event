import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-cream border border-black hover:bg-green-ink hover:border-green-ink focus-visible:ring-black",
        secondary:
          "bg-cream text-black border border-black hover:border-green-ink hover:bg-gray-light focus-visible:ring-black",
        accent:
          "bg-green-ink text-cream border border-green-ink hover:bg-red-wine hover:border-red-wine focus-visible:ring-green-ink",
        ghost:
          "text-black border border-black hover:bg-cream focus-visible:ring-black",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      href,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // If href is provided and it's an external link, render as anchor
    if (href && !asChild) {
      return (
        <a
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {isLoading ? <span className="inline-block animate-spin">⟳</span> : children}
        </a>
      );
    }

    // If href is provided and asChild is true, render as Link
    if (href && asChild) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {isLoading ? <span className="inline-block animate-spin">⟳</span> : children}
        </Link>
      );
    }

    // Otherwise render as button
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? <span className="inline-block animate-spin">⟳</span> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
