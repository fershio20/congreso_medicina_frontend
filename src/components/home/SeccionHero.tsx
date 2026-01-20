'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Countdown from '@/components/Countdown'
import {URL_DOMAIN, URL_DOMAIN_IMG} from "@/lib/globalConstants";
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
    subtitulo?: string
}

interface SeccionHeroProps {
    heroData: HomeSectionData | null;
    configuracion?: ConfiguracionData | null;
}

export default function SeccionHero({ heroData, configuracion }: SeccionHeroProps) {
    const carouselRef = useRef<HTMLDivElement>(null)
    const carouselContentRef = useRef<HTMLDivElement>(null)

    // Images for the carousel - using images from paraguay folder
    const carouselImages = [
        '/paraguay/55a834a58c.jpg',
        '/paraguay/70a398f522.jpg',
        '/paraguay/alamy_JT7DD4.jpg',
        '/paraguay/alamy_T3W3J8.jpg',
        '/paraguay/alamy-1764852100.jpg',
        '/paraguay/eef8598a53.jpg',
        '/paraguay/fc8edd98da_1.jpg',
        '/paraguay/fc8edd98da.jpg',
        '/paraguay/nosotros.jpg',
        '/paraguay/shutterstock_2544551389.jpg',
    ]

    useEffect(() => {
        if (!carouselRef.current || !carouselContentRef.current) return

        const carousel = carouselContentRef.current
        const items = carousel.children
        const itemWidth = 350 + 40 // 350px width + 40px gap (gap-10)
        const halfWidth = (items.length / 2) * itemWidth // Width of one set of images

        // Set initial position
        gsap.set(carousel, { x: 0 })

        // Create infinite scroll animation using timeline for seamless loop
        const tl = gsap.timeline({ repeat: -1 })
        
        tl.to(carousel, {
            x: -halfWidth, // Move by one full set width
            duration: 50, // Duration for smooth scrolling (20 seconds per loop)
            ease: 'none',
        })
        .set(carousel, { x: 0 }) // Instantly reset to start position

        // Cleanup function
        return () => {
            tl.kill()
        }
    }, [])

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
                                   className="inline-block bg-secondary text-white px-6 py-3  text-base hover:bg-purple-800">
                                    Conocer más
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        );
    }



    // console.log('HERODATA', heroData);
    return (
        <>
        <section
            id="inicio"
            className={`${heroData.imgBackground ? '' : 'bg-main-familiar'} min-h-dvh flex items-center relative `}
            style={{
                backgroundImage: heroData.imgBackground ? `url(${heroData.imgBackground})` : '',
                backgroundSize: heroData.imgBackground && `cover`,
                backgroundPosition: heroData.imgBackground && `center center`,
                backgroundRepeat: heroData.imgBackground && `no-repeat`,
            }}
        >
            <div
                id='blobBg'
                className="absolute inset-0 w-full h-full z-20"
                style={{
                    background: 'linear-gradient(0deg, #ffffff, transparent)',
            }}>
                <div 
                    className="blur-container"
                    style={{ '--blur': '12vw' } as React.CSSProperties}
                >
                    <div 
                        className="shape" 
                        style={{ 
                            '--path': 'polygon(50.9% 37.2%, 43.5% 34.7%, 33.6% 26.1%, 39.2% 10.8%, 26.2% 0.0%, 4.8% 6.4%, 0.0% 30.4%, 20.7% 37.2%, 33.4% 26.3%, 43.2% 34.9%, 45.0% 35.6%, 43.6% 46.4%, 37.8% 59.5%, 21.8% 63.2%, 11.7% 76.1%, 22.9% 91.3%, 47.4% 91.3%, 54.0% 79.0%, 38.0% 59.6%, 43.9% 46.4%, 45.2% 35.5%, 50.9% 37.6%, 56.1% 36.8%, 59.8% 47.6%, 70.3% 61.9%, 87.7% 56.0%, 96.4% 37.4%, 88.6% 15.1%, 63.7% 16.7%, 55.2% 33.6%, 55.9% 36.6%, 50.9% 37.2%)'
                        } as React.CSSProperties}
                    />
                    <div 
                        className="shape" 
                        style={{ 
                            '--path': 'polygon(50.9% 37.2%, 43.5% 34.7%, 33.6% 26.1%, 39.2% 10.8%, 26.2% 0.0%, 4.8% 6.4%, 0.0% 30.4%, 20.7% 37.2%, 33.4% 26.3%, 43.2% 34.9%, 45.0% 35.6%, 43.6% 46.4%, 37.8% 59.5%, 21.8% 63.2%, 11.7% 76.1%, 22.9% 91.3%, 47.4% 91.3%, 54.0% 79.0%, 38.0% 59.6%, 43.9% 46.4%, 45.2% 35.5%, 50.9% 37.6%, 56.1% 36.8%, 59.8% 47.6%, 70.3% 61.9%, 87.7% 56.0%, 96.4% 37.4%, 88.6% 15.1%, 63.7% 16.7%, 55.2% 33.6%, 55.9% 36.6%, 50.9% 37.2%)',
                            '--offset': '180deg',
                            '--speed': '30000ms',
                            '--background': 'linear-gradient(cyan, blue, green, purple, cyan)'
                        } as React.CSSProperties}
                    />
                </div>
            </div>

            <div className="container max-w-[1280px] mt-10 mx-auto flex flex-col md:flex-row items-center px-4 h-auto relative z-30">
                {/* Left Side */}

                <div className="grid grid-cols-12 w-full gap-4">

                    <div className={' flex flex-col justify-center col-span-8'}>
                        <h2 className={'text-left text-5xl uppercase'}>
                            <span
                                    style={{
                                        color:configuracion?.color_main || 'inherit',
                                    }}
                                className={`text-4xl sm:text-3xl md:text-3xl font-bold`}>
                                {heroData.titulo}
                            </span>
                        </h2>
                        {heroData.subtitulo && (
                        <div dangerouslySetInnerHTML={{ __html: heroData.subtitulo }}></div>
                        )}
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
                               className="inline-block bg-secondary text-white px-6 py-3  text-base hover:bg-purple-800">
                                Conocer más
                            </a>
                        </div>
                    </div>
                    <div className={'col-span-4'}>

                        {heroData.destacado.url && (
                            <>
                                <img
                                    src={`${URL_DOMAIN_IMG}${heroData.destacado.url}`}
                                    alt="Hero Illustration 1"
                                    className="w-full mx-auto"
                                />
                            </>
                        )}
                    </div>


                </div>
            </div>
            <div 
                id='featuredCarrusel' 
                ref={carouselRef}
                className={'w-full absolute bottom-[-100px] h-[250px] z-20 overflow-hidden'}
            >
                <div 
                    ref={carouselContentRef}
                    className={'flex gap-10 h-full'}
                    style={{ willChange: 'transform' }}
                >
                    {/* First set of images */}
                    {carouselImages.map((img, index) => (
                        <div 
                            key={`first-${index}`}
                            className="h-[250px] w-[350px] flex-shrink-0 overflow-hidden rounded-sm"
                        >
                            <img 
                                src={img} 
                                alt={`Featured ${index + 1}`} 
                                className={'w-full h-full object-cover'}
                            />
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {carouselImages.map((img, index) => (
                        <div 
                            key={`second-${index}`}
                            className="h-[250px] w-[350px] flex-shrink-0 overflow-hidden rounded-sm"
                        >
                            <img 
                                src={img} 
                                alt={`Featured ${index + 1}`} 
                                className={'w-full h-full object-cover'}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
        <section>
            {/* Bottom Text */}
            <div className='bg-linear-to-white py-10 mt-50  sm:py-24 md:py-0 md:pb-12 px-6 md:px-8'>
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
