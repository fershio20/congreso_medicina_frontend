import React from "react";

interface ThematicCardProps {
    title: string;
    description: string;
    iconImg: string | null;
    main_color?: string | null;
    color?: string;
}

const ThematicCard: React.FC<ThematicCardProps> = ({
                                                       title,
                                                       description,
                                                       main_color,
                                                       color = "#333",
                                                   }) => {
    const hasDescription = Boolean(description);

    console.log('hasDescription', hasDescription);

    return (
        <div className="relative">
            <div className="group relative w-full overflow-hidden sm:max-w-sm md:max-w-full p-6 pl-10 h-[230px] hover:cursor-pointer bg-[#fff] border border-gray-200 hover:border-2 hover:border-blue-800 rounded-lg transition-all ease-in-out hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 gap-10">
                {/* Barra que se expande */}
                {color && (
                    <div
                        className="absolute top-0 left-0 h-full w-full origin-left scale-x-[0.035] group-hover:scale-x-100 transition-transform duration-[750ms] ease-in-out z-0"
                        style={{ backgroundColor: color, opacity: 0.75 }}
                    />
                )}

                {/* Contenido base */}
                <div className="h-full flex flex-col justify-center relative z-10">
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white group-hover:opacity-0 transition-all duration-200">
                            {title}
                        </h5>
                    </a>

                    {(main_color && !color) && (
                        <div className="h-[5px] w-1/3" style={{ backgroundColor: main_color }} />
                    )}
                </div>

                {/* Overlay description (aparece después de 750ms) */}
                {hasDescription && (
                    <div
                        className={[
                            "absolute top-0 left-0 w-full h-full p-5 rounded-lg",
                            "opacity-0 pointer-events-none",
                            "transition-opacity duration-300 ease-in-out delay-0",
                            "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:delay-[750ms]",
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
        </div>
    );
};

export default ThematicCard;
