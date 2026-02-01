import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import React from "react";
import {GetStaticProps} from "next";
import {URL_DOMAIN, URL_DOMAIN_IMG} from "@/lib/globalConstants";
import PageHeader from "@/components/global/PageHeader";
import SEO from "@/components/SEO";
import {fetchConfiguracion} from "@/lib/api";
import type {ConfiguracionData} from "@/types/home";
import MiembrosGrid from "@/pages/autoridades/components/_MiembrosGrid";

// Global SEO interface
interface GlobalSEO {
    site_title: string;
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

interface Miembro {
    Cargo: string;
    nombre: string;
    id: number;
    NombreCompleto: string;
    TituloProfesion?: string;
    Especialidad?: string;
    Pais?: string;
    Descripcion?: string;
    avatar?: {
        url: string;
    };
    cv?: string;
}

interface Comite {
    id: number;
    Seccion?: string;
    Miembros: Miembro[];
    Descripcion?: string;
    Subtitulo?: string;
    DisertantesHabilitados?: boolean
}

interface ComisionPageData {
    title: string;
    description: string;
    featured_image?: {
        url: string;
        formats?: {
            large?: { url: string };
            medium?: { url: string };
            small?: { url: string };
            thumbnail?: { url: string };
        };
    };
    SEO?: PageSEO;
}

interface Props {
    comite: Comite[];
    comisionPageData: ComisionPageData | null;
    globalSEO: GlobalSEO | null;
    logoUrl: string | null;
    configuracion: ConfiguracionData | null;
}

/* ===== Helpers ===== */
const COMISION_LIST = "/api/home-page?populate[ComiteOrganizadorSection][populate][Miembros][populate]=*";
const COMISION_PAGE_ENDPOINT = "/api/comision-page?populate=*";

/**
 * Normaliza Strapi v4/v5:
 * - a veces los datos vienen en data.attributes
 * - otras veces directamente en data
 */
interface StrapiResponse {
    data?: {
        attributes?: {
            ComiteOrganizadorSection?: Comite[];
        };
        ComiteOrganizadorSection?: Comite[];
    };
}

function extractComiteFromStrapi(json: StrapiResponse): Comite[] {
    const root = json?.data?.attributes ?? json?.data ?? {};
    return root?.ComiteOrganizadorSection ?? [];
}

/* =========================================================
   SSG + ISR
   - Genera HTML estático en build
   - Revalida en background cada X segundos
   ========================================================= */
export const getStaticProps: GetStaticProps<Props> = async () => {
    const COMISION_LIST_ENDPOINT = `${URL_DOMAIN}${COMISION_LIST}`;
    const COMISION_ENDPOINT = `${URL_DOMAIN}${COMISION_PAGE_ENDPOINT}`;
    const SEO_ENDPOINT = `${URL_DOMAIN}/api/seo-setting?populate=*`;
    const LOGO_ENDPOINT = `${URL_DOMAIN}/api/home-page?populate[HomeGeneral][populate]=*`;

    try {
        // Fetch comite organizador data and configuracion in parallel
        const [res, configuracion] = await Promise.all([
            fetch(COMISION_LIST_ENDPOINT, { headers: { Accept: "application/json" } }),
            fetchConfiguracion()
        ]);

        if (!res.ok) {
            console.error("Comite organizador fetch failed:", res.status, COMISION_LIST_ENDPOINT);
            return {
                props: { comite: [], comisionPageData: null, globalSEO: null, logoUrl: null, configuracion: configuracion ?? null },
                revalidate: 60 * 10,
            };
        }

        const json = await res.json();
        const comite = extractComiteFromStrapi(json);

        // Fetch comision page data
        let comisionPageData = null;
        try {
            const comisionPageRes = await fetch(COMISION_ENDPOINT, {
                headers: {Accept: "application/json"},
            });
            if (comisionPageRes.ok) {
                const comisionPageJson = await comisionPageRes.json();
                comisionPageData = comisionPageJson.data?.attributes || comisionPageJson.data || null;
            }
        } catch (error) {
            console.error("Error fetching comision page data:", error);
        }

        // Fetch global SEO data
        let globalSEO = null;
        try {
            const seoRes = await fetch(SEO_ENDPOINT, {
                headers: {Accept: "application/json"},
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
                headers: {Accept: "application/json"},
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
                comite,
                comisionPageData: comisionPageData || null,
                globalSEO: globalSEO || null,
                logoUrl: logoUrl || null,
                configuracion: configuracion ?? null
            },
            revalidate: 60 * 10,
        };
    } catch (err) {
        console.error("Error fetching comite organizador data:", err);
        return {
            props: { comite: [], comisionPageData: null, globalSEO: null, logoUrl: null, configuracion: null },
            revalidate: 60 * 10,
        };
    }
};

export default function ComiteOrganizadorPage({ comite, comisionPageData, globalSEO, logoUrl, configuracion }: Props) {
    // Determine the background image for PageHeader
    const backgroundImage = comisionPageData?.featured_image?.formats?.large?.url
        ? `${URL_DOMAIN_IMG}${comisionPageData.featured_image.formats.large.url}`
        : comisionPageData?.featured_image?.url
            ? `${URL_DOMAIN_IMG}${comisionPageData.featured_image.url}`
            : "/bg-default-blue.png";
    console.log('CHECK DE COMITE', comite)
    return (
        <>
            <SEO
                pageSEO={comisionPageData?.SEO}
                globalSEO={globalSEO}
                pageTitle={comisionPageData?.title || "Comité Organizador 2025"}
                pageDescription={comisionPageData?.description || "Conoce a los miembros del Comité Organizador del Congreso de Pediatría."}
                pageImage={backgroundImage}
                pageUrl={`${URL_DOMAIN}/autoridades/comite-organizador`}
                pageType="organization"
                logoUrl={logoUrl}
            />

            <div className="bg-white text-gray-800 space-y-12">
                <MainNav configuracion={configuracion}/>

                <PageHeader
                    title={comisionPageData?.title || "Comité Organizador 2025"}
                    description={comisionPageData?.description || "Conoce a los miembros del Comité Organizador del Congreso de Pediatría."}
                    customBackgroundImage={backgroundImage}
                    showBlueOverlay={false}
                />

                <section className="py-16 bg-white">
                    <div className="container max-w-[1280px] mx-auto px-4">
                        {comite.length > 0 ? (
                            (() => {
                                const hasAnyAvatarOnPage = comite.some(comiteSection =>
                                    comiteSection.Miembros.some(miembro => miembro.avatar?.url)
                                );
                                return (
                                    <div className="space-y-12">
                                        {comite.map((comiteSection) =>
                                            comiteSection.Miembros.length > 0 ? (
                                                <div key={comiteSection.id} className="mb-20">
                                                    {(comiteSection.Seccion && comiteSection.DisertantesHabilitados) && (
                                                        <div className="text-center">
                                                            <h3 className="uppercase text-blue-950">{comiteSection.Seccion}</h3>
                                                            <h4>{comiteSection.Subtitulo ?? ''}</h4>
                                                            <p>{comiteSection.Descripcion ?? ""}</p>
                                                        </div>
                                                    )}
                                                    <MiembrosGrid
                                                        miembros={comiteSection.Miembros}
                                                        hasAnyAvatarOnPage={hasAnyAvatarOnPage}
                                                        cargoFallback={''}
                                                    />
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                );
                            })()
                        ) : (
                            <div className="text-center py-20">
                                <div className="text-gray-400 mb-4">
                                    <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay miembros
                                    disponibles</h3>
                                <p className="text-gray-500">La información del Comité Organizador se publicará
                                    próximamente.</p>
                            </div>
                        )}
                    </div>
                </section>
                <Footer configuracion={configuracion} />
            </div>
        </>
    );
}
