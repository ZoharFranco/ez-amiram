'use client';

import Image from 'next/image';

interface PageTitleProps {
    title: string;
    subtitle?: string;
    color?: string;
    useImage?: boolean;
}

export default function PageTitle({ title, subtitle, color = 'green', useImage = true }: PageTitleProps) {
    const getColorClasses = (color: string) => {
        const colorMap: { [key: string]: string } = {
            red: 'from-red-600 to-red-700',
            blue: 'from-blue-600 to-blue-700',
            green: 'from-green-600 to-green-700',
            purple: 'from-purple-600 to-purple-700',
            orange: 'from-orange-600 to-orange-700',
            pink: 'from-pink-600 to-pink-700',
            indigo: 'from-indigo-600 to-indigo-700',
            yellow: 'from-yellow-600 to-yellow-700',
            teal: 'from-teal-600 to-teal-700',
            cyan: 'from-cyan-600 to-cyan-700',
        };
        return colorMap[color] || colorMap.red;
    };

    const getInnerColorClasses = (color: string) => {
        const colorMap: { [key: string]: string } = {
            red: 'from-red-400/60 to-red-500/60',
            blue: 'from-blue-400/60 to-blue-500/60',
            green: 'from-green-400/60 to-green-500/60',
            purple: 'from-purple-400/60 to-purple-500/60',
            orange: 'from-orange-400/60 to-orange-500/60',
            pink: 'from-pink-400/60 to-pink-500/60',
            indigo: 'from-indigo-400/60 to-indigo-500/60',
            yellow: 'from-yellow-400/60 to-yellow-500/60',
            teal: 'from-teal-400/60 to-teal-500/60',
            cyan: 'from-cyan-400/60 to-cyan-500/60',
        };
        return colorMap[color] || colorMap.red;
    };

    return (
        <div className="text-center space-y-2 mb-16">
            {useImage && (<div className="flex flex-col items-center text-center mt-4">
                <div className="relative group mb-4">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${getInnerColorClasses(color)} rounded-full blur-xl group-hover:blur-2xl transition-all duration-500`} />
                    <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${getInnerColorClasses(color)} rounded-full blur-lg`} />
                        <Image
                            src="/professor.png"
                            alt="AI Professor"
                            width={140}
                            height={140}
                            className="rounded-full relative border-4 border-white/10 shadow-2xl transform group-hover:scale-105 transition-all duration-500"
                        />
                    </div>
                </div>
            </div>)}
            <h1 className={`text-display max-w-4xl mx-auto bg-gradient-to-r ${getColorClasses(color)} bg-clip-text text-transparent`}>
                {title}
            </h1>
            <p className="text-subtitle max-w-2xl mx-auto text-[rgb(var(--color-text-light))]">
                {subtitle}
            </p>
        </div>
    );
}