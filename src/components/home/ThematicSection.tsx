'use client'

import React, { useEffect, useState } from "react";
import ThematicCard from "@/components/ThematicCard";
import { URL_DOMAIN } from "@/lib/globalConstants";
import { getProxyUrl } from "@/lib/utils";
import type { ConfiguracionData } from "@/types/home";

interface EjeTematico {
    id: number;
    Titulo: string;
    descripcion: string;
    Descripcion?: string | null;
    ImagenDestacada?: {
        url: string;
    };
}

interface EjesSection {
    id: number;
    SubTitulo: string;
    EjesTematicos: EjeTematico[];
}

interface ThematicData {
    EjesTematicosTitulo?: string;
    EjesTematicosHabilitados?: boolean;
    EjesTematicosSection?: EjesSection[];
}

interface ThematicSectionProps {
    configuracion?: ConfiguracionData | null;
}

const ThematicSection: React.FC<ThematicSectionProps> = ({ configuracion }) => {
    const [data, setData] = useState<ThematicData | null>(null);

    useEffect(() => {
        const url = `${URL_DOMAIN}/api/home-page?populate[EjesTematicosSection][populate][EjesTematicos][populate]=*`;
        const proxyUrl = getProxyUrl(url);
        
        fetch(proxyUrl)
            .then(res => res.json())
            .then(json => {
                const result = json.data;
                if (result?.EjesTematicosHabilitados) {
                    setData(result);
                }
            })
            .catch(err => console.error('Error loading thematic section:', err));
    }, []);

    if (!data?.EjesTematicosHabilitados) return null;
    console.log('EJES',data)
    return (
        <section id="ejes" className="bg-white">
            <div className="container max-w-[1280px] mx-auto px-4  pt-50 pb-52">
                <h2 
                    className="text-4xl text-center md:text-5xl font-heading font-bold mb-12"
                    style={{
                        color: configuracion?.color_main || configuracion?.color_main || '#333'
                    }}
                >
                    {data.EjesTematicosTitulo || 'Ejes temáticos'}
                </h2>

                {data.EjesTematicosSection && data.EjesTematicosSection.map((section, index) => (
                    <div key={index} className="mb-20">
                        <h3 
                            className="text-2xl font-semibold mb-8"
                            style={{
                                color: configuracion?.color_main || 'inherit'
                            }}
                        >
                            {section.SubTitulo}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                            {section.EjesTematicos.map((item) => (
                                <div key={item.id} className="w-full">

                                    <ThematicCard
                                        title={item.Titulo}
                                        description={item.descripcion ? item.descripcion : ''}
                                        main_color={configuracion?.color_main || ''}
                                        iconImg={item.ImagenDestacada?.url ? URL_DOMAIN + item.ImagenDestacada.url : ""}
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

export default ThematicSection;
