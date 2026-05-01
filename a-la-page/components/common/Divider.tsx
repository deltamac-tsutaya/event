import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const dividerVariants = cva("", {
  variants: {
    variant: {
      gold: "border-t border-gold-champagne opacity-50",
      black: "border-t border-black opacity-30",
      light: "border-t border-gray-light",
    },
    spacing: {
      sm: "my-4",
      md: "my-8",
      lg: "my-12",
      xl: "my-16",
    },
    fullWidth: {
      true: "w-full",
      false: "w-16 mx-auto",
    },
  },
  defaultVariants: {
    variant: "gold",
    spacing: "lg",
    fullWidth: false,
  },
});

interface DividerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof dividerVariants> {}

export function Divider({ className, variant, spacing, fullWidth, ...props }: DividerProps) {
  return (
    <div
      className={cn(dividerVariants({ variant, spacing, fullWidth, className }))}
      {...props}
    />
  );
}

export default Divider;
