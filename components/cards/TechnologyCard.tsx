import { FC } from 'react';

export const TechnologyCard: FC<{ title: string; items: string[] }> = ({ title, items }) => {
    return (
        <div className="border border-white/6 rounded-md p-3 bg-white/2">
            <div className="text-sm font-semibold mb-2">{title}</div>
            <div className="flex flex-wrap gap-2">
                {items.map((it) => (
                    <span key={it} className="text-xs px-2 py-1 bg-white/5 rounded-md">{it}</span>
                ))}
            </div>
        </div>
    )
}

export default TechnologyCard
