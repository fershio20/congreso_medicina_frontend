import { URL_DOMAIN } from "./globalConstants";
import { fetchServerSide } from "./utils";
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
import {
    ExpertData,
    RawExpertData,
    HomeSectionsData,
    IntroSectionResponse,
    DisertantesSectionResponse,
    DisertantesListResponse,
    CostosSectionResponse,
    HomeSectionResponse,
    ThematicSectionResponse,
    APIResponse,
    TurismoPageResponse,
    TurismosResponse,
} from "@/types/sections";
import type { NavigationTree } from "@/types/navigation";
import type {
    PonenciaPageData,
    StrapiPonenciaResponse,
    TrabajoCientificoPageData,
    StrapiTrabajoCientificoResponse,
} from "@/lib/types";

export { fetchServerSide } from "./utils";

const PONENCIA_ENDPOINT = "/api/ponencia?populate[page_header][populate]=*&populate[seo][populate]=*";
const TRABAJO_CIENTIFICO_ENDPOINT = "/api/trabajo-cientifico?populate[page_header][populate]=*&populate[seo][populate]=*";
const WAYNAKAY_ENDPOINT = "/api/waynakay?populate[page_header][populate]=*&populate[seo][populate]=*";
const COSTOS_NACIONALES_ENDPOINT = "/api/costos-nacionales?populate[page_header][populate]=*&populate[seo][populate]=*";
const COSTOS_INTERNACIONALES_ENDPOINT = "/api/costos-internacionales?populate[page_header][populate]=*&populate[seo][populate]=*";

/**
 * Generic fetch for Strapi single types with page_header, content, seo
 * (Convocatoria - Ponencia, Convocatoria - Waynakay, etc.)
 */
export async function fetchConvocatoriaSingleData(endpoint: string): Promise<PonenciaPageData | null> {
    const json = await fetchServerSide<StrapiPonenciaResponse>(endpoint);
    if (!json?.data) return null;
    const attrs = json.data.attributes ?? json.data;
    return (attrs as PonenciaPageData) ?? null;
}

/**
 * Fetches Convocatoria - Ponencia page data from Strapi
 */
export async function fetchPonenciaData(): Promise<PonenciaPageData | null> {
    return fetchConvocatoriaSingleData(PONENCIA_ENDPOINT);
}

/**
 * Fetches Convocatoria - Waynakay page data from Strapi (single type waynakay)
 */
export async function fetchWaynakayData(): Promise<PonenciaPageData | null> {
    return fetchConvocatoriaSingleData(WAYNAKAY_ENDPOINT);
}

/**
 * Fetches Costos - Nacionales page data from backend
 */
export async function fetchCostosNacionalesData(): Promise<PonenciaPageData | null> {
    return fetchConvocatoriaSingleData(COSTOS_NACIONALES_ENDPOINT);
}

/**
 * Fetches Costos - Internacionales page data from backend
 */
export async function fetchCostosInternacionalesData(): Promise<PonenciaPageData | null> {
    return fetchConvocatoriaSingleData(COSTOS_INTERNACIONALES_ENDPOINT);
}

/**
 * Fetches Convocatoria - Trabajo Científico page data from Strapi
 */
export async function fetchTrabajoCientificoData(): Promise<TrabajoCientificoPageData | null> {
    const json = await fetchServerSide<StrapiTrabajoCientificoResponse>(TRABAJO_CIENTIFICO_ENDPOINT);
    if (!json?.data) return null;
    const { content, page_header, seo } = json.data;
    return { content, page_header, seo };
}

/**
 * Normaliza datos del hero de Strapi
 */
function extractHeroButtons(buttons: StrapiHomeSection["buttons"]): HomeSectionData["buttons"] {
    if (!buttons || !Array.isArray(buttons)) return null;
    return buttons
        .filter((b) => b?.label)
        .map((b) => ({
            label: b.label || "",
            target: b.target || "#",
            variant: b.variant,
            style: b.style,
            icon_button: b.icon_button,
        }));
}

function extractHeroFromStrapi(json: StrapiHeroResponse): HomeSectionData | null {
    const root = json?.data?.attributes ?? json?.data ?? {};
    const section: StrapiHomeSection | undefined = root?.HomeSection;
    if (!section) return null;

    return {
        habilitado: section.habilitado ?? true,
        titulo: section.titulo || "",
        descripcion: section.descripcion || "",
        subtitulo: section?.sub_titulo || "",
        destacado: {
            url: section.destacado?.url || "",
        },
        proximaEdicionTitle: section.ProximaEdicion || "",
        fecha: section.FechaEvento || "",
        imgBackground: section.imageBackground?.url
            ? `${URL_DOMAIN}${section.imageBackground.url}`
            : null,
        buttons: extractHeroButtons(section.buttons) ?? null,
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
        "/api/seo-setting?populate[default_og_image]=true"
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
        "/api/configuracion?populate[logo][populate]=*&populate[main_navigation][populate]=*&populate[footer][populate]=*"
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
        footer: data.footer,
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
 * Fetches the navigation tree (Strapi Navigation plugin) server-side so MainNav
 * can render from props instead of fetching through the proxy on every request.
 */
export async function fetchNavigation(): Promise<NavigationTree | null> {
    return fetchServerSide<NavigationTree>(
        "/api/navigation/render/navigation?type=TREE&menu=true"
    );
}

/** Fetches the turismo (sede/hotels) page single type server-side. */
export async function fetchTurismoPage(): Promise<TurismoPageResponse | null> {
    return fetchServerSide<TurismoPageResponse>(
        "/api/turismo-page?populate[sede_hotel][populate]=*&populate[header][populate]=*&populate[SEO][populate]=*"
    );
}

/** Fetches the turismo items (hotels and points of interest) server-side.
 * Only the fields rendered by the sede page are requested to keep the SSG
 * page payload small (populate=* embedded full media metadata per item). */
export async function fetchTurismos(): Promise<TurismosResponse | null> {
    return fetchServerSide<TurismosResponse>(
        "/api/turismos?fields[0]=title&fields[1]=is_available&fields[2]=type&fields[3]=telephone&fields[4]=email&fields[5]=distance&fields[6]=map_url_location&populate[featured_image][fields][0]=url"
    );
}

/** Fallback used when home section data cannot be fetched. */
export const EMPTY_HOME_SECTIONS: HomeSectionsData = {
    intro: null,
    disertantesSection: null,
    disertantesList: null,
    costos: null,
    programa: null,
    sede: null,
    temasLibres: null,
    partners: null,
    ejes: null,
};

/**
 * Fetches all home page section data server-side (build/ISR) so the home
 * components render from props instead of firing client-side requests through
 * the /api/strapi function proxy on every visit. Each query mirrors the exact
 * shape the matching component already consumed via SWR.
 */
export async function fetchHomeSections(): Promise<HomeSectionsData> {
    const [
        intro,
        disertantesSection,
        disertantesList,
        costos,
        programa,
        sede,
        temasLibres,
        partners,
        ejes,
    ] = await Promise.all([
        fetchServerSide<IntroSectionResponse>(
            "/api/home-page?populate[IntroSectionHome][populate]=*"
        ),
        fetchServerSide<DisertantesSectionResponse>(
            "/api/home-page?populate[DisertantesSection][populate]=*"
        ),
        fetchServerSide<DisertantesListResponse>(
            "/api/Disertantes?populate[avatar][populate]=*&populate[pai][populate]=*"
        ),
        fetchServerSide<CostosSectionResponse>(
            "/api/home-page?populate[CostosSection][populate]=*"
        ),
        fetchServerSide<HomeSectionResponse>(
            "/api/home-page?populate[programa_section][populate]=*"
        ),
        fetchServerSide<HomeSectionResponse>(
            "/api/home-page?populate[sede_congreso_section][populate]=*"
        ),
        fetchServerSide<HomeSectionResponse>(
            "/api/home-page?populate[tema_libre_section][populate]=*"
        ),
        fetchServerSide<APIResponse>(
            "/api/home-page?populate[Auspiciantes][populate][AuspiciantesSection][populate][Auspiciante][populate][auspiciante][populate]=*"
        ),
        fetchServerSide<ThematicSectionResponse>(
            "/api/home-page?populate[EjesTematicosSection][populate][EjesTematicos][populate]=*"
        ),
    ]);

    return {
        intro,
        disertantesSection,
        disertantesList,
        costos,
        programa,
        sede,
        temasLibres,
        partners,
        ejes,
    };
}
