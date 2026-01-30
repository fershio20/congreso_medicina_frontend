'use client'
import useSWR from "swr";
import { URL_DOMAIN, URL_DOMAIN_IMG } from "@/lib/globalConstants";
import { fetcher } from "@/lib/swr";
import type { ConfiguracionData } from "@/types/home";

interface HomeGeneralInterface {
    titulo: string
    DescripcionBody: string
    description: string
    layout: 'centrado' | 'imagen_derecha'  | 'imagen_izquierda'
    logoCongreso?: string
}

interface IntroSectionProps {
    configuracion?: ConfiguracionData | null;
}

const INTRO_KEY = `${URL_DOMAIN}/api/home-page?populate[IntroSectionHome][populate]=*`;

function toHomeGeneral(data: unknown): HomeGeneralInterface | null {
    const section = (data as { data?: { IntroSectionHome?: {
                layout: 'centrado' | 'imagen_derecha'  | 'imagen_izquierda';
                description: string;
                Titulo?: string;
                DescripcionBody?: string;
                ImagenDestacada?: {
                    url?: string
                }
    } } })?.data?.IntroSectionHome;

    if (!section) return null;

    return {
        titulo: section.Titulo ?? '',
        DescripcionBody: section.DescripcionBody ?? '',
        description: section.description ?? '',
        layout: section.layout ?? '',
        logoCongreso: section.ImagenDestacada?.url ? URL_DOMAIN_IMG + section.ImagenDestacada.url : ''
    };
}

export default function IntroSection({ configuracion }: IntroSectionProps) {
    // Solo hacer fetch en cliente para que el fetcher use el proxy (/api/strapi/...)
    const key = typeof window !== 'undefined' ? INTRO_KEY : null;

    const { data } = useSWR(key, fetcher);

    const HomeGeneral = toHomeGeneral(data);

    const isCentrado = HomeGeneral?.layout === 'centrado';
    const layout = HomeGeneral?.layout === 'imagen_izquierda' ? 'order-1' : HomeGeneral?.layout === 'imagen_derecha' ? 'order-2' : '';
    const textOrder = HomeGeneral?.layout === 'imagen_izquierda' ? 'order-2' : HomeGeneral?.layout === 'imagen_derecha' ? 'order-1' : '';

    return (
        <>
            <section id='intro' className="py-[100px] bg-white">
                <div className="container max-w-[1280px] mx-auto px-4">

                    {isCentrado ? (
                        <div className="flex flex-col gap-10">
                            <h2
                                className={'font-title text-4xl md:text-5xl font-heading font-bold text-center'}
                                style={{
                                    color: configuracion?.color_main || 'var(--secondary-color)',
                                }}
                            >
                                {HomeGeneral?.titulo && HomeGeneral?.titulo}
                            </h2>
                            {HomeGeneral?.logoCongreso && (
                                <div className="rounded-lg border border-gray-200 overflow-hidden mx-auto w-full">
                                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                                    <img src={HomeGeneral.logoCongreso} alt="" className="w-full h-full max-h-[450px] object-cover" />
                                </div>
                            )}
                            {HomeGeneral?.description && (
                                <div dangerouslySetInnerHTML={{ __html: HomeGeneral.description }} className="text-center" />
                            )}
                        </div>
                    ) : (
                        <div className={'grid grid-cols-2 gap-10'}>
                            {HomeGeneral?.logoCongreso && (
                                <div className={`col-span-1 ${layout}`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                                    <div className={'rounded-lg border border-gray-200  overflow-hidden '}>
                                        <img src={`${HomeGeneral.logoCongreso}`} alt="" className="mx-auto rounded-lg w-full h-full max-h-[450px] object-cover" />
                                    </div>
                                </div>
                            )}

                            <div className={`col-span-1 ${textOrder}`}>
                                <h2
                                    className={'font-title mb-10 text-4xl md:text-5xl font-heading font-bold'}
                                    style={{
                                        color: configuracion?.color_main || 'var(--secondary-color)',
                                    }}
                                >
                                    {HomeGeneral?.titulo && HomeGeneral?.titulo}
                                </h2>
                                {HomeGeneral?.description && (
                                    <div dangerouslySetInnerHTML={{ __html: HomeGeneral.description }}></div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </>
    )
}
