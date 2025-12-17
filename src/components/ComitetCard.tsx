import React from "react";

interface ExpertCardProps {
    name: string;
    specialty: string;
    description?: string;
    avatar?: string;
}

const ExpertCard: React.FC<ExpertCardProps> = ({
                                                   name,
                                                   specialty,
                                                   description,
                                                   avatar,
                                               }) => {
    return (
        <div className="transition hover:shadow-xl duration-300 ease-in-out cursor-pointer flex flex-col
        items-center text-center space-y-3 group p-4 border-transparent hover:border hover:border-gray-200 rounded-lg">
            { avatar && (
                <div className="relative w-46 h-46 overflow-hidden rounded-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={avatar}
                        alt={name}
                        className="w-full h-full object-cover object-center rounded-full transform transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                <div className="absolute inset-0 rounded-full bg-expert-gradient pointer-events-none"></div>
            </div>
            )}
            <h5 className="text-[18px] text-[#626c72] font-medium mb-0">{name}</h5>
            <p className=" mb-0">{specialty}</p>
            <p className=" mb-0">{description && description}</p>
        </div>
    );
};

export default ExpertCard;
