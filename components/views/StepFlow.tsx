export default function StepFlow({ steps }: { steps: string[] }) {
    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {steps.map((s, idx) => (
                    <div key={s} className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                            {idx + 1}
                        </div>
                        <div className="text-sm font-medium">{s}</div>
                        {idx < steps.length - 1 && (
                            <div className="hidden sm:block text-muted-foreground px-2">→</div>
                        )}
                    </div>
                ))}
            </div>
            <div className="sm:hidden mt-2">
                <div className="flex flex-col gap-2">
                    {steps.map((s, idx) => (
                        <div key={s} className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/6 text-xs">{idx + 1}</div>
                            <div className="text-sm">{s}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
