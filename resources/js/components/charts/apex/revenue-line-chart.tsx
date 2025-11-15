import { useState, useEffect } from 'react';
import type { ApexOptions } from 'apexcharts';

interface RevenueLineChartProps {
    data: Array<{ label: string; value: number }>;
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
    const [Chart, setChart] = useState<any>(null);

    useEffect(() => {
        import('react-apexcharts').then((mod) => {
            setChart(() => mod.default);
        });
    }, []);

    const series = [
        {
            name: 'Revenue',
            data: data.map((item) => item.value),
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        colors: ['#f97316'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 90, 100],
            },
        },
        xaxis: {
            categories: data.map((item) => item.label),
            labels: {
                style: {
                    colors: '#64748b',
                    fontSize: '12px',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#64748b',
                    fontSize: '12px',
                },
                formatter: (value) => {
                    return `Rp ${(value / 1000).toFixed(0)}k`;
                },
            },
        },
        grid: {
            borderColor: '#e2e8f0',
            strokeDashArray: 4,
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value) => {
                    return `Rp ${value.toLocaleString('id-ID')}`;
                },
            },
        },
    };

    if (!Chart) {
        return (
            <div className="flex h-[350px] items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading chart...</div>
            </div>
        );
    }

    return (
        <Chart
            options={options}
            series={series}
            type="area"
            height={350}
        />
    );
}
