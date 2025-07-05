'use client';

interface PageTitleProps {
    title: string;
    subtitle?: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
    return (
        <div className="mb-8">
            <h1 className="text-display mb-2">{title}</h1>
            {subtitle && (
                <p className="text-subtitle">{subtitle}</p>
            )}
        </div>
    );
} 