'use client'

import React, { useEffect, useState } from "react";
import EjesCards from "@/components/cards/ejesCards";
import { URL_DOMAIN} from "@/lib/globalConstants";
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

const ejesExample = [
    {
        Titulo: 'Salud Integral y desarrollo infantil',
        Descripcion: 'string | null',
        ImagenDestacada: {
            url: '/congreso/concurso.png',
        }
    },
    {
        Titulo: 'Trabajo en red y enfoque interdisciplinario',
        Descripcion: 'string | null',
        ImagenDestacada: {
            url: '/congreso/concurso.png',
        }
    },
    {
        Titulo: 'Avances y controversias en pediatría clínica',
        Descripcion: 'string | null',
        ImagenDestacada: {
            url: '/congreso/concurso.png',
        }
    },
    {
        Titulo: 'Nutrición y seguridad alimentaria',
        Descripcion: 'string | null',
        ImagenDestacada: {
            url: '/congreso/concurso.png',
        }
    },
    {
        Titulo: 'Protección integral dela infancia y adolescencia',
        Descripcion: 'string | null',
        ImagenDestacada: {
            url: '/congreso/concurso.png',
        }
    },
    {
        Titulo: 'Cambio climático, ambiente y salud infantil',
        Descripcion: 'string | null',
        ImagenDestacada: {
            url: '/congreso/concurso.png',
        }
    },
    {
        Titulo: 'Innovación, tecnología y educación médica',
        Descripcion: 'string | null',
        ImagenDestacada: {
            url: '/congreso/concurso.png',
        }
    },
    {
        Titulo: 'Políticas públicas, respuestas sanitarias y derechos de la niñez',
        Descripcion: 'string | null',
        ImagenDestacada: {
            url: '/congreso/concurso.png',
        }
    },
]


const EjesSection: React.FC = () => {
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
        <section id="ejes2" className="bg-white">
            <div className="container max-w-[1280px] mx-auto px-4 text-center pt-10 pb-52">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-12 text-[var(--secondary-color)]">Ejes </h2>

                <div className="mb-20">
                    <div className="flex flex-wrap justify-center gap-6">
                        {ejesExample.map((item, index) => (
                            <div key={index} className="w-full max-w-[300px] mx-auto">
                                <EjesCards
                                    title={item.Titulo}
                                    description={["", "", "", "", "", "",]}
                                    iconImg={item.ImagenDestacada?.url ? item.ImagenDestacada.url : ""}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EjesSection;
