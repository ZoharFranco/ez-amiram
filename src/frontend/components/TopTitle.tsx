'use client';

interface TopTitleProps {
    title: string;
    subtitle?: string;
}

export default function TopTitle({ title, subtitle }: TopTitleProps) {
    return (

        < div className="text-center space-y-6 mb-16 mt 10" >
            <h1 className="text-display max-w-4xl mx-auto">
                {title}
            </h1>
            <p className="text-subtitle max-w-2xl mx-auto text-[rgb(var(--color-text-light))]">
                {subtitle}
            </p>
        </div>
    );
} 