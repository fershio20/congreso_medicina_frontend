import React, { useState, useEffect } from 'react';
import MainNav from '@/components/MainNav';
import PageHeader from '@/components/global/PageHeader';
import Footer from '@/components/global/footer';
import SEO from '@/components/SEO';
import { GetStaticProps } from 'next';
import { URL_DOMAIN } from '@/lib/globalConstants';

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

interface AgendaItem {
    id: number;
    Titulo: string;
    Adjunto: {
        id: number;
        name: string;
        url: string;
        mime: string;
        size: number;
    };
}

interface ProgramaPageData {
    title?: string;
    description?: string;
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

interface ProgramaPageProps {
    agenda: AgendaItem[];
    programaPageData: ProgramaPageData | null;
    globalSEO: GlobalSEO | null;
    logoUrl: string | null;
}

export const getStaticProps: GetStaticProps<ProgramaPageProps> = async () => {
    const PROGRAMA_ENDPOINT = `${URL_DOMAIN}/api/pagina-de-programa?populate[Agenda][populate]=*`;
    const SEO_ENDPOINT = `${URL_DOMAIN}/api/seo-setting?populate=*`;
    const LOGO_ENDPOINT = `${URL_DOMAIN}/api/home-page?populate[HomeGeneral][populate]=*`;

    try {
        // Fetch programa data with timeout and better error handling
        const programaRes = await Promise.race([
            fetch(PROGRAMA_ENDPOINT, {
                headers: { Accept: "application/json" },
            }),
            new Promise<Response>((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 10000)
            )
        ]);

        if (!programaRes.ok) {
            console.error("Programa fetch failed:", programaRes.status, programaRes.statusText, PROGRAMA_ENDPOINT);
            // Return fallback data instead of empty arrays
            return {
                props: { 
                    agenda: [], 
                    programaPageData: {
                        title: "Programa del Congreso",
                        description: "Agenda completa del congreso con todas las actividades, conferencias y eventos programados"
                    }, 
                    globalSEO: null, 
                    logoUrl: null 
                },
                revalidate: 60 * 5, // Shorter revalidation time for failed requests
            };
        }

        const programaJson = await programaRes.json();
        const agenda = programaJson.data?.Agenda || [];

        // Fetch programa page data (if exists)
        let programaPageData = null;
        try {
            // For now, we'll create a basic structure since the endpoint doesn't have page-specific data
            programaPageData = {
                title: "Programa del Congreso",
                description: "Agenda completa del congreso con todas las actividades, conferencias y eventos programados"
            };
        } catch (error) {
            console.error("Error processing programa page data:", error);
            programaPageData = {
                title: "Programa del Congreso",
                description: "Agenda completa del congreso con todas las actividades, conferencias y eventos programados"
            };
        }

        // Fetch global SEO data with timeout
        let globalSEO = null;
        try {
            const seoRes = await Promise.race([
                fetch(SEO_ENDPOINT, {
                    headers: { Accept: "application/json" },
                }),
                new Promise<Response>((_, reject) => 
                    setTimeout(() => reject(new Error('SEO request timeout')), 8000)
                )
            ]);
            
            if (seoRes.ok) {
                const seoJson = await seoRes.json();
                globalSEO = seoJson.data || null;
            } else {
                console.error("SEO fetch failed:", seoRes.status, seoRes.statusText, SEO_ENDPOINT);
            }
        } catch (seoError) {
            console.error("Error fetching global SEO:", seoError);
            // Continue without SEO data
        }

        // Fetch logo data for favicon with timeout
        let logoUrl = null;
        try {
            const logoRes = await Promise.race([
                fetch(LOGO_ENDPOINT, {
                    headers: { Accept: "application/json" },
                }),
                new Promise<Response>((_, reject) => 
                    setTimeout(() => reject(new Error('Logo request timeout')), 8000)
                )
            ]);
            
            if (logoRes.ok) {
                const logoJson = await logoRes.json();
                const logoSection = logoJson.data?.HomeGeneral;
                if (logoSection?.logoCongreso?.url) {
                    logoUrl = `${URL_DOMAIN}${logoSection.logoCongreso.url}`;
                }
            } else {
                console.error("Logo fetch failed:", logoRes.status, logoRes.statusText);
            }
        } catch (logoError) {
            console.error("Error fetching logo:", logoError);
            // Continue without logo
        }

        return {
            props: { 
                agenda, 
                programaPageData: programaPageData || null, 
                globalSEO: globalSEO || null,
                logoUrl: logoUrl || null
            },
            revalidate: 60 * 10,
        };
    } catch (err) {
        console.error("Error fetching programa data:", err);
        // Return fallback data instead of empty arrays
        return {
            props: { 
                agenda: [], 
                programaPageData: {
                    title: "Programa del Congreso",
                    description: "Agenda completa del congreso con todas las actividades, conferencias y eventos programados"
                }, 
                globalSEO: null, 
                logoUrl: null 
            },
            revalidate: 60 * 5, // Shorter revalidation time for failed requests
        };
    }
};

const ProgramaPage = ({ agenda, programaPageData, globalSEO, logoUrl }: ProgramaPageProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const [iframeSupported, setIframeSupported] = useState(true);
    const [iframeError, setIframeError] = useState(false);
    const [componentError, setComponentError] = useState<string | null>(null);

    useEffect(() => {
        // Check if iframe is supported
        try {
            const testIframe = document.createElement('iframe');
            setIframeSupported(!!testIframe.contentWindow);
        } catch (error) {
            console.error('Error checking iframe support:', error);
            setIframeSupported(false);
        }
    }, []);

    // Handle iframe load error
    const handleIframeError = () => {
        setIframeError(true);
    };

    // Error boundary for the component
    if (componentError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-red-500 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Error en la página del programa</h1>
                    <p className="text-gray-600 mb-6">{componentError}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-[#0F62A5] text-white px-6 py-3 rounded-lg hover:bg-[#0F62A5]/90 transition-colors duration-200"
                    >
                        Recargar página
                    </button>
                </div>
            </div>
        );
    }

    // Determine the background image for PageHeader
    const backgroundImage = programaPageData?.featured_image?.formats?.large?.url 
        ? `${URL_DOMAIN}${programaPageData.featured_image.formats.large.url}`
        : programaPageData?.featured_image?.url 
        ? `${URL_DOMAIN}${programaPageData.featured_image.url}`
        : "/bg-default-blue.png";

    // Get current PDF URL
    const currentPdfUrl = agenda[activeTab]?.Adjunto?.url ? `${URL_DOMAIN}${agenda[activeTab].Adjunto.url}` : '';

    // Validate agenda data
    if (!Array.isArray(agenda)) {
        console.error('Invalid agenda data:', agenda);
        setComponentError('Los datos del programa no son válidos');
        return null;
    }

    try {
        return (
            <>
                <SEO 
                    pageSEO={programaPageData?.SEO}
                    globalSEO={globalSEO}
                    pageTitle={programaPageData?.title || "Programa del Congreso - Congreso de Pediatría Paraguay 2025"}
                    pageDescription={programaPageData?.description || "Programa completo del IX Congreso Internacional de Pediatría en Paraguay. Agenda con todas las actividades, conferencias y eventos programados."}
                    pageImage={backgroundImage}
                    pageUrl={`${URL_DOMAIN}/programa`}
                    pageType="event"
                    logoUrl={logoUrl}
                />
                
                <div className="bg-white text-gray-800 space-y-12">
                    <MainNav />
                    
                    <PageHeader 
                        title={programaPageData?.title || "Programa del Congreso"}
                        description={programaPageData?.description || "Agenda completa del congreso con todas las actividades, conferencias y eventos programados"}
                        customBackgroundImage={backgroundImage}
                        showBlueOverlay={false}
                    />

                    {/* Tabs Section */}
                    <section className="py-16 bg-white">
                        <div className="container max-w-[1280px] mx-auto px-4">
                            {agenda.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">El programa se encuentra en construcción</h3>
                                    <p className="text-gray-500">La agenda del congreso se publicará próximamente.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Tabs Navigation */}
                                    <div className="flex flex-wrap justify-center mb-8">
                                        {agenda.map((item, index) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setActiveTab(index);
                                                    setIframeError(false);
                                                }}
                                                className={`px-6 py-3 mx-2 mb-2 rounded-lg font-medium transition-all duration-300 ${
                                                    activeTab === index
                                                        ? 'bg-[#0F62A5] text-white shadow-lg'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                            >
                                                {item.Titulo}
                                            </button>
                                        ))}
                                    </div>

                                    {/* PDF Content */}
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                        <div className="h-[800px] w-full">
                                            {/* Try iframe first */}
                                            {iframeSupported && !iframeError && currentPdfUrl && (
                                                <iframe
                                                    src={currentPdfUrl}
                                                    className="w-full h-full border-0"
                                                    title={agenda[activeTab]?.Titulo}
                                                    onError={handleIframeError}
                                                    onLoad={() => setIframeError(false)}
                                                />
                                            )}

                                            {/* Fallback to object if iframe fails */}
                                            {(!iframeSupported || iframeError) && currentPdfUrl && (
                                                <object
                                                    data={currentPdfUrl}
                                                    type="application/pdf"
                                                    className="w-full h-full"
                                                >
                                                    <div className="h-full w-full flex items-center justify-center bg-gray-50">
                                                        <div className="text-center">
                                                            <div className="text-gray-400 mb-4">
                                                                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                                {agenda[activeTab]?.Titulo}
                                                            </h3>
                                                            <p className="text-gray-500 mb-4">
                                                                {agenda[activeTab]?.Adjunto?.name}
                                                            </p>
                                                            <div className="space-y-2">
                                                                <a 
                                                                    href={currentPdfUrl}
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="inline-block bg-[#0F62A5] text-white px-6 py-3 rounded-lg hover:bg-[#0F62A5]/90 transition-colors duration-200 mr-2"
                                                                >
                                                                    Ver en nueva pestaña
                                                                </a>
                                                                <a 
                                                                    href={currentPdfUrl}
                                                                    download={agenda[activeTab]?.Adjunto?.name}
                                                                    className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                                                                >
                                                                    Descargar PDF
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </object>
                                            )}

                                            {/* Final fallback if no PDF URL */}
                                            {!currentPdfUrl && (
                                                <div className="h-full w-full flex items-center justify-center bg-gray-50">
                                                    <div className="text-center">
                                                        <div className="text-gray-400 mb-4">
                                                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                                            PDF no disponible
                                                        </h3>
                                                        <p className="text-gray-500">
                                                            El archivo PDF para {agenda[activeTab]?.Titulo} no está disponible.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <Footer />
                </div>
            </>
        );
    } catch (error) {
        console.error('Error rendering programa page:', error);
        setComponentError('Error al renderizar la página del programa');
        return null;
    }
};

export default ProgramaPage;
