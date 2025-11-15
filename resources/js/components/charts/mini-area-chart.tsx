import { cn } from '@/lib/utils';

interface MiniAreaChartProps {
    data: { label: string; value: number }[];
    className?: string;
    showAxis?: boolean;
}

export function MiniAreaChart({ data, className, showAxis = false }: MiniAreaChartProps) {
    if (!data.length) {
        return <div className={cn('h-32 w-full rounded-lg bg-muted/30', className)} />;
    }

    const maxValue = Math.max(...data.map((item) => item.value), 1);
    const height = 100;
    const width = 100;
    const points = data.map((item, index) => {
        const x = (index / Math.max(data.length - 1, 1)) * width;
        const y = height - (item.value / maxValue) * height;
        return `${x},${Number.isFinite(y) ? y : height}`;
    });

    const polygonPoints = [`0,${height}`, ...points, `${width},${height}`].join(' ');

    return (
        <div className={cn('relative h-32 w-full', className)}>
            <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
                <defs>
                    <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                <polygon points={polygonPoints} fill="url(#areaGradient)" />
                <polyline
                    points={points.join(' ')}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </svg>
            {showAxis ? (
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-muted-foreground">
                    <span>{maxValue.toLocaleString('id-ID')}</span>
                    <span>0</span>
                </div>
            ) : null}
        </div>
    );
}
