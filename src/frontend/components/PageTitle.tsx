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
        return   colorMap[color] || colorMap.red;
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
        <div
            className="
                mb-8
                mr-4 ml-4
                space-y-2 space-x-4
                items-start
                text-start
                sm:mr-4 sm:ml-4
                md:mr-0 md:ml-0
                md:items-center
                md:text-center
                md:flex md:flex-col
            "
        >
            {useImage && (
                <div
                    className="
                        flex flex-row items-end text-start mt-4
                        md:justify-center md:items-center md:text-center
                    "
                >
                    <div className="relative group mb-4 flex-shrink-0 w-32 h-32 md:w-48 md:h-48 mx-auto md:mx-0">
                        <div className={`absolute -inset-2 bg-gradient-to-r ${getInnerColorClasses(color)} rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500`} />
                        <div className="relative w-32 h-32 md:w-48 md:h-48">
                            <div className={`absolute inset-0 bg-gradient-to-r ${getInnerColorClasses(color)} rounded-full blur-xl`} />
                            <Image
                                src="/professor.png"
                                alt="AI Professor"
                                width={192}
                                height={192}
                                className="rounded-full relative border-4 border-white/10 shadow-2xl transform transition-all duration-500 w-32 h-32 md:w-48 md:h-48"
                            />
                        </div>
                    </div>
                    <div
                        className="
                            flex flex-col
                            items-start text-start mr-6 justify-center h-32 md:h-48
                        "
                    >
                        <h1
                            className={`
                                text-start text-3xl md:text-7xl font-bold leading-tight
                                bg-clip-text text-transparent bg-gradient-to-r ${getColorClasses(color)}
                            `}
                        >
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-lg md:text-3xl text-[rgb(var(--color-text-light))]">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}