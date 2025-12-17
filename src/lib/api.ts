import { URL_DOMAIN } from "./globalConstants";
import {
    StrapiHeroResponse,
    StrapiSEOResponse,
    StrapiLogoResponse,
    StrapiConfiguracionResponse,
    HomeSectionData,
    GlobalSEO,
    ConfiguracionData
} from "@/types/home";

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
    const section = root?.HomeSection;

    if (!section) return null;

    return {
        titulo: section.titulo || '',
        descripcion: section.descripcion || '',
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
        "/api/configuracion?populate=*"
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
        color_accent: data.color_accent
    };
}

