'use client'

import React, { useEffect, useState } from "react";
import ThematicCard from "@/components/ThematicCard";
import { URL_DOMAIN } from "@/lib/globalConstants";
import { getProxyUrl } from "@/lib/utils";

interface EjeTematico {
    id: number;
    Titulo: string;
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

const ThematicSection: React.FC = () => {
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

    return (
        <section id="ejes" className="bg-white">
            <div className="container max-w-[1280px] mx-auto px-4 text-center pt-10 pb-52">
                <h2 className="text-[var(--secondary-color)] text-4xl md:text-5xl font-heading font-bold mb-12">{data.EjesTematicosTitulo || 'Ejes temáticos'}</h2>

                {data.EjesTematicosSection && data.EjesTematicosSection.map((section, index) => (
                    <div key={index} className="mb-20">
                        <h3 className="text-2xl font-semibold mb-8">{section.SubTitulo}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                            {section.EjesTematicos.map((item) => (
                                <div key={item.id} className="w-full max-w-[350px]">
                                    <ThematicCard
                                        title={item.Titulo}
                                        description={["", "", "", "", "", "",]}
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
