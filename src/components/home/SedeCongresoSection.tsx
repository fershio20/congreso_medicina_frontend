'use client'

import React, { useMemo } from "react";
import {URL_DOMAIN, URL_DOMAIN_IMG} from "@/lib/globalConstants";
import CustomSection from "./CustomSection";
import { ArrowRight } from "lucide-react";
import { CustomSectionData } from "@/types/blocks";
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { HomePageData } from '@/types/sections';

const SedeCongresoSection: React.FC = () => {
    // Fetch sede congreso section data using SWR
    const { data: homePageData } = useSWR<{ data: HomePageData }>(
        `${URL_DOMAIN}/api/home-page?populate[sede_congreso_section][populate]=*`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000,
            errorRetryCount: 0, // Don't retry - if it fails, show fallback
            shouldRetryOnError: false, // Don't retry on any error
        }
    );

    // Extract sede congreso section data
    const data: CustomSectionData | null = useMemo(() => {
        const sedeCongresoData = homePageData?.data?.sede_congreso_section;
        if (sedeCongresoData && sedeCongresoData.isAvailable) {
            return sedeCongresoData;
        }
        return null;
    }, [homePageData]);

    const loading = !homePageData;

    if (loading) {
        return (
            <section id="sede" className="py-20 bg-gray-50">
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

    if (!data) {
        return null; // Don't show anything if there's no data
    }

    // Determine image source - use large format if available, fallback to original
    const imageSrc = data.featured_image?.formats?.large?.url 
        ? `${URL_DOMAIN_IMG}${data.featured_image.formats.large.url}`
        : data.featured_image?.url 
        ? `${URL_DOMAIN_IMG}${data.featured_image.url}`
        : "/congreso/bourbone-hotel.jpg";

    // Determine alignment - default to 'left' if null
    const alignment = data.image_alignment || 'left';

    return (
        <CustomSection
            id="sede"
            Title={data.title}
            description={data.description || []}
            featuredImage={imageSrc}
            targetUrl={data.primary_button?.target ? data.primary_button?.target : ''}
            alignment={alignment}
            primaryButton={{
                type: 'trail',
                label: data.primary_button?.label,
                icon: <ArrowRight className="h-4 w-4" />,
                href: data.primary_button?.target
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

export default SedeCongresoSection;

