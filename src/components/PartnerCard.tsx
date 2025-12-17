import React from "react";

interface PartnerCardProps {
    logoSrc: string;
    altText: string;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ logoSrc, altText }) => {
    return (
        <div className="w-[150px] md:w-[250px] h-[150px] md:h-[250px] bg-white  border-gray-200 rounded-md flex
        items-center justify-center p-1 md:p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt={altText} className="w-full p-1 md:p-6 object-contain" />
        </div>
    );
};

export default PartnerCard;
