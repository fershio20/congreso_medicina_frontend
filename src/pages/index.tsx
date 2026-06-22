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
    fetchConfiguracion,
    fetchHomeSections,
    fetchNavigation,
    EMPTY_HOME_SECTIONS
} from "@/lib/api";
import ThematicSection from "@/components/home/ThematicSection";


export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
    try {
        // Fetch all data in parallel
        const [heroData, globalSEO, logoUrl, configuracion, homeSections, navTree] = await Promise.all([
            fetchHeroData(),
            fetchGlobalSEO(),
            fetchLogoUrl(),
            fetchConfiguracion(),
            fetchHomeSections(),
            fetchNavigation()
        ]);

        return {
            props: {heroData, globalSEO, logoUrl, configuracion, homeSections, navTree},
            revalidate: 86400, // 24h - on-demand revalidation via Strapi webhook handles updates
        };
    } catch (err) {
        console.error("Error fetching home page data:", err);
        return {
            props: {heroData: null, globalSEO: null, logoUrl: null, configuracion: null, homeSections: EMPTY_HOME_SECTIONS, navTree: null},
            revalidate: 86400, // 24h - on-demand revalidation via Strapi webhook handles updates
        };
    }
};

export default function Home({heroData, globalSEO, logoUrl, configuracion, homeSections, navTree}: HomePageProps) {

    // console.log('Home Page Rendered SEO', globalSEO);
    // console.log("Configuracion en Home!!!!!!!!!:", configuracion);
    // console.log("HeroData en Home:", heroData);
    return (
        <>
            <SEO
                globalSEO={globalSEO ? globalSEO : null}
                pageTitle=""
                pageDescription=""
                pageUrl=""
                pageType="website"
                logoUrl={logoUrl}
            />

            <div className="bg-white text-gray-800 space-y-12">
                <MainNav configuracion={configuracion} navTree={navTree}/>
                <SeccionHero heroData={heroData} configuracion={configuracion}/>
                <IntroSection configuracion={configuracion} introData={homeSections.intro}/>
                <ExpertSection disertantesSection={homeSections.disertantesSection} disertantesList={homeSections.disertantesList}/>
                <PreCongreso/>
                <CostSection configuracion={configuracion} costosData={homeSections.costos}/>

                {/*<EjesSection />*/}
                 <ThematicSection configuracion={configuracion} ejesData={homeSections.ejes} />

                {/* Programa del Congreso Section - Dynamic from API*/}
                <ProgramaSection homeData={homeSections.programa}/>

                 {/*Sede del Congreso Section - Dynamic from API*/}
                <SedeCongresoSection homeData={homeSections.sede}/>

                 {/*Temas Libres Section - Dynamic from API*/}
                <TemasLibresSection homeData={homeSections.temasLibres}/>

                <PartnersSection partnersData={homeSections.partners}/>
                <Footer configuracion={configuracion}/>
            </div>
        </>
    );
}
