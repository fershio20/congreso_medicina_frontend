'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface PreTallerImageCardProps {
    imageSrc: string;
    name: string;
    documento?: {
        url: string;
        name?: string;
    };
}

const PreTallerImageCard: React.FC<PreTallerImageCardProps> = ({
    imageSrc,
    name,
    documento
}) => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const openLightbox = () => {
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const handleVerDetalles = () => {
        if (documento?.url) {
            window.open(documento.url, '_blank');
        }
    };

    return (
        <>
            <div className="relative w-full h-[380px] sm:h-[380px] md:h-[400px] lg:h-[430px] overflow-hidden cursor-pointer group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageSrc}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover overlay with translucent black background */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center space-y-3">
                    <Button
                        onClick={openLightbox}
                        variant="outline"
                        size="lg"
                        className="bg-white/90 text-black hover:bg-white border-white hover:border-white transition-all duration-300 transform group-hover:scale-110"
                    >
                        <Eye className="w-5 h-5 mr-2" />
                        Ver flyer
                    </Button>
                    
                    {documento?.url && (
                        <Button
                            onClick={handleVerDetalles}
                            variant="principal"
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 transition-all duration-300 transform group-hover:scale-110"
                        >
                            <FileText className="w-5 h-5 mr-2" />
                            Ver detalles
                        </Button>
                    )}
                </div>
            </div>

            {/* Professional Lightbox */}
            <Lightbox
                open={isLightboxOpen}
                close={closeLightbox}
                slides={[
                    {
                        src: imageSrc,
                        alt: name,
                    }
                ]}
                carousel={{
                    finite: true,
                    preload: 1,
                }}
                controller={{
                    closeOnBackdropClick: true,
                    closeOnPullDown: true,
                }}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null,
                }}
                styles={{
                    container: {
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                    },
                }}
            />
        </>
    );
};

export default PreTallerImageCard;
