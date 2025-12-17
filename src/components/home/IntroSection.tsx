'use client'
import { useEffect, useState } from "react";
import { URL_DOMAIN } from "@/lib/globalConstants";

interface HomeGeneralInterface {
    titulo: string
    DescripcionBody: string
    logoCongreso?: string
}


export default function IntroSection() {
    const [HomeGeneral, setHomeGeneral] = useState<HomeGeneralInterface | null>(null)

    useEffect(() => {
        fetch(`${URL_DOMAIN}/api/home-page?populate[IntroSectionHome][populate]=*`)
            .then(res => res.json())
            .then(data => {
                const section = data.data?.IntroSectionHome

                if (section) {
                    setHomeGeneral({
                        titulo: section.Titulo ? section.Titulo : '',
                        DescripcionBody: section.DescripcionBody ? section.DescripcionBody : '',
                        logoCongreso: section.ImagenDestacada?.url ? URL_DOMAIN + section.ImagenDestacada.url : ''
                    })
                }
            })
            .catch(err => console.error('Error loading home section:', err))
    }, [])

    return (
        <>
            <section id='intro' className="py-[100px] bg-white">
                <div className="container max-w-[1280px] mx-auto px-4">
                    <h2 className={'font-title mb-10 text-[var(--secondary-color)] text-center text-4xl md:text-5xl font-heading font-bold'}>
                        {HomeGeneral?.titulo && HomeGeneral?.titulo}
                    </h2>
                    {HomeGeneral?.logoCongreso && (
                       <div className="overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element*/}
                            <img src={`${HomeGeneral.logoCongreso}`} alt="" className="mx-auto rounded-lg w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover object-[center_-90px]" />
                        </div>
                    )}

                    <div className={'mt-10'}>
                        <p className="text-xl font-semibold">
                            {HomeGeneral?.DescripcionBody}
                        </p>

                    </div>

                    {/*<div className="text-justify grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xl font-semibold">
                                Es para mí una distinción y una inmensa alegría invitarles a participar del XIX Congreso Paraguayo de Pediatría,
                                que se celebrará los días 5, 6, 7 y 8 de noviembre del presente año en el Bourbon Convention Hotel, en la ciudad de Luque,
                                Paraguay.
                            </p>

                        </div>
                        <div>
                            <p className="p-large text-gray-600 mb-5">
                                Este Congreso, uno de los encuentros académicos más trascendentes de la Sociedad Paraguaya de
                                Pediatría —que este año conmemora 87 años de labor incansable en favor de la salud infantil, las
                                familias y la comunidad— reafirma nuestro compromiso de respaldar políticas públicas e
                                iniciativas que garanticen el bienestar integral de niños, niñas y adolescentes, siempre guiados
                                por la ética profesional y humana que nos caracteriza.
                            </p>
                            <p className="p-large text-gray-600 mb-5">
                                Hemos diseñado un programa que contempla una jornada de Precongreso, con talleres prácticos y
                                actividades de alto interés para pediatras y profesionales de disciplinas afines, y tres días de
                                Congreso, con conferencias magistrales, mesas temáticas, espacios de actualización, debates de
                                controversias y la presentación de guías prácticas elaboradas por nuestros Comités de
                                Especialidades Pediátricas. Asimismo, se prevé un encuentro específico con adolescentes para
                                abordar inquietudes propias de esta etapa vital y un conversatorio con padres y educadores,
                                enfocado en los desafíos actuales de la educación dentro del núcleo familiar.
                            </p>
                            <p className="p-large text-gray-600 mb-5">
                                Este año deseamos dar un impulso especial a la difusión de la producción científica nacional.
                                Por ello, alentamos a profesionales y residentes a presentar sus investigaciones en modalidad
                                póster digital e in-extenso, promoviendo la participación activa y premiando la excelencia
                                académica de los trabajos más destacados por su relevancia y rigor científico.
                                Además, este Congreso será una oportunidad inmejorable para descubrir los atractivos turísticos
                                de nuestro querido país y dejarse envolver por la calidez y hospitalidad de nuestra gente.
                                Les invito cordialmente a ser parte de esta experiencia enriquecedora, que nos permitirá
                                compartir saberes, fortalecer nuestra práctica y renovar, juntos, el compromiso de velar por la
                                salud y el bienestar de la niñez y la adolescencia paraguaya. Su participación será, sin duda,
                                el motor y el corazón de este gran encuentro.
                            </p>
                            <p className="p-large text-gray-600 mb-5">
                                ¡Les esperamos con entusiasmo y los brazos abiertos!
                                Con estima y aprecio,
                            </p>

                            <p className=" text-gray-600 mt-10">
                                <strong className={'text-xl'}>Dra. Norma Beatriz Bogado Gómez</strong> <br />
                                <b>Presidenta</b> <br />
                                XIX Congreso Paraguayo de Pediatría
                            </p>
                        </div>

                    </div>*/}
                </div>
            </section>
        </>
    )
}
