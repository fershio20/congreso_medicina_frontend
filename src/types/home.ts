// Global SEO interface
export interface GlobalSEO {
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

/** Hero button from CMS (repeatable component) */
export interface HeroButton {
    label: string;
    target: string;
    variant?: string;
    style?: string;
    icon_button?: string;
}

export interface HomeSectionData {
    habilitado: boolean;
    titulo: string;
    descripcion: string;
    destacado: {
        url: string;
    };
    imgBackground?: string | null;
    proximaEdicionTitle: string;
    fecha: string;
    subtitulo?: string;
    buttons?: HeroButton[] | null;
}

export interface HomePageProps {
    heroData: HomeSectionData | null;
    globalSEO: GlobalSEO | null;
    logoUrl: string | null;
    configuracion: ConfiguracionData | null;
}

export interface StrapiHeroButton {
    label?: string;
    target?: string;
    variant?: string;
    style?: string;
    icon_button?: string;
}

export interface StrapiHomeSection {
    habilitado: boolean;
    sub_titulo?: string;
    titulo?: string;
    descripcion?: string;
    destacado?: { url?: string };
    ProximaEdicion?: string;
    FechaEvento?: string;
    imageBackground?: { url?: string };
    buttons?: StrapiHeroButton[];
}

export interface StrapiHeroResponse {
    data?: {
        attributes?: {
            HomeSection?: StrapiHomeSection;
        };
        HomeSection?: StrapiHomeSection;
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
    footer?:{
        copy_text?: string;
        social_facebook?: string;
        social_instagram?: string;
        social_twitter?: string;
        social_mail?: string;
    }
    main_navigation:{
        dark_mode: boolean;
        customClass?: string;
        variant: 'default' | 'colored' | 'sticky';
        items?: Array<{
            label: string;
            link: string;
            sub_items?: Array<{
                label: string;
                link: string;
            }>;
        }>;
    }
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
        footer?: ConfiguracionData['footer'];
    };
}

