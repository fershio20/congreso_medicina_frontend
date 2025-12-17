'use client';

import React, { useMemo } from "react";
import PartnerCard from "@/components/PartnerCard";
import { URL_DOMAIN } from "@/lib/globalConstants";
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { APIResponse, Sections, Sponsor } from '@/types/sections';

const PartnersSection: React.FC = () => {
    // Fetch partners data using SWR
    const { data: apiData } = useSWR<APIResponse>(
        `${URL_DOMAIN}/api/home-page?populate[Auspiciantes][populate][AuspiciantesSection][populate][Auspiciante][populate][auspiciante][populate]=*`,
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
    const { partners, habilitado } = useMemo(() => {
        const result: Sections = {};
        let enabled = false;

        if (apiData?.data?.Auspiciantes) {
            const auspList = apiData.data.Auspiciantes;

            if (auspList.length > 0) {
                enabled = auspList[0].habilitado;

                auspList.forEach((ausp) => {
                    ausp.AuspiciantesSection.forEach((section) => {
                        const key = section.Subtitulo.toLowerCase().replace(/ /g, "_");
                        result[key] = section.Auspiciante.map((item) => {
                            const sponsor = item.auspiciante;
                            return {
                                logo: sponsor.logo?.url
                                    ? `${URL_DOMAIN}${sponsor.logo.url}`
                                    : `patrocinadores/${key}/${sponsor.slug}.webp`,
                                alt: sponsor.Nombre,
                            };
                        });
                    });
                });
            }
        }

        return { partners: result, habilitado: enabled };
    }, [apiData]);

    if (!habilitado) return null;

    return (
        <section id="patrocinadores" className="py-[100px] bg-white">
            <div className="container max-w-[1280px] mx-auto px-4 text-center">
                <h2 className="mb-2 font-heading text-[var(--secondary-color)] text-4xl md:text-5xl font-bold">
                    Nuestros patrocinadores
                </h2>
                <p className="p-large text-gray-800 mb-10 font-body">Ellos hicieron esto posible</p>

                {Object.entries(partners).map(([key, items]) => (
                    <div key={key}>
                        <h3 className="text-xl font-bold mb-6 capitalize">{key.replace(/_/g, " ")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                            {items.map((partner, index) => (
                                <div key={index} className="w-full max-w-[350px] flex justify-center">
                                    <PartnerCard 
                                        key={index} 
                                        logoSrc={partner.logo} 
                                        altText={partner.alt} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PartnersSection;
