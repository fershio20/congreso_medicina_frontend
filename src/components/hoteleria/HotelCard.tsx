'use client'

import React from "react";

interface HotelCardProps {
    name: string;
    phone: string;
    distance: string;
    imageSrc?: string;
    showGetDirections?: boolean;
    googleMapsUrl?: string;
    email?: string;
}

const HotelCard: React.FC<HotelCardProps> = ({
    name,
    phone,
    distance,
    imageSrc = "/hotel-default.jpg",
    showGetDirections = true,
    googleMapsUrl,
    email,
}) => {
    const handleGetDirections = () => {
        // Use provided Google Maps URL or fallback to search
        if (googleMapsUrl) {
            window.open(googleMapsUrl, '_blank');
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
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="p-4 text-left">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{name}</h3>
                
                <div className="space-y-2 mb-4">
                    {/* Phone with mobile icon */}
                    <div className="flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <button 
                            onClick={handlePhoneClick}
                            className="text-gray-600 hover:text-gray-800 underline cursor-pointer transition-colors duration-200"
                        >
                            {phone}
                        </button>
                    </div>

                    {/* Distance with icon */}
                    <div className="flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{distance}</span>
                    </div>

                    {/* Email with icon (if available) */}
                    {email && (
                        <div className="flex items-center text-gray-600 text-sm">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <button 
                                onClick={handleEmailClick}
                                className="text-gray-600 hover:text-gray-800 underline cursor-pointer transition-colors duration-200"
                            >
                                {email}
                            </button>
                        </div>
                    )}
                </div>

                {/* Full width button */}
                {showGetDirections && (
                    <button 
                        onClick={handleGetDirections}
                        className="w-full bg-[var(--secondary-color)] hover:bg-[#045084] text-white px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Como llegar
                    </button>
                )}
            </div>
        </div>
    );
};

export default HotelCard;
