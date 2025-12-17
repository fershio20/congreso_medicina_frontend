import React from "react";
import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import PreTallerImageCard from "@/components/PreTallerImageCard";
import { GetStaticProps } from "next";
import { URL_DOMAIN } from "@/lib/globalConstants";
import PageHeader from "@/components/global/PageHeader";
import SEO from "@/components/SEO";

// Global SEO interface
interface GlobalSEO {
    site_description: string;
    site_keywords: string;
    canonical_domain: string;
    google_analytics_id?: string;
    google_tag_manager_id?: string;
    facebook_pixel_id?: string;
    default_og_image: {
        url: string;
        formats?: {
            large?: { url: string };
            medium?: { url: string };
            small?: { url: string };
            thumbnail?: { url: string };
        };
    };
}

interface Taller {
    id: number;
    title: string;
    description?: string;
    featured_image?: {
        url: string;
    };
    documento?: {
        url: string;
        name?: string;
    };
    fecha?: string;
    horario?: string;
    lugar?: string;
    cupos?: number;
}

interface PageSEO {
    id: number;
    meta_title: string;
    meta_description: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_type?: string;
    twitter_card?: string;
    canonical_url?: string;
    no_index?: boolean;
    structured_data?: Record<string, unknown>;
}

interface TalleresPageData {
    title: string;
    description: string;
    featured_image: Array<{
        url: string;
        formats?: {
            large?: { url: string };
            medium?: { url: string };
            small?: { url: string };
            thumbnail?: { url: string };
        };
    }>;
    SEO?: PageSEO;
}

interface TalleresPageProps {
    talleres: Taller[];
    talleresPageData: TalleresPageData | null;
    globalSEO: GlobalSEO | null;
    logoUrl: string | null;
}

export const getStaticProps: GetStaticProps<TalleresPageProps> = async () => {
    const TALLERES_ENDPOINT = `${URL_DOMAIN}/api/talleres?populate=*`;
    const TALLERES_PAGE_ENDPOINT = `${URL_DOMAIN}/api/talleres-page?populate=*`;
    const SEO_ENDPOINT = `${URL_DOMAIN}/api/seo-setting?populate=*`;
    const LOGO_ENDPOINT = `${URL_DOMAIN}/api/home-page?populate[HomeGeneral][populate]=*`;

    try {
        // Fetch talleres data
        const talleresRes = await fetch(TALLERES_ENDPOINT, {
            headers: { Accept: "application/json" },
        });

        if (!talleresRes.ok) {
            console.error("Talleres fetch failed:", talleresRes.status, TALLERES_ENDPOINT);
            return {
                props: { talleres: [], talleresPageData: null, globalSEO: null, logoUrl: null },
                revalidate: 60 * 10,
            };
        }

        const talleresJson = await talleresRes.json();
        const talleres = talleresJson.data || [];

        // Fetch talleres page data
        let talleresPageData = null;
        try {
            const talleresPageRes = await fetch(TALLERES_PAGE_ENDPOINT, {
                headers: { Accept: "application/json" },
            });
            if (talleresPageRes.ok) {
                const talleresPageJson = await talleresPageRes.json();
                talleresPageData = talleresPageJson.data?.attributes || talleresPageJson.data || null;
            }
        } catch (error) {
            console.error("Error fetching talleres page data:", error);
        }

        // Fetch global SEO data
        let globalSEO = null;
        try {
            const seoRes = await fetch(SEO_ENDPOINT, {
                headers: { Accept: "application/json" },
            });
            if (seoRes.ok) {
                const seoJson = await seoRes.json();
                globalSEO = seoJson.data || null;
            } else {
                console.error("SEO fetch failed:", seoRes.status, SEO_ENDPOINT);
            }
        } catch (seoError) {
            console.error("Error fetching global SEO:", seoError);
        }

        // Fetch logo data for favicon
        let logoUrl = null;
        try {
            const logoRes = await fetch(LOGO_ENDPOINT, {
                headers: { Accept: "application/json" },
            });
            if (logoRes.ok) {
                const logoJson = await logoRes.json();
                const logoSection = logoJson.data?.HomeGeneral;
                if (logoSection?.logoCongreso?.url) {
                    logoUrl = `${URL_DOMAIN}${logoSection.logoCongreso.url}`;
                }
            } else {
                console.error("Logo fetch failed:", logoRes.status);
            }
        } catch (logoError) {
            console.error("Error fetching logo:", logoError);
        }

        return {
            props: { 
                talleres, 
                talleresPageData: talleresPageData || null, 
                globalSEO: globalSEO || null,
                logoUrl: logoUrl || null
            },
            revalidate: 60 * 10,
        };
    } catch (err) {
        console.error("Error fetching talleres data:", err);
        return {
            props: { talleres: [], talleresPageData: null, globalSEO: null, logoUrl: null },
            revalidate: 60 * 10,
        };
    }
};

