import React, { useState } from "react";

interface ExpertCardProps {
    name: string;
    specialty: string;
    description?: string;
    imageSrc?: string;
}

const ExpertCard: React.FC<ExpertCardProps> = ({
    name,
    specialty,
    description,
    imageSrc,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Default silhouette image if no image is provided
    const defaultImage = "https://cdn-icons-png.flaticon.com/512/1077/1077012.png";
    const imageUrl = imageSrc || defaultImage;

    return (
        <div 
            className="relative border border-gray-200 rounded-lg group cursor-pointer overflow-hidden bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Card Content - Positioned behind the description overlay */}
            <div className="w-full h-full">
                {/* Image Section - Full width, 250px height */}
                <div className="flex justify-center items-center flex-col
                w-full h-[250px] overflow-hidden bg-white rounded-t-lg py-8">
                    <img
                        src={imageUrl}
                        alt={`${name} photo`}
                        className="w-auto h-full object-contain mx-auto
                                    transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            // Fallback to default image if the provided image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = defaultImage;
                        }}
                    />
                </div>

                {/* Body Section - 120px height, 16px padding */}
                <div className="bg-white p-5 h-35 rounded-b-lg flex flex-col justify-center items-center">
                    {/* Expert name - centered */}
                    <h5 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 text-center">
                        {name}
                    </h5>

                    {/* Specialty badge */}
                    <div className="mb-3">
                        <div className="mt-2">
                            <p className="text-xs text-blue-800 font-semibold text-center">
                                {specialty}
                            </p>
                        </div>
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-indigo-100 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
            </div>

            {/* Description Overlay - Spans entire card with different background */}
            {description && (
                <div 
                    className={`absolute inset-0 bg-blue-50/95 backdrop-blur-sm rounded-lg flex items-center justify-center p-6 transition-all duration-300 ease-in-out ${
                        isHovered 
                            ? 'opacity-100 pointer-events-auto' 
                            : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <div className="text-center max-w-full">
                        <h6 className="text-lg font-semibold text-blue-900 mb-3">
                            {name}
                        </h6>
                        <p className="text-[11px] text-blue-800 leading-relaxed text-justify">
                            {description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpertCard;
