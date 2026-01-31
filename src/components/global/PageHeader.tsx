'use client'

import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    customBackgroundImage?: string;
    showBlueOverlay?: boolean;
    className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    description,
    customBackgroundImage,
    showBlueOverlay = true,
    className = ""
}) => {
    const backgroundImage = customBackgroundImage || "/bg-default-blue.png";
    
    return (
        <div 
            className={`bg-main-familiar pt-90 pb-5 mb-0 relative ${className}`}
            style={{
                backgroundImage: `url("${backgroundImage}")`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
            }}
        >
            {showBlueOverlay && (
                <div className=""></div>
            )}
            <div className="container max-w-[1280px] mx-auto px-4 text-center relative z-10">
                <h2 className="mb-4 text-white text-4xl font-bold">{title}</h2>
                {description && (
                    <p className="p-large text-white mb-12 text-lg">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PageHeader;
