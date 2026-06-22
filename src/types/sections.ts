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
export interface CostosTableData {
    valores: Record<string, string>;
    categorias: Array<{
        nombre: string;
        tipo?: string;
        moneda?: string;
        monto: Record<string, number | null>;
        nota?: string;
    }>;
}

export interface CostosDataInterface {
    costos: string | TrustedHTML;
    TituloSection?: string;
    CostosSectionHabilitado?: boolean;
    imageBackground?: {
        url: string;
    };
    table?: CostosTableData;
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

// ===== Server-side home section responses (SSG via getStaticProps) =====
// Each field mirrors the exact shape returned by the matching Strapi query,
// so home components can read from props instead of fetching on the client.

export interface IntroSectionResponse {
    data?: {
        IntroSectionHome?: {
            layout: 'centrado' | 'imagen_derecha' | 'imagen_izquierda';
            description: string;
            Titulo?: string;
            DescripcionBody?: string;
            ImagenDestacada?: { url?: string; mime?: string; mimeType?: string };
            VideoDestacado?: { url?: string };
        };
    };
}

export interface DisertantesSectionResponse {
    data?: {
        DisertantesSection?: ExpertosSectionInterface;
    };
}

export interface DisertantesListResponse {
    data?: RawExpertData[];
}

export interface CostosSectionResponse {
    data?: {
        CostosSection?: CostosDataInterface;
    };
}

export interface HomeSectionResponse {
    data?: HomePageData;
}

export interface ThematicSectionData {
    EjesTematicosTitulo?: string;
    EjesTematicosHabilitados?: boolean;
    EjesTematicosSection?: Array<{
        id: number;
        SubTitulo: string;
        EjesTematicos: Array<{
            color?: string;
            id: number;
            Titulo: string;
            descripcion: string;
            Descripcion?: string | null;
            ImagenDestacada?: { url: string };
        }>;
    }>;
}

export interface ThematicSectionResponse {
    data?: ThematicSectionData;
}

// ===== Turismo / Sede (SSG) =====
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
        featured_image?: {
            url: string;
        };
    };
}

export interface TurismoItem {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    is_available: boolean;
    type: 'hotel' | 'punto_de_interes';
    description: string;
    telephone: string;
    email: string;
    distance: string;
    map_url_location: string;
    featured_image?: {
        url: string;
        formats?: {
            small?: { url: string };
            thumbnail?: { url: string };
        };
    };
}

export interface TurismoPageResponse {
    data?: TurismoPageData;
}

export interface TurismosResponse {
    data?: TurismoItem[];
}

export interface HomeSectionsData {
    intro: IntroSectionResponse | null;
    disertantesSection: DisertantesSectionResponse | null;
    disertantesList: DisertantesListResponse | null;
    costos: CostosSectionResponse | null;
    programa: HomeSectionResponse | null;
    sede: HomeSectionResponse | null;
    temasLibres: HomeSectionResponse | null;
    partners: APIResponse | null;
    ejes: ThematicSectionResponse | null;
}

