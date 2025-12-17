"use client";


import React from "react";



interface CountdownCardProps {
    value: number;
    label: string;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ value, label }) => {
    return (
        <div className="flex flex-col items-center justify-center  h-[100px] md:h-[250px]">
            <span className="text-4xl md:text-6xl font-bold font-heading text-white">{value}</span>
            <span className="text-small md:text-2xl  font-body text-blue-300">{label}</span>
        </div>
    );
};

export default CountdownCard;
