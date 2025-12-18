'use client'

import React, { useMemo } from "react";
import PreTallerImageCard from "@/components/PreTallerImageCard";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import { URL_DOMAIN } from "@/lib/globalConstants";
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { Taller, RawTallerData } from '@/types/sections';

const PreTalleresSection: React.FC = () => {
    // Helper function to get the full image URL
    const getFullImageUrl = (imagePath: string): string => {
        if (!imagePath) return '/expert-img-default.png';
        
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        // If it's a relative path, prepend the backend domain
        return `${URL_DOMAIN}${imagePath}`;
    };

    // Helper function to get the full documento URL
    const getFullDocumentoUrl = (documentoPath: string): string => {
        if (!documentoPath) return '';
        
        // If it's already a full URL, return as is
        if (documentoPath.startsWith('http://') || documentoPath.startsWith('https://')) {
            return documentoPath;
        }
        
        // If it's a relative path, prepend the backend domain
        return `${URL_DOMAIN}${documentoPath}`;
    };

    // Fetch talleres using SWR
    const { data: talleresData, error: talleresError } = useSWR(
        `${URL_DOMAIN}/api/talleres?populate=*`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000,
            errorRetryCount: 0, // Don't retry - if it fails, show fallback
            shouldRetryOnError: false, // Don't retry on any error
        }
    );

    // Transform data
    const talleres: Taller[] = useMemo(() => {
        if (!talleresData?.data) return [];
        
        return talleresData.data.map((taller: RawTallerData) => {
            // Check if it has the nested attributes structure
            if (taller.attributes) {
                return {
                    id: taller.id,
                    attributes: {
                        title: taller.attributes.title,
                        featured_image: taller.attributes.featured_image,
                        documento: taller.attributes.documento
                    }
                };
            }
            // If no attributes, use the direct structure
            return {
                id: taller.id,
                attributes: {
                    title: taller.title || '',
                    featured_image: taller.featured_image,
                    documento: taller.documento
                }
            };
        });
    }, [talleresData]);

    const loading = !talleresData && !talleresError;
    const error = talleresError;

    // Loading state
    if (loading) {
        return null
        /*return (
            <div 
                id="pre-congreso"
                className="py-40 mb-0 relative overflow-hidden" style={{
                backgroundImage: 'url("/congreso-inscripcion.jpg")',
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="container relative z-30 max-w-[1280px] mx-auto px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-12 w-12 text-white animate-spin" />
                        <p className="text-white text-lg">Cargando talleres...</p>
                    </div>
                </div>
            </div>
        );*/
    }

    // Error state
    if (error) {
        return (
            <div 
                id="pre-congreso"
                className="py-40 mb-0 relative overflow-hidden" style={{
                backgroundImage: 'url("/congreso-inscripcion.jpg")',
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="container relative z-30 max-w-[1280px] mx-auto px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <AlertCircle className="h-12 w-12 text-white" />
                        <h2 className="text-white text-2xl font-bold">Error al cargar</h2>
                        <p className="text-white text-lg">{error instanceof Error ? error.message : 'An error occurred'}</p>
                        <Button 
                            onClick={() => window.location.reload()} 
                            className="bg-white text-black hover:bg-gray-100"
                        >
                            Reintentar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // console.log('Talleres data:', talleres);
    if (talleres.length === 0) return null
    return (
        <div 
            id="pre-congreso"
            className="py-40 mb-0 relative overflow-hidden" style={{
            backgroundImage: 'url("/congreso/kids-having-fun.png")',
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
        }}>
            {/* Background overlay with dark opacity - using correct Tailwind syntax */}
            <div className="absolute inset-0 bg-gray/85"></div>
            
            <div className="container relative z-30 max-w-[1280px] mx-auto px-4 text-center">
                <h2 className="mb-10 text-[var(--secondary-color)] text-4xl md:text-5xl font-heading font-bold">
                    Pre Talleres
                </h2>
                
                {/* Carousel layout for pre-talleres */}
                {talleres.length > 0 ? (
                    <>
                        <div className="relative mb-6 px-8 md:px-16 lg:px-20">
                            <Carousel 
                                className="w-full"
                                showArrows={talleres.length > 1}
                                showDots={true}
                                autoPlay={false}
                                itemsPerView={{
                                    mobile: 1,
                                    tablet: 2,
                                    desktop: 3
                                }}
                                infiniteLoop={true}
                            >
                                {talleres.map((taller) => {
                                    // Get the best available image format, fallback to original URL
                                    const imageUrl = taller.attributes.featured_image?.formats?.medium?.url || 
                                                   taller.attributes.featured_image?.formats?.large?.url ||
                                                   taller.attributes.featured_image?.formats?.small?.url ||
                                                   taller.attributes.featured_image?.url ||
                                                   '/expert-img-default.png';
                                    
                                    const fullImageUrl = getFullImageUrl(imageUrl);
                                    
                                    // Get the documento URL if available
                                    const documento = taller.attributes.documento ? {
                                        url: getFullDocumentoUrl(taller.attributes.documento.url),
                                        name: taller.attributes.documento.name
                                    } : undefined;
                                    
                                    return (
                                        <div key={taller.id} className="w-full px-3">
                                            <PreTallerImageCard
                                                imageSrc={fullImageUrl}
                                                name={taller.attributes.title}
                                                documento={documento}
                                            />
                                        </div>
                                    );
                                })}
                            </Carousel>
                        </div>
                    </>
                ) : (
                    <div className="mb-12">
                        <p className="text-white text-lg">No hay talleres disponibles en este momento.</p>
                    </div>
                )}

                {/* View All Talleres Button with blue background and white text */}
                <div className="text-center mt-6">
                    <Link href="/talleres">
                        <Button 
                            size="lg" 
                            variant="principal"
                            className="mx-auto"
                        >
                            Ver Todos los Talleres
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PreTalleresSection;
