'use client'

import React, { useMemo } from "react";
import { URL_DOMAIN } from "@/lib/globalConstants";
import CustomSection from "./CustomSection";
import { ArrowRight } from "lucide-react";
import { CustomSectionData } from "@/types/blocks";
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { HomePageData } from '@/types/sections';

const ProgramaSection: React.FC = () => {
    // Fetch programa section data using SWR
    const { data: homePageData, error: homePageError } = useSWR<{ data: HomePageData }>(
        `${URL_DOMAIN}/api/home-page?populate[programa_section][populate]=*`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000,
            errorRetryCount: 0, // Don't retry - if it fails, show fallback
            shouldRetryOnError: false, // Don't retry on any error
        }
    );

    // Extract programa section data
    const data: CustomSectionData | null = useMemo(() => {
        const programaData = homePageData?.data?.programa_section;
        if (programaData && programaData.isAvailable) {
            return programaData;
        }
        return null;
    }, [homePageData]);

    const loading = !homePageData;
    const error = !data ? 'Programa section not available' : null;

    if (loading) {
        return (
            <section id="programa" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        console.log(error);
        return null;
    }

    // Early return if data is null
    if (!data) {
        return null;
    }

    // Early return if data is not available
    if (!data.isAvailable) {
        return null;
    }

    // Determine image source - use large format if available, fallback to original
    const imageSrc = data.featured_image?.formats?.large?.url
        ? `${URL_DOMAIN}${data.featured_image.formats.large.url}`
        : data.featured_image?.url
            ? `${URL_DOMAIN}${data.featured_image.url}`
            : "/congreso/medico-dando-una-presentacion-una-gran-audiencia.jpg";

    // Determine alignment - default to 'right' if null
    const alignment = data.image_alignment || 'right';
    
    // Check if primary_button exists before accessing its properties
    if (!data.primary_button) {
        return (
            <section id="programa" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Programa no disponible
                    </h3>
                    <p className="text-gray-500">
                        La configuración del botón principal no está disponible.
                    </p>
                </div>
            </section>
        );
    }
    
    return (
        <CustomSection
            id="programa"
            Title={data.title}
            description={data.description || []}
            featuredImage={imageSrc}
            targetUrl={data.primary_button.target}
            alignment={alignment}
            primaryButton={{
                type: 'trail',
                label: data.primary_button.label,
                icon: <ArrowRight className="h-4 w-4" />,
                href: data.primary_button.target
            }}
            secondaryButton={data.secondary_button ? {
                type: 'trail',
                label: data.secondary_button.label,
                icon: <ArrowRight className="h-4 w-4" />,
                href: data.secondary_button.target,
                position: 'right'
            } : undefined}
        />
    );
};

export default ProgramaSection;

