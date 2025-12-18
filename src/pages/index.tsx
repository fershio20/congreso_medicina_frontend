import SeccionHero from "@/components/home/SeccionHero";
import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import ExpertSection from "@/components/home/ExpertSection";
import IntroSection from "@/components/home/IntroSection";
import PartnersSection from "@/components/home/PartnersSection";
import TemasLibresSection from "@/components/home/TemasLibresSection";
import SedeCongresoSection from "@/components/home/SedeCongresoSection";
import ProgramaSection from "@/components/home/ProgramaSection";
import EjesSection from "@/components/home/EjesSection";
import {GetStaticProps} from "next";
import PreCongreso from "@/components/home/PreCongreso";
import SEO from "@/components/SEO";
import CostSection from "@/components/home/CostSection";

import {
    HomePageProps
} from "@/types/home";
import {
    fetchHeroData,
    fetchGlobalSEO,
    fetchLogoUrl,
    fetchConfiguracion
} from "@/lib/api";
import ThematicSection from "@/components/home/ThematicSection";


export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
    try {
        // Fetch all data in parallel
        const [heroData, globalSEO, logoUrl, configuracion] = await Promise.all([
            fetchHeroData(),
            fetchGlobalSEO(),
            fetchLogoUrl(),
            fetchConfiguracion()
        ]);

        return {
            props: {heroData, globalSEO, logoUrl, configuracion},
            revalidate: 60, // Cambiado de 600 segundos (10 min) a 60 segundos (1 min)
        };
    } catch (err) {
        console.error("Error fetching home page data:", err);
        return {
            props: {heroData: null, globalSEO: null, logoUrl: null, configuracion: null},
            revalidate: 60, // Cambiado de 600 segundos (10 min) a 60 segundos (1 min)
        };
    }
};

export default function Home({heroData, globalSEO, logoUrl, configuracion}: HomePageProps) {


    console.log("Configuracion en Home:", configuracion);
    return (
        <>
            <SEO
                globalSEO={globalSEO}
                pageTitle="Congreso de Pediatría Paraguay 2025"
                pageDescription="Congreso Internacional de Pediatría en Paraguay - Evento médico especializado en pediatría"
                pageUrl="https://congresopediatriapy.com"
                pageType="website"
                logoUrl={logoUrl}
            />

            <div className="bg-white text-gray-800 space-y-12">
                <MainNav configuracion={configuracion}/>
                <SeccionHero heroData={heroData} configuracion={configuracion}/>
                <IntroSection configuracion={configuracion}/>
                <ExpertSection/>
                <PreCongreso/>
                <CostSection/>

                {/*<EjesSection />*/}
                 <ThematicSection configuracion={configuracion} />

                {/* Programa del Congreso Section - Dynamic from API*/}
                <ProgramaSection/>

                 {/*Sede del Congreso Section - Dynamic from API*/}
                <SedeCongresoSection/>

                 {/*Temas Libres Section - Dynamic from API*/}
                <TemasLibresSection/>

                <PartnersSection/>
                <Footer configuracion={configuracion}/>
            </div>
        </>
    );
}
