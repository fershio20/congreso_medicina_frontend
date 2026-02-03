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
    videoUrl?: string
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
                ImagenDestacada?: { url?: string; mime?: string; mimeType?: string };
                VideoDestacado?: { url?: string };
    } } })?.data?.IntroSectionHome;

    if (!section) return null;

    const baseUrl = URL_DOMAIN_IMG || URL_DOMAIN;
    const media = section.ImagenDestacada;
    const videoField = section.VideoDestacado;

    const isVideo = (m: { mime?: string; mimeType?: string } | undefined) =>
        Boolean(m?.mime?.startsWith?.('video/') || m?.mimeType?.startsWith?.('video/'));

    let logoCongreso: string | undefined;
    let videoUrl: string | undefined;

    if (videoField?.url) {
        videoUrl = baseUrl + videoField.url;
    } else if (media?.url && isVideo(media)) {
        videoUrl = baseUrl + media.url;
    } else if (media?.url) {
        logoCongreso = baseUrl + media.url;
    }

    return {
        titulo: section.Titulo ?? '',
        DescripcionBody: section.DescripcionBody ?? '',
        description: section.description ?? '',
        layout: section.layout ?? '',
        logoCongreso,
        videoUrl
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
            <style jsx global>{`
                .intro-video::-webkit-media-controls-timeline { display: none !important; }
                .intro-video::-webkit-media-controls-current-time-display { display: none !important; }
                .intro-video::-webkit-media-controls-time-remaining-display { display: none !important; }
            `}</style>
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
                            {(HomeGeneral?.videoUrl || HomeGeneral?.logoCongreso) && (
                                <div className="rounded-lg border border-gray-200 overflow-hidden mx-auto w-full max-w-2xl">
                                    {HomeGeneral.videoUrl ? (
                                        <video
                                            src={HomeGeneral.videoUrl}
                                            controls
                                            className="intro-video w-full h-full max-h-[450px] object-cover"
                                            playsInline
                                        />
                                    ) : (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img src={HomeGeneral.logoCongreso} alt="" className="w-full h-full max-h-[450px] object-cover" />
                                    )}
                                </div>
                            )}
                            {HomeGeneral?.description && (
                                <div dangerouslySetInnerHTML={{ __html: HomeGeneral.description }} className="text-center" />
                            )}
                        </div>
                    ) : (
                        <div className={'grid grid-cols-2 gap-10'}>
                            {(HomeGeneral?.videoUrl || HomeGeneral?.logoCongreso) && (
                                <div className={`col-span-1 ${layout}`}>
                                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                                        {HomeGeneral.videoUrl ? (
                                            <video
                                                src={HomeGeneral.videoUrl}
                                                controls
                                                className="intro-video mx-auto rounded-lg w-full h-full max-h-[450px] object-cover"
                                                playsInline
                                            />
                                        ) : (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={HomeGeneral.logoCongreso} alt="" className="mx-auto rounded-lg w-full h-full max-h-[450px] object-cover" />
                                        )}
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
