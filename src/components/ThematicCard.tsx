'use client'

import React from "react";

interface ThematicCardProps {
    title: string;
    description: string;
    iconImg: string | null;
    main_color?: string | null;
    color?: string;
    isExpanded?: boolean;
    onExpand?: () => void;
}

const ThematicCard: React.FC<ThematicCardProps> = ({
                                                       title,
                                                       description,
                                                       main_color,
                                                       color = "#333",
                                                       isExpanded = false,
                                                       onExpand,
                                                   }) => {
    const hasDescription = Boolean(description);

    const handleClick = (e: React.MouseEvent) => {
        if (!hasDescription) return;
        e.preventDefault();
        onExpand?.();
    };

    return (

            <div
                className={`group relative w-full sm:max-w-sm md:max-w-full p-6 pl-10 h-[300px] hover:cursor-pointer bg-white border border-gray-200 hover:border-2 hover:border-gray-200 rounded-lg transition-all ease-in-out hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 gap-10 group-hover:h-[300px] md:group-hover:h-[300px] group-[.expanded]:h-[300px] md:group-[.expanded]:h-[230px] ${isExpanded ? "expanded" : ""}`}
                onClick={handleClick}
                role={hasDescription ? "button" : undefined}
                tabIndex={hasDescription ? 0 : undefined}
                onKeyDown={hasDescription ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onExpand?.(); } } : undefined}
            >
                {/* Barra que se expande */}
                {color && (
                    <div
                        className="absolute top-0 left-0 h-full w-full origin-left scale-x-[0.035] group-hover:scale-x-100 group-[.expanded]:scale-x-100 transition-transform duration-[750ms] ease-in-out z-0"
                        style={{ backgroundColor: color, opacity: 0.75 }}
                    />
                )}

                {/* Contenido base */}
                <div className="h-full flex flex-col justify-center relative z-10">
                    <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white group-hover:opacity-0 group-[.expanded]:opacity-0 transition-all duration-200">
                        {title}
                    </h5>

                    {(main_color && !color) && (
                        <div className="h-[5px] w-1/3" style={{ backgroundColor: main_color }} />
                    )}
                </div>

                {/* Overlay description (aparece con hover en desktop, click en mobile). overflow-y-auto para scroll cuando el contenido es largo */}
                {hasDescription && (
                    <div
                        className={[
                            "absolute inset-0 w-full h-full p-5 rounded-lg overflow-y-auto flex flex-col justify-center",
                            "opacity-0 pointer-events-none",
                            "transition-opacity duration-300 ease-in-out delay-0",
                            "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:delay-[750ms]",
                            "group-[.expanded]:opacity-100 group-[.expanded]:pointer-events-auto",
                            "z-20",
                        ].join(" ")}
                        style={
                            color
                                ? { backgroundColor: color, color: "#FFF" }
                                : { backgroundColor: "#FFF", color: "#111" }
                        }
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                )}
            </div>

    );
};

export default ThematicCard;
