'use client'

import React, { useMemo } from "react";
import {URL_DOMAIN} from "@/lib/globalConstants";
import CostosTable from "@/components/elements/CostosTable";
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { CostosDataInterface } from '@/types/sections';
import type { ConfiguracionData } from "@/types/home";

interface CostSectionProps {
    configuracion?: ConfiguracionData | null;
}

const CostSection: React.FC<CostSectionProps> = ({ configuracion }) => {
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

    // Generate dynamic styles for tableCost table based on configuracion
    // This must be before any early returns to follow Rules of Hooks
    const tableStyles = useMemo(() => {
        if (!configuracion) return '';
        
        const mainColor = configuracion.color_main || '#045084';
        const secondaryColor = configuracion.color_secondary || '#0573ca';
        const textColor = configuracion.color_text || '#ffffff';
        const accentColor = configuracion.color_accent || '#0573ca';

        return `
            .tableCost .table {
                width: 100%;
                text-align: left;
            }
            .tableCost table {
                width: 100%;
                text-align: left;
                border-collapse: collapse;
                margin: 1.5rem auto;
                background-color: rgba(255, 255, 255, 0.95);
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .tableCost table thead {
                background-color: ${mainColor};
                color: ${textColor};
            }
            .tableCost table thead th {
                padding: 1rem;
                text-align: center;
                font-weight: bold;
                border: 1px solid ${secondaryColor};
                color: ${textColor};
                background-color: ${mainColor};
            }
            .tableCost table tbody tr {
                transition: background-color 0.2s ease;
            }
            .tableCost table tbody tr:nth-child(even) {
                background-color: rgba(255, 255, 255, 0.8);
            }
            .tableCost table tbody tr:nth-child(odd) {
                background-color: rgba(255, 255, 255, 0.95);
            }
            .tableCost table tbody tr:hover {
                background-color: ${accentColor}15;
            }
            .tableCost table tbody td {
                padding: 0.875rem 1rem;
               
                border: 1px solid ${secondaryColor}40;
                color: #333;
            }
            .tableCost table tbody td:first-child {
                font-weight: 600;
                color: ${mainColor};
            }
            .tableCost table tfoot {
                background-color: ${secondaryColor}20;
            }
            .tableCost table tfoot td {
                padding: 1rem;
                text-align: center;
                font-weight: bold;
                border: 1px solid ${secondaryColor}40;
                color: ${mainColor};
            }
        `;
    }, [configuracion]);

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
            
            {/* Dynamic styles for tableCost table */}
            {tableStyles && <style dangerouslySetInnerHTML={{ __html: tableStyles }} />}
            
            <div className="container relative z-30 max-w-[1280px] mx-auto px-4 ">
                <h2 className="text-center mb-12 text-center font-heading text-white text-4xl md:text-5xl font-bold">
                    {data.TituloSection || 'Costos'}
                </h2>

                <div className="flex justify-center">
                    <CostosTable />
                </div>
                <div className={'tableCost'} dangerouslySetInnerHTML={{__html: data.costos }}>
                 
                </div>
            </div>
        </div>
    );
};

export default CostSection;