export default function TalleresPage({ talleres, talleresPageData, globalSEO, logoUrl }: TalleresPageProps) {
    // Determine the background image for PageHeader
    const backgroundImage = talleresPageData?.featured_image?.[0]?.formats?.large?.url 
        ? `${URL_DOMAIN}${talleresPageData.featured_image[0].formats.large.url}`
        : talleresPageData?.featured_image?.[0]?.url 
        ? `${URL_DOMAIN}${talleresPageData.featured_image[0].url}`
        : "/congreso/concurso.png";

    return (
        <>
            <SEO 
                pageSEO={talleresPageData?.SEO}
                globalSEO={globalSEO}
                pageTitle="Talleres - Congreso de Pediatría Paraguay 2025"
                pageDescription="Descubre todos los talleres disponibles para el IX Congreso Internacional de Pediatría en Paraguay. Formación médica especializada."
                pageImage={backgroundImage}
                pageUrl={`${URL_DOMAIN}/talleres`}
                pageType="event"
                logoUrl={logoUrl}
            />
            
            <div className="bg-white text-gray-800 space-y-12">
                <MainNav />
                
                <PageHeader 
                    title={talleresPageData?.title || "Talleres Pre-Congreso"}
                    description={talleresPageData?.description || ""}
                    customBackgroundImage={backgroundImage}
                    showBlueOverlay={false}
                />

                {/* Main Content */}
                <section className="py-16 bg-white">
                    <div className="container max-w-[1280px] mx-auto px-4">
                      

                        {talleres.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay talleres disponibles</h3>
                                <p className="text-gray-500">Los talleres se publicarán próximamente.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {talleres.map((taller) => {
                                    // Get the documento URL if available
                                    const documento = taller.documento ? {
                                        url: taller.documento.url.startsWith('http') 
                                            ? taller.documento.url 
                                            : `${URL_DOMAIN}${taller.documento.url}`,
                                        name: taller.documento.name
                                    } : undefined;

                                    return (
                                        <div key={taller.id} className="bg-white rounded-b-sm shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full">
                                            <PreTallerImageCard
                                                imageSrc={taller.featured_image?.url ? `${URL_DOMAIN}${taller.featured_image.url}` : "/expert-img-default.png"}
                                                name={taller.title}
                                                documento={documento}
                                            />
                                            <div className="">
                                                {taller.description && (
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                                        {taller.description}
                                                    </p>
                                                )}
                                                <div className="space-y-2 text-sm text-gray-500">
                                                    {taller.fecha && (
                                                        <p><span className="font-semibold">Fecha:</span> {taller.fecha}</p>
                                                    )}
                                                    {taller.horario && (
                                                        <p><span className="font-semibold">Horario:</span> {taller.horario}</p>
                                                    )}
                                                    {taller.lugar && (
                                                        <p><span className="font-semibold">Lugar:</span> {taller.lugar}</p>
                                                    )}
                                                    {taller.cupos && (
                                                        <p><span className="font-semibold">Cupos:</span> {taller.cupos}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
