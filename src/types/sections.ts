// Types for home page sections
import type { CustomSectionData } from './blocks';

// Expert Section Types
export interface RawExpertData {
    attributes?: {
        avatar?: {
            data?: {
                attributes?: {
                    url: string;
                };
            };
        };
        nombre: string;
        subtitulo: string;
        descripcion: string;
        pai?: {
            data?: {
                attributes?: {
                    nombre: string;
                    codigo: string;
                };
            };
        };
    };
}

export interface ExpertData {
    avatar?: {
        url: string;
    };
    nombre: string;
    subtitulo: string;
    descripcion: string;
    pai?: {
        nombre: string;
        codigo: string;
    };
}

export interface ExpertosSectionInterface {
    Seccion?: string;
    Subtitulo?: string;
    Descripcion?: string;
    DisertantesHabilitados?: boolean;
    Miembros?: ExpertData[];
    imageBackground?: {
        url: string;
    };
}

// Pre Talleres Section Types
export interface Taller {
    id: number;
    attributes: {
        title: string;
        featured_image?: {
            url: string;
            formats?: {
                large?: { url: string };
                medium?: { url: string };
                small?: { url: string };
                thumbnail?: { url: string };
            };
        };
        documento?: {
            url: string;
            name?: string;
        };
    };
}

export interface RawTallerData {
    id: number;
    attributes?: {
        title: string;
        featured_image?: {
            url: string;
            formats?: {
                large?: { url: string };
                medium?: { url: string };
                small?: { url: string };
                thumbnail?: { url: string };
            };
        };
        documento?: {
            url: string;
            name?: string;
        };
    };
    title?: string;
    featured_image?: {
        url: string;
        formats?: {
            large?: { url: string };
            medium?: { url: string };
            small?: { url: string };
            thumbnail?: { url: string };
        };
    };
    documento?: {
        url: string;
        name?: string;
    };
}

// Cost Section Types
export interface CostosDataInterface {
    TituloSection?: string;
    CostosSectionHabilitado?: boolean;
    imageBackground?: {
        url: string;
    };
}

// Programa Section Types
export interface HomePageData {
    programa_section: CustomSectionData;
    sede_congreso_section: CustomSectionData;
    tema_libre_section: CustomSectionData;
}

// Partners Section Types
export interface AuspicianteData {
    Nombre: string;
    slug: string;
    logo?: {
        url: string;
    };
}

export interface AuspicianteItem {
    auspiciante: AuspicianteData;
}

export interface AuspiciantesSection {
    Subtitulo: string;
    Auspiciante: AuspicianteItem[];
}

export interface AuspiciantesData {
    habilitado: boolean;
    AuspiciantesSection: AuspiciantesSection[];
}

export interface APIResponse {
    data: {
        Auspiciantes: AuspiciantesData[];
    };
}

export interface Sponsor {
    logo: string;
    alt: string;
}

export type Sections = {
    [key: string]: Sponsor[];
};

// MainNav Types
export interface HomeGeneralInterface {
    logoCongreso?: string;
}

