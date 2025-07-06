'use client';

interface PageTitleProps {
    title: string;
    subtitle?: string;
}

export default function PageTitle({ title, subtitle }: PageTitleProps) {
    return (

        < div className="text-center space-y-2 mb-16" >
            <h1 className="text-display max-w-4xl mx-auto">
                {title}
            </h1>
            <p className="text-subtitle max-w-2xl mx-auto text-[rgb(var(--color-text-light))]">
                {subtitle}
            </p>
        </div>
    );
} 