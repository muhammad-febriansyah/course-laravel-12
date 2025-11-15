import { useState, useEffect } from 'react';
import type { ApexOptions } from 'apexcharts';

interface StatusDonutChartProps {
    data: Array<{ label: string; value: number }>;
}

const STATUS_COLORS: Record<string, string> = {
    'Berhasil': '#10b981',
    'Menunggu': '#f59e0b',
    'Kadaluarsa': '#94a3b8',
    'Gagal': '#ef4444',
    'Refund': '#8b5cf6',
};

export function StatusDonutChart({ data }: StatusDonutChartProps) {
    const [Chart, setChart] = useState<any>(null);

    useEffect(() => {
        import('react-apexcharts').then((mod) => {
            setChart(() => mod.default);
        });
    }, []);

    const series = data.map((item) => item.value);
    const labels = data.map((item) => item.label);
    const colors = labels.map((label) => STATUS_COLORS[label] || '#94a3b8');

    const options: ApexOptions = {
        chart: {
            type: 'donut',
            height: 300,
        },
        colors: colors,
        labels: labels,
        dataLabels: {
            enabled: true,
            formatter: (val: number) => {
                return `${val.toFixed(1)}%`;
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#1e293b',
                        },
                        value: {
                            show: true,
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#0f172a',
                            formatter: (val: string) => {
                                return val;
                            },
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#64748b',
                            formatter: (w) => {
                                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return total.toString();
                            },
                        },
                    },
                },
            },
        },
        legend: {
            position: 'bottom',
            fontSize: '13px',
            fontWeight: 500,
            labels: {
                colors: '#64748b',
            },
            markers: {
                width: 12,
                height: 12,
                radius: 3,
            },
            itemMargin: {
                horizontal: 10,
                vertical: 5,
            },
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value) => {
                    return `${value} transaksi`;
                },
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        height: 250,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
    };

    if (!Chart) {
        return (
            <div className="flex h-[300px] items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading chart...</div>
            </div>
        );
    }

    return (
        <Chart
            options={options}
            series={series}
            type="donut"
            height={300}
        />
    );
}
