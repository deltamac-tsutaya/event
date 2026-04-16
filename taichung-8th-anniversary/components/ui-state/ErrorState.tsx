import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <span className="text-4xl leading-none" aria-hidden>
        ⚠️
      </span>
      <p className="text-sm text-red-600">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="border-red-200 text-red-600 hover:bg-red-50"
        >
          重試
        </Button>
      )}
    </div>
  );
}
