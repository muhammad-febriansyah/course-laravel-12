interface StatsHighlightProps {
    stats: {
        totalCourses: number;
        totalStudents: number;
        totalInstructors: number;
    };
}

export function StatsHighlight({ stats }: StatsHighlightProps) {
    const items = [
        {
            label: 'Kursus Aktif',
            value: stats.totalCourses.toLocaleString('id-ID'),
        },
        {
            label: 'Siswa Bergabung',
            value: stats.totalStudents.toLocaleString('id-ID'),
        },
        {
            label: 'Instruktur Ahli',
            value: stats.totalInstructors.toLocaleString('id-ID'),
        },
    ];

    return (
        <section className="grid gap-4 rounded-3xl border bg-background/90 p-6 shadow-sm backdrop-blur-sm md:grid-cols-3">
            {items.map((item) => (
                <div key={item.label} className="rounded-2xl bg-muted/40 p-6">
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-3xl font-semibold">{item.value}</p>
                </div>
            ))}
        </section>
    );
}
