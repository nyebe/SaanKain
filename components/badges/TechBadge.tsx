export default function TechBadge({ label }: { label: string }) {
  return (
    <span className="text-xs px-2 py-1 bg-white/4 rounded-md border border-white/6">{label}</span>
  )
}
