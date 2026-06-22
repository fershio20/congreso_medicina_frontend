import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import React from "react";
import DynamicHotelesSection from "@/components/hoteleria/DynamicHotelesSection";
import Head from "next/head";
import PageHeader from "@/components/global/PageHeader";
import { fetchConfiguracion, fetchTurismoPage, fetchTurismos } from "@/lib/api";
import type { ConfiguracionData } from "@/types/home";
import type { TurismoPageResponse, TurismosResponse } from "@/types/sections";
import { GetStaticProps } from "next";

interface Props {
    configuracion: ConfiguracionData | null;
    turismoPage: TurismoPageResponse | null;
    turismos: TurismosResponse | null;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const [configuracion, turismoPage, turismos] = await Promise.all([
        fetchConfiguracion(),
        fetchTurismoPage(),
        fetchTurismos(),
    ]);
    return {
        props: {
            configuracion: configuracion ?? null,
            turismoPage: turismoPage ?? null,
            turismos: turismos ?? null,
        },
        revalidate: 86400, // 24h - on-demand revalidation via Strapi webhook handles updates
    };
};

export default function SedePage({ configuracion, turismoPage, turismos }: Props) {
    const turismoPageData = turismoPage?.data;

    // Default values for when data is not available
    const defaultTitle = "Sede del Congreso";
    const defaultDescription = "Información sobre la sede del congreso, hoteles y alojamiento para el Congreso de Pediatría.";

    return (
        <>
            <Head>
                <title>Sede del Congreso - Congreso Médico</title>
                <meta name="description" content="Información sobre la sede del congreso, hoteles y alojamiento para el Congreso de Pediatría." />
            </Head>
            <div className="bg-white text-gray-800 space-y-12">
                <MainNav configuracion={configuracion} />

                <PageHeader
                    title={turismoPageData?.header?.title || defaultTitle}
                    description={turismoPageData?.header?.description || defaultDescription}
                />

                {/* Main Content */}
                <section className="py-16 bg-white">
                    <div className="container max-w-[1280px] mx-auto px-4">
                        <DynamicHotelesSection turismoPage={turismoPage} turismos={turismos} />
                    </div>
                </section>

                <Footer configuracion={configuracion} />
            </div>
        </>
    );
}
