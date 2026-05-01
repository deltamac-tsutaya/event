import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-8 h-8",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
    },
    color: {
      black: "text-black",
      cream: "text-cream",
      green: "text-green-ink",
    },
  },
  defaultVariants: {
    size: "md",
    color: "black",
  },
});

interface LoadingSpinnerProps extends Omit<React.SVGAttributes<SVGElement>, 'color'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'black' | 'cream' | 'green';
}

export function LoadingSpinner({ className, size, color, ...props }: LoadingSpinnerProps) {
  return (
    <svg
      className={cn(spinnerVariants({ size, color, className }))}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  fullPage?: boolean;
  message?: string;
}

export function LoadingOverlay({
  isLoading,
  fullPage = false,
  message = "載入中...",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullPage && "fixed inset-0 bg-black/50 z-50"
      )}
    >
      <LoadingSpinner size="lg" color={fullPage ? "cream" : "black"} />
      {message && (
        <p className={cn("text-sm", fullPage ? "text-cream" : "text-gray-dark")}>
          {message}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;
