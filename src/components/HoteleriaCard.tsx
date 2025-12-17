import React from "react";

interface ExpertCardProps {
    name: string;
    specialty: string;
    description: string;
    imageSrc?: string;
}

const HoteleriaCard: React.FC<ExpertCardProps> = ({
                                                   name,
                                                   specialty,
                                                   description,
                                                   imageSrc = "/ejes/eje-abordaje.jpg",
                                               }) => {
    return (
        <div className="transition hover:shadow-xl transition-shadow duration-300 ease-in-out
        cursor-pointer flex flex-col items-center text-center space-y-3 group p-4
        border border-gray-200 rounded-lg">
            <div className="w-full relative h-60 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt={name}
                    className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-expert-gradient pointer-events-none"></div>
            </div>
            <h5 className="text-[24px] font-bold mb-0">{name}</h5>
            <p className="p-large font-semibold mb-0">{specialty}</p>
            <p className="p-large mb-0">{description}</p>
        </div>
    );
};

export default HoteleriaCard;
