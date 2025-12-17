'use client'

import React, { useMemo } from "react";
import {URL_DOMAIN} from "@/lib/globalConstants";
import CostosTable from "@/components/elements/CostosTable";
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { CostosDataInterface } from '@/types/sections';

const CostSection: React.FC = () => {
    const URL_FETCH = `${URL_DOMAIN}/api/home-page?populate[CostosSection][populate]=*`

    // Fetch costos section data using SWR
    const { data: homePageData } = useSWR(
        URL_FETCH,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000,
            errorRetryCount: 0, // Don't retry - if it fails, show fallback
            shouldRetryOnError: false, // Don't retry on any error
        }
    );

    // Extract costos section data
    const data: CostosDataInterface | null = useMemo(() => {
        if (!homePageData?.data?.CostosSection) return null;
        return homePageData.data.CostosSection;
    }, [homePageData]);

    if (!data?.CostosSectionHabilitado) return null;

    return (
        <div 
            id="costos"
            className="py-40 mb-0 relative overflow-hidden"
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
            <div className="absolute inset-0 "></div>
            
            <div className="container relative z-30 max-w-[1280px] mx-auto px-4 text-center">
                <h2 className="text-center mb-12 font-heading text-white text-4xl md:text-5xl font-bold">
                    {data.TituloSection || 'Costos'}
                </h2>

                <div className="flex justify-center">
                    <CostosTable />
                </div>
            </div>
        </div>
    );
};

export default CostSection;
