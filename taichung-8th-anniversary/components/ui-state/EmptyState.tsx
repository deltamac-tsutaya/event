interface EmptyStateProps {
  message: string;
  icon?: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-gray-400">
      <span className="font-mono text-2xl font-bold text-[#1A2B4A]/20">∞</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
