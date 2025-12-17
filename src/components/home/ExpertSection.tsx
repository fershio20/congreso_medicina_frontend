'use client'

import React, { useMemo } from "react";
import ExpertCard from "@/components/ExpertCard";
import {URL_DOMAIN} from "@/lib/globalConstants";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel";
import { Loader2, Users, AlertCircle } from "lucide-react";
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { RawExpertData, ExpertData, ExpertosSectionInterface } from '@/types/sections';

const ExpertSection: React.FC = () => {
    const URL_DISERTANTES_SECTION = `${URL_DOMAIN}/api/home-page?populate[DisertantesSection][populate]=*`
    const URL_DISERTANTES_LIST = `${URL_DOMAIN}/api/Disertantes?populate[avatar][populate]=*&populate[pai][populate]=*`

    // Fetch section data using SWR
    const { data: sectionData, error: sectionError } = useSWR(URL_DISERTANTES_SECTION, fetcher);

    // Fetch experts list using SWR
    const { data: expertsData, error: expertsError } = useSWR(URL_DISERTANTES_LIST, fetcher);

    // Combine data from both SWR calls
    const data: ExpertosSectionInterface = useMemo(() => {
        const section = sectionData?.data?.DisertantesSection || {};
        let members: ExpertData[] = [];

        if (expertsData?.data) {
            // Handle both possible Strapi data structures
            members = expertsData.data.map((expert: RawExpertData) => {
                // Check if data is wrapped in attributes
                if (expert.attributes) {
                    return {
                        avatar: expert.attributes.avatar?.data?.attributes,
                        nombre: expert.attributes.nombre,
                        subtitulo: expert.attributes.subtitulo,
                        descripcion: expert.attributes.descripcion,
                        pai: expert.attributes.pai?.data?.attributes
                    };
                }
                return expert;
            });
        }

        return {
            ...section,
            Miembros: members,
        };
    }, [sectionData, expertsData]);

    const loading = !sectionData && !sectionError && !expertsData && !expertsError;
    const error = sectionError || expertsError;

    console.log('ExpertSection data:', data);


    // Loading state
    if (loading) {
        return (
            <div className="py-40 mb-0 relative overflow-hidden">
                <div className="container relative z-10 max-w-[1280px] mx-auto px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-12 w-12 text-white animate-spin" />
                        <p className="text-white text-lg">Cargando expertos...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="py-40 mb-0 relative overflow-hidden bg-gradient-to-br from-red-500 to-red-700">
                <div className="container relative z-10 max-w-[1280px] mx-auto px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <AlertCircle className="h-12 w-12 text-white" />
                        <h2 className="text-white text-2xl font-bold">Error al cargar</h2>
                        <p className="text-white text-lg">{error instanceof Error ? error.message : 'An error occurred'}</p>
                        <Button 
                            onClick={() => window.location.reload()} 
                            className="bg-white text-red-600 hover:bg-gray-100"
                        >
                            Reintentar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Si la seccion expertos esta deshabilitada en el backoffice no se muestra nada
    if(!data.DisertantesHabilitados) return null

    // No experts available
    if (!data.Miembros || data.Miembros.length === 0) {
        return (
            <section id={'expertSection'} className="py-40 mb-0 relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700">
                <div className="container relative z-10 max-w-[1280px] mx-auto px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Users className="h-12 w-12 text-white" />
                        <h2 className="text-white text-2xl font-bold">
                            {data.Seccion ? data.Seccion : 'Expertos'}
                        </h2>
                        <p className="text-white text-lg">No hay expertos disponibles en este momento.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="expertos"
            className={`${data.imageBackground?.url ? '' : 'bg-main-familiar'} py-20 relative overflow-hidden`}
            style={{
                backgroundImage: data.imageBackground?.url 
                    ? `url("${URL_DOMAIN}${data.imageBackground.url}")`
                    : `url("/bg-default-blue.png")`,
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Background overlay with improved opacity */}
            <div className="absolute inset-0"></div>
            
            <div className="container relative z-30 max-w-[1280px] mx-auto px-4 text-center">
                <h2 className="mb-10 text-white text-4xl md:text-5xl font-heading font-bold">
                    {data.Seccion ? data.Seccion : 'Expertos'}
                </h2>
                {data.Subtitulo && (
                    <h5 className="font-body mb-6 text-white text-lg md:text-xl">
                        {data.Subtitulo}
                    </h5>
                )}

                {data.Descripcion &&(
                    <p className="p-large text-white mb-12 max-w-3xl mx-auto">
                        {data.Descripcion}
                    </p>
                )}
                
                {data.Miembros && data.Miembros.length > 0 && (
                    <>
                        {/* Custom Carousel with improved responsive design and external navigation */}
                        <div className="relative mb-6 px-8 md:px-16 lg:px-20">
                            <Carousel
                            showArrows={data.Miembros.length > 1}
                            showDots
                            autoPlay={false}
                            itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
                            infiniteLoop={true} // puedes dejarlo true; dots seguirán siendo por página
                            >
                                {data.Miembros.map((expert, index) => (
                                    <div key={index} className="w-full px-3">
                                        <ExpertCard
                                            name={expert.nombre}
                                            specialty={expert.subtitulo}
                                            description={expert.descripcion}
                                            imageSrc={expert.avatar?.url ? `${URL_DOMAIN}${expert.avatar.url}` : undefined}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>

                        {/* View All Experts Button with improved styling */}
                        <div className="text-center mt-6">
                            <Link href="/expertos">
                                <Button 
                                    size="lg" 
                                    variant="outline"
                                    className="mx-auto"
                                >
                                    Ver Todos los Expertos
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default ExpertSection;
