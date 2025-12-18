import { URL_DOMAIN } from "./globalConstants";
import {
    StrapiHeroResponse,
    StrapiSEOResponse,
    StrapiLogoResponse,
    StrapiConfiguracionResponse,
    HomeSectionData,
    GlobalSEO,
    ConfiguracionData,
    StrapiHomeSection
} from "@/types/home";
import { ExpertData, RawExpertData } from "@/types/sections";

/**
 * Función genérica para hacer requests del lado del servidor
 * @param endpoint - Ruta del endpoint (sin el dominio base)
 * @returns Promise con la respuesta parseada como JSON o null si falla
 */
export async function fetchServerSide<T>(
    endpoint: string
): Promise<T | null> {
    try {
        const url = `${URL_DOMAIN}${endpoint}`;
        const res = await fetch(url, {
            headers: { Accept: "application/json" },
        });

        if (!res.ok) {
            // Only log non-404 errors (404s are expected and handled gracefully)
            if (res.status !== 404) {
                console.error(`Fetch failed: ${res.status} ${res.statusText}`, url);
            }
            return null;
        }

        const json = await res.json();
        return json as T;
    } catch (error) {
        // Only log network errors, not 404s
        if (error instanceof Error && !error.message.includes('404')) {
            console.error(`Error fetching ${endpoint}:`, error);
        }
        return null;
    }
}

/**
 * Normaliza datos del hero de Strapi
 */
function extractHeroFromStrapi(json: StrapiHeroResponse): HomeSectionData | null {
    const root = json?.data?.attributes ?? json?.data ?? {};
    const section: StrapiHomeSection | undefined = root?.HomeSection;

    if (!section) return null;

    return {
        habilitado: section.habilitado ?? true,
        titulo: section.titulo || '',
        descripcion: section.descripcion || '',
        subtitulo: section?.sub_titulo || '',
        destacado: {
            url: section.destacado?.url || ''
        },
        proximaEdicionTitle: section.ProximaEdicion || '',
        fecha: section.FechaEvento || '',
        imgBackground: section.imageBackground?.url ? `${URL_DOMAIN}${section.imageBackground.url}` : ''
    };
}

/**
 * Obtiene los datos del hero de la página de inicio
 */
export async function fetchHeroData(): Promise<HomeSectionData | null> {
    const json = await fetchServerSide<StrapiHeroResponse>(
        "/api/home-page?populate[HomeSection][populate]=*"
    );
    
    if (!json) return null;
    console.log('json data', json)
    return extractHeroFromStrapi(json);
}

/**
 * Obtiene los datos de SEO globales
 */
export async function fetchGlobalSEO(): Promise<GlobalSEO | null> {
    const json = await fetchServerSide<StrapiSEOResponse>(
        "/api/seo-setting?populate=*"
    );
    
    if (!json) return null;
    
    return json.data || null;
}

/**
 * Obtiene la URL del logo del congreso
 */
export async function fetchLogoUrl(): Promise<string | null> {
    const json = await fetchServerSide<StrapiLogoResponse>(
        "/api/home-page?populate[HomeGeneral][populate]=*"
    );
    
    if (!json) return null;
    
    const logoSection = json.data?.HomeGeneral;
    if (logoSection?.logoCongreso?.url) {
        return `${URL_DOMAIN}${logoSection.logoCongreso.url}`;
    }
    
    return null;
}

/**
 * Obtiene los datos de configuración
 */
export async function fetchConfiguracion(): Promise<ConfiguracionData | null> {
    const json = await fetchServerSide<StrapiConfiguracionResponse>(
        "/api/configuracion?populate[logo][populate]=*&populate[main_navigation][populate]=*"
    );
    
    if (!json || !json.data) return null;
    
    // Handle both response formats (with attributes or direct)
    const data = json.data.attributes || json.data;
    
    if (!data) return null;
    
    return {
        nombre: data.nombre || '',
        descripcion: data.descripcion,
        logo: data.logo,
        color_main: data.color_main,
        color_secondary: data.color_secondary,
        color_text: data.color_text,
        color_accent: data.color_accent,
        main_navigation:{
            variant: 'default',
            dark_mode: false,
        }
    };
}

/**
 * Interface para la respuesta de Disertantes de Strapi
 */
interface StrapiDisertantesResponse {
    data?: Array<RawExpertData | {
        id?: number;
        attributes?: {
            avatar?: {
                data?: {
                    attributes?: {
                        url?: string;
                    };
                };
            };
            nombre?: string;
            subtitulo?: string;
            descripcion?: string;
            pai?: {
                data?: {
                    attributes?: {
                        nombre?: string;
                        codigo?: string;
                    };
                };
            };
        };
        avatar?: {
            url?: string;
        };
        nombre?: string;
        subtitulo?: string;
        descripcion?: string;
        pai?: {
            nombre?: string;
            codigo?: string;
        };
    }>;
}

/**
 * Obtiene la lista de expertos/disertantes
 */
export async function fetchExperts(): Promise<ExpertData[]> {
    const json = await fetchServerSide<StrapiDisertantesResponse>(
        "/api/Disertantes?populate[avatar][populate]=*&populate[pai][populate]=*&pagination[pageSize]=100"
    );
    
    if (!json || !json.data) return [];
    
    // Handle both possible Strapi data structures
    const expertsData: ExpertData[] = json.data.map((expert: any) => {
        // Check if data is wrapped in attributes
        if (expert.attributes) {
            return {
                avatar: expert.attributes.avatar?.data?.attributes,
                nombre: expert.attributes.nombre || 'Nombre no disponible',
                subtitulo: expert.attributes.subtitulo || 'Especialidad no disponible',
                descripcion: expert.attributes.descripcion || 'Descripción no disponible',
                pai: expert.attributes.pai?.data?.attributes
            };
        }
        // If no attributes wrapper, use the data directly
        return {
            avatar: expert.avatar,
            nombre: expert.nombre || 'Nombre no disponible',
            subtitulo: expert.subtitulo || 'Especialidad no disponible',
            descripcion: expert.descripcion || 'Descripción no disponible',
            pai: expert.pai
        };
    });
    
    return expertsData;
}

/**
 * Interface para la respuesta de Turismo Page de Strapi
 */
interface StrapiTurismoPageResponse {
    data?: {
        id?: number;
        show_others_hotels?: boolean;
        show_interest_location?: boolean;
        header?: {
            id?: number;
            title?: string;
            description?: string;
        } | null;
        sede_hotel?: {
            id?: number;
            title?: string;
            isAvailable?: boolean | null;
            description?: string;
            direccion?: string;
            telefono?: string;
            map_location?: string;
            email?: string;
        };
    };
}

export interface TurismoPageData {
    id: number;
    show_others_hotels: boolean;
    show_interest_location: boolean;
    header: {
        id: number;
        title: string;
        description: string;
    } | null;
    sede_hotel: {
        id: number;
        title: string;
        isAvailable: boolean | null;
        description: string;
        direccion: string;
        telefono: string;
        map_location: string;
        email: string;
    };
}

/**
 * Obtiene los datos de la página de turismo/sede
 */
export async function fetchTurismoPage(): Promise<TurismoPageData | null> {
    const json = await fetchServerSide<StrapiTurismoPageResponse>(
        "/api/turismo-page?populate=*"
    );
    
    if (!json || !json.data) return null;
    
    const data = json.data;
    
    return {
        id: data.id || 0,
        show_others_hotels: data.show_others_hotels ?? true,
        show_interest_location: data.show_interest_location ?? true,
        header: data.header ? {
            id: data.header.id || 0,
            title: data.header.title || '',
            description: data.header.description || '',
        } : null,
        sede_hotel: {
            id: data.sede_hotel?.id || 0,
            title: data.sede_hotel?.title || '',
            isAvailable: data.sede_hotel?.isAvailable ?? null,
            description: data.sede_hotel?.description || '',
            direccion: data.sede_hotel?.direccion || '',
            telefono: data.sede_hotel?.telefono || '',
            map_location: data.sede_hotel?.map_location || '',
            email: data.sede_hotel?.email || '',
        },
    };
}

