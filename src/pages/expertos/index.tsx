import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import React from "react";
import Head from "next/head";
import ExpertCard from "@/components/ExpertCard";
import {URL_DOMAIN} from "@/lib/globalConstants";
import PageHeader from "@/components/global/PageHeader";
import {GetStaticProps} from "next";
import {fetchExperts, fetchConfiguracion} from "@/lib/api";
import {ExpertData} from "@/types/sections";
import {ConfiguracionData} from "@/types/home";

interface ExpertosPageProps {
    experts: ExpertData[];
    configuracion: ConfiguracionData | null;
}

export const getStaticProps: GetStaticProps<ExpertosPageProps> = async () => {
    try {
        // Fetch experts and configuration in parallel
        const [experts, configuracion] = await Promise.all([
            fetchExperts(),
            fetchConfiguracion()
        ]);

        return {
            props: {
                experts: experts || [],
                configuracion: configuracion
            },
            revalidate: 60, // Revalidate every 60 seconds
        };
    } catch (err) {
        console.error("Error fetching expertos page data:", err);
        return {
            props: {
                experts: [],
                configuracion: null
            },
            revalidate: 60,
        };
    }
};

export default function ExpertosPage({experts, configuracion}: ExpertosPageProps) {

    return (
        <>
            <Head>
                <title>Expertos - Congreso Médico</title>
                <meta name="description" content="Conoce a todos los expertos y disertantes que participarán en el Congreso Paraguayo de Pediatría." />
            </Head>
            <div className="bg-white text-gray-800 space-y-12">
                <MainNav configuracion={configuracion} />
                
                <PageHeader 
                    title="Expertos y Disertantes"
                    description="Conoce a todos los expertos nacionales e internacionales que participarán en el XIX Congreso Paraguayo de Pediatría."
                />

                {/* Experts Grid Section */}
                <section className="py-[100px] bg-white">
                    <div className="container max-w-[1280px] mx-auto px-4">
                        {experts.length > 0 ? (
                            <>
                                {/* Experts Grid - 4 per row */}
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                    {experts.map((expert, index) => (
                                        <div key={index} className="w-full">
                                            <ExpertCard
                                                name={expert.nombre}
                                                specialty={expert.subtitulo}
                                                description={expert.descripcion}
                                                imageSrc={(expert.avatar?.url) ? (URL_DOMAIN + expert.avatar?.url) : '/bg-default.png'}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="text-center mt-16">
                                    <p className="text-lg text-gray-600">
                                        Total de expertos: <span className="font-bold ">{experts.length}</span>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <div className="text-gray-500 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay expertos disponibles</h3>
                                <p className="text-gray-500">Por favor, inténtalo más tarde.</p>
                            </div>
                        )}
                    </div>
                </section>

                <Footer configuracion={configuracion} />
            </div>
        </>
    );
}
