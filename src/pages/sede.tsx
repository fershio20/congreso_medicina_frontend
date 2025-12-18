import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import React from "react";
import DynamicHotelesSection from "@/components/hoteleria/DynamicHotelesSection";
import PageHeader from "@/components/global/PageHeader";
import { GetStaticProps } from "next";
import SEO from "@/components/SEO";
import {
    fetchTurismoPage,
    fetchGlobalSEO,
    fetchLogoUrl,
    fetchConfiguracion,
    TurismoPageData
} from "@/lib/api";
import { ConfiguracionData, GlobalSEO } from "@/types/home";
import { URL_DOMAIN } from "@/lib/globalConstants";

interface SedePageProps {
    turismoPageData: TurismoPageData | null;
    globalSEO: GlobalSEO | null;
    logoUrl: string | null;
    configuracion: ConfiguracionData | null;
}

export const getStaticProps: GetStaticProps<SedePageProps> = async () => {
    try {
        // Fetch all data in parallel
        const [turismoPageData, globalSEO, logoUrl, configuracion] = await Promise.all([
            fetchTurismoPage(),
            fetchGlobalSEO(),
            fetchLogoUrl(),
            fetchConfiguracion()
        ]);

        return {
            props: { turismoPageData, globalSEO, logoUrl, configuracion },
            revalidate: 60, // 60 seconds (1 min)
        };
    } catch (err) {
        console.error("Error fetching sede page data:", err);
        return {
            props: { 
                turismoPageData: null, 
                globalSEO: null, 
                logoUrl: null, 
                configuracion: null 
            },
            revalidate: 60,
        };
    }
};

export default function SedePage({ turismoPageData, globalSEO, logoUrl, configuracion }: SedePageProps) {
    // Default values for when data is not available
    const defaultTitle = "Sede del Congreso";
    const defaultDescription = "Información sobre la sede del congreso, hoteles y alojamiento para el Congreso de Pediatría.";

    return (
        <>
            <SEO
                globalSEO={globalSEO}
                pageTitle="Sede del Congreso - Congreso Médico"
                pageDescription={turismoPageData?.header?.description || defaultDescription}
                pageUrl={`${URL_DOMAIN}/sede`}
                pageType="website"
                logoUrl={logoUrl}
            />
            
            <div className="bg-white text-gray-800 space-y-12">
                <MainNav configuracion={configuracion} />
                
                <PageHeader 
                    title={turismoPageData?.header?.title || defaultTitle}
                    description={turismoPageData?.header?.description || defaultDescription}
                />

                {/* Main Content */}
                <section className="py-16 bg-white">
                    <div className="container max-w-[1280px] mx-auto px-4">
                        <DynamicHotelesSection />
                    </div>
                </section>
                
                <Footer configuracion={configuracion} />
            </div>
        </>
    );
}
