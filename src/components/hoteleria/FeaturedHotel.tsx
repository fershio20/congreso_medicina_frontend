'use client'

import React from "react";

interface FeaturedHotelProps {
    name: string;
    description: string;
    address: string;
    phone: string;
    imageSrc: string;
    mapLocation?: string;
    email?: string;
}

const FeaturedHotel: React.FC<FeaturedHotelProps> = ({
    name,
    description,
    address,
    phone,
    imageSrc,
    mapLocation,
    email,
}) => {
    const handleGetDirections = () => {
        // Use provided map location or fallback to search
        if (mapLocation) {
            window.open(mapLocation, '_blank');
        } else {
            const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " Asunción Paraguay")}`;
            window.open(fallbackUrl, '_blank');
        }
    };

    const handlePhoneClick = () => {
        window.open(`tel:${phone}`, '_self');
    };

    const handleEmailClick = () => {
        if (email) {
            window.open(`mailto:${email}`, '_self');
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Hotel Image */}
                <div className="relative h-80 lg:h-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageSrc}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                
                {/* Hotel Information */}
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{name}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                        {description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                        <p className="text-gray-600">
                            <span className="font-semibold">Dirección:</span> {address}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-semibold">Teléfono del hotel:</span>{" "}
                            <button 
                                onClick={handlePhoneClick}
                                className="text-gray-600 hover:text-gray-800 underline cursor-pointer transition-colors duration-200"
                            >
                                {phone}
                            </button>
                        </p>
                        {email && (
                            <p className="text-gray-600">
                                <span className="font-semibold">Email:</span>{" "}
                                <button 
                                    onClick={handleEmailClick}
                                    className="text-gray-600 hover:text-gray-800 underline cursor-pointer transition-colors duration-200"
                                >
                                    {email}
                                </button>
                            </p>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleGetDirections}
                        className="bg-[var(--secondary-color)] hover:bg-[#045084] text-white px-6 py-3 rounded-md text-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                        Como llegar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturedHotel;
