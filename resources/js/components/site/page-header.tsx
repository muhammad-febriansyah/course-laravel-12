interface PageHeaderProps {
    title: string;
    description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <section
            className="relative w-full overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #2547F9 0%, #1e3fd4 100%)',
            }}
        >
            {/* X Pattern Background */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-32 text-center sm:px-6 sm:pb-24 sm:pt-36 lg:px-8">
                {/* Main Heading */}
                <h1 className="mb-5 text-4xl font-bold text-white sm:text-5xl">
                    {title}
                </h1>

                {/* Description */}
                {description && (
                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-blue-100 sm:text-lg sm:leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </section>
    );
}
