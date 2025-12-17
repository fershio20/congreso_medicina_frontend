'use client'

import classNames from "classnames"
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface FeaturedParam {
    imgBg?: string
    mode?: 'light' | 'dark'
    bgColor?: 'white' | 'dark-green' | 'teal'| null
    title?: string
    description?: string
    featuredImg?: string
    alignImg?: 'left' | 'right'

}

export function FeaturedSection({ imgBg = '', featuredImg, mode = 'light', bgColor, alignImg='left',title }: FeaturedParam) {

    const customBgIm = classNames({
        backgroundPosition: "center center",
        'bg-cover': true,
        'bg-no-repeat': true,

    })

    const bgColorParam = classNames({
        'bg-teal-800': bgColor === 'teal',
        'bg-[#589ed5]': bgColor === 'dark-green',

    })

    const hasBg = Boolean(imgBg)

    return (
        <div className={`py-40  mb-0  ${hasBg  && customBgIm } ${bgColorParam}`}
             style={hasBg ? { backgroundImage: `url(${imgBg})`,} : {}}
        >

            <div className="container relative z-10 w-full mx-auto">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Right Grid */}
                    <div className={`order-${alignImg == 'left' ? '1' : '2'} `}>
                        {featuredImg && (
                            <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    /*src={`${featuredImg}`}*/
                                    src={`/congreso/CPP25-Fecha-presentacion-trabajos.png`}
                                    alt="Location Site"
                                    className="object-cover rounded-xl"
                                    sizes="w-full"
                                />
                            </>


                        )}

                    </div>
                    {/* Left grid */}
                    <div className={`order-${alignImg == 'left' ? '2' : '1'} flex flex-col justify-center`}>
                        <h2 className={`font-title font-bold mb-10 ${mode === 'dark' ? 'text-white' : 'text-[var(--color-dark-green)]'}`}>
                            {title && title}
                        </h2>
                        <p className={classNames('mb-8', 'text-xl', 'font-medium', mode === 'dark' && 'text-white/75')}>
                            Los trabajos científicos podrán presentarse en dos modalidades:
                        </p>
                            <br/>
                            <br/>
                            <ul className={ classNames('list-disc','mb-8', 'text-xl', 'font-medium', mode === 'dark' && 'text-white/75')}>
                                <li className={'ml-5 list-item'}><b>Poster Digital:</b> incluye únicamente el resumen del trabajo.</li>
                                <li className={'ml-5'}><b>In Extenso:</b> incluye el resumen más el trabajo completo (versión
                                    extendida).</li>
                            </ul>
                            <br/>
                        <p className={classNames('mb-8', 'text-xl', 'font-medium', mode === 'dark' && 'text-white/75')}>
                            Los trabajos deberán enviarse exclusivamente a través de la plataforma online del
                            congreso.
                        </p>

                        <p className={classNames('mb-8', 'text-xl', 'font-medium', mode === 'dark' && 'text-white/75')}>
                            <span className={'font-bold'}>Fecha límite de envío:</span> 20 de agosto de 2025
                        </p>
                        <div className={'flex justify-center gap-4'}>

                            <Link href="https://app.sppcongresos.com/auth/login">

                                <Button size={'lg'} variant="principal">
                                    Envío de Trabajos
                                </Button>
                            </Link>
                            <Link target={'_blank'} href='/concursos/Reglamento-de-Temas-libres-2025-07-02.pdf'>
                                <Button size={'lg'} variant="light">
                                    Descargar reglamento
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

