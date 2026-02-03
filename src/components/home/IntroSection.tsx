'use client'
import { useRef, useState } from "react";
import useSWR from "swr";
import { URL_DOMAIN, URL_DOMAIN_IMG } from "@/lib/globalConstants";
import { fetcher } from "@/lib/swr";
import type { ConfiguracionData } from "@/types/home";

function VideoWithPlayButton({
    src,
    poster,
    className,
}: {
    src: string;
    poster: string;
    className?: string;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayClick = () => {
        videoRef.current?.play();
        setIsPlaying(true);
    };

    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    return (
        <div className={`relative group cursor-pointer ${className}`} onClick={!isPlaying ? handlePlayClick : undefined}>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                controls={isPlaying}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                className="intro-video w-full h-full max-h-[450px] object-cover block"
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={handlePause}
                onEnded={handleEnded}
                onClick={(e) => isPlaying && e.stopPropagation()}
            />
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity hover:bg-black/30"
                    aria-hidden
                >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/60 flex items-center justify-center shadow-lg hover:bg-black/70 hover:scale-110 transition-transform">
                        <svg
                            className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}

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

const VIDEO_POSTER = "https://congreso-backend-sbecd.ondigitalocean.app/uploads/bannerconbreso2026_452a24031c.png";

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
                .intro-video::-webkit-media-controls-overflow-button { display: none !important; }
                .intro-video::-webkit-media-controls-enclosure { overflow: hidden !important; }
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
                                        <VideoWithPlayButton
                                            src={HomeGeneral.videoUrl}
                                            poster={VIDEO_POSTER}
                                            className="w-full"
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
                                            <VideoWithPlayButton
                                                src={HomeGeneral.videoUrl}
                                                poster={VIDEO_POSTER}
                                                className="mx-auto rounded-lg w-full"
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
