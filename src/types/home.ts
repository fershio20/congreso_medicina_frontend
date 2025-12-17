// Global SEO interface
export interface GlobalSEO {
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

export interface HomeSectionData {
    titulo: string;
    descripcion: string;
    destacado: {
        url: string;
    };
    imgBackground?: string;
    proximaEdicionTitle: string;
    fecha: string;
}

export interface HomePageProps {
    heroData: HomeSectionData | null;
    globalSEO: GlobalSEO | null;
    logoUrl: string | null;
    configuracion: ConfiguracionData | null;
}

export interface StrapiHeroResponse {
    data?: {
        attributes?: {
            HomeSection?: {
                titulo?: string;
                descripcion?: string;
                destacado?: { url?: string };
                ProximaEdicion?: string;
                FechaEvento?: string;
                imageBackground?: { url?: string };
            };
        };
        HomeSection?: {
            titulo?: string;
            descripcion?: string;
            destacado?: { url?: string };
            ProximaEdicion?: string;
            FechaEvento?: string;
            imageBackground?: { url?: string };
        };
    };
}

export interface StrapiSEOResponse {
    data?: GlobalSEO;
}

export interface StrapiLogoResponse {
    data?: {
        HomeGeneral?: {
            logoCongreso?: {
                url?: string;
            };
        };
    };
}

export interface ConfiguracionData {
    nombre: string;
    descripcion?: string;
    logo?: {
        url?: string;
        formats?: {
            large?: { url: string };
            medium?: { url: string };
            small?: { url: string };
            thumbnail?: { url: string };
        };
    };
    color_main?: string;
    color_secondary?: string;
    color_text?: string;
    color_accent?: string;
}

export interface StrapiConfiguracionResponse {
    data?: {
        attributes?: ConfiguracionData;
        nombre?: string;
        descripcion?: string;
        logo?: ConfiguracionData['logo'];
        color_main?: string;
        color_secondary?: string;
        color_text?: string;
        color_accent?: string;
    };
}

