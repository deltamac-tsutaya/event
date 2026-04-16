interface EmptyStateProps {
  message: string;
  icon?: string;
}

export default function EmptyState({ message, icon = "📭" }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-gray-400">
      <span className="text-4xl leading-none" aria-hidden>
        {icon}
      </span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
