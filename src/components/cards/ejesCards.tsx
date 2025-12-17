import React from "react";

interface ThematicCardProps {
    title: string;
    description: string[];
    iconImg: string | null;
}

const EjesCards: React.FC<ThematicCardProps> = ({title, description, iconImg}) => {
    return (
        <div
            className="cursor-pointer rounded rounded-lg relative group w-full h-[300px] bg-white overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#e6f0f3] hover:border hover:border-[#E6F0F3] border border-transparent">
            <div className="absolute w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={iconImg ? iconImg : "ejes-img.png"}
                    alt={title}
                    className="w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                />
            </div>
            <div className="absolute w-full h-full bg-[#e6f0f3]/75 flex flex-col items-center justify-center p-4">
                <h5 className="text-xl font-bold text-[#104f5e] text-center mb-2 transition-all duration-300
                ease-in-out group-hover:mb-4 group-hover:-translate-y-8">
                    {title}
                </h5>
                <ul className="space-y-1 text-[#333] text-sm opacity-0 translate-y-4 transition-all duration-300
                ease-in-out group-hover:opacity-100 group-hover:translate-y-0">
                    {description.map((item, idx) => (
                        <li className="font-body" key={idx}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EjesCards;
