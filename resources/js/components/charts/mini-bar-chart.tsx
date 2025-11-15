import { cn } from '@/lib/utils';

interface MiniBarChartProps {
    data: { label: string; value: number }[];
    className?: string;
}

export function MiniBarChart({ data, className }: MiniBarChartProps) {
    if (!data.length) {
        return <div className={cn('h-32 w-full rounded-lg bg-muted/30', className)} />;
    }

    const maxValue = Math.max(...data.map((item) => item.value), 1);

    return (
        <div className={cn('grid h-32 w-full grid-cols-5 items-end gap-2', className)}>
            {data.map((item) => (
                <div key={item.label} className="flex h-full flex-col items-center justify-end gap-2 text-xs">
                    <div
                        className="w-full rounded-full bg-gradient-to-t from-primary/40 via-primary/70 to-primary"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                    />
                    <span className="text-center text-[10px] text-muted-foreground">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
