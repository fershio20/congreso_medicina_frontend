import Countdown from '@/components/Countdown'
import {URL_DOMAIN} from "@/lib/globalConstants";
import type { ConfiguracionData } from "@/types/home";

interface HomeSectionData {
    titulo: string
    descripcion: string
    destacado: {
        url: string
    },
    imgBackground?: string
    proximaEdicionTitle: string
    fecha: string
}

interface SeccionHeroProps {
    heroData: HomeSectionData | null;
    configuracion?: ConfiguracionData | null;
}

export default function SeccionHero({ heroData, configuracion }: SeccionHeroProps) {
    
    
    // Fallback if no data is provided
    if (!heroData) {
        return (
            <section id="inicio" className="bg-main-familiar pt-10">
                <div className="container max-w-[1280px] mx-auto flex flex-col md:flex-row items-center px-4 h-auto">
                    <div className="flex flex-col text-center w-full space-y-6">
                        <div className="text-center">
                            <div className={'col-span-8 flex flex-col justify-center'}>
                                <img
                                    src={`/congreso/lema-congreso.png`}
                                    alt="Hero Illustration"
                                    className="mx-auto w-4/5 sm:w-3/5"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bg-linear-to-white py-20 sm:py-24 md:py-0 md:pb-12 px-8'>
                    <div className="container max-w-[1280px] mx-auto text-center">
                        <div className={'mx-auto text-center'}>
                            <img
                                src={`/congreso/pediatria-fecha.png`}
                                alt="Hero Illustration"
                                className="mx-auto w-[200px] sm:w-[250px]"
                            />
                            <div className={'mb-50'}>
                                <a href="#conocer-mas"
                                   className="inline-block bg-secondary text-white px-6 py-3 rounded-md text-base hover:bg-purple-800">
                                    Conocer más
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }



    return (
        <>
        <section
            id="inicio"
            className={`${heroData.imgBackground ? '' : 'bg-main-familiar'} h-dvh flex items-center relative`}
            style={{
                backgroundImage: heroData.imgBackground ? `url(${heroData.imgBackground})` : '',
                backgroundSize: heroData.imgBackground && `cover`,
                backgroundPosition: heroData.imgBackground && `center center`,
                backgroundRepeat: heroData.imgBackground && `no-repeat`,
            }}
        >
            <div
                className="absolute inset-0 w-full h-full z-20"
                style={{
                    background: 'linear-gradient(0deg, #ffffff, transparent)',
            }}>

            </div>
            <div
                className="container max-w-[1280px] mx-auto flex flex-col md:flex-row items-center px-4  h-auto relative z-30">
                {/* Left Side */}
                <div className="grid grid-cols-12 w-full gap-4">
                    <div className={'col-span-12'}>
                        {heroData.destacado.url && (
                            <>
                                <img
                                    src={`${URL_DOMAIN}${heroData.destacado.url}`}
                                    alt="Hero Illustration 1"
                                    className="w-full max-w-1/2 mx-auto"
                                />
                            </>
                        )}
                    </div>
                    <div className={'text-center flex flex-col justify-center col-span-12'}>
                        <h2 className={''}>
                            <span
                                    style={{
                                        color:configuracion?.color_main || 'inherit',
                                    }}
                                className={`text-4xl sm:text-3xl md:text-3xl font-bold`}>
                                {heroData.titulo}
                            </span>
                        </h2>

                        <p 
                            className="mb-10 text-2xl font-medium"
                            style={{
                                color: configuracion?.color_text || 'inherit'
                            }}
                        >
                            {heroData.descripcion}
                        </p>
                        <div className={''}>
                            <a href="#conocer-mas"
                               style={{
                                   background: configuracion?.color_main || 'inherit'
                               }}
                               className="inline-block bg-secondary text-white px-6 py-3 rounded-md text-base hover:bg-purple-800">
                                Conocer más
                            </a>
                        </div>
                    </div>



                </div>
            </div>
        </section>
        <section>
            {/* Bottom Text */}
            <div className='bg-linear-to-white py-10  sm:py-24 md:py-0 md:pb-12 px-6 md:px-8'>
                <div className="container max-w-[1280px] mx-auto text-center">
                    {/*<div className={'mx-auto text-center'}>
                        <img
                            src={`/congreso/pediatria-fecha.png`}
                            alt="Hero Illustration"
                            className="mx-auto w-[150px] mb-10 sm:w-[250px]"
                        />
                    </div>*/}
                    <Countdown color_from={configuracion?.color_main} color_to={configuracion?.color_accent} targetDate={`${heroData.fecha}T00:00:00`}/>
                </div>
            </div>
        </section>
    </>

    )
}
