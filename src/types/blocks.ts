// Define the RootNode type based on Strapi's structure
export interface RootNode {
    type: 'paragraph' | 'quote' | 'code' | 'heading' | 'list' | 'image';
    children?: unknown[];
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    format?: 'ordered' | 'unordered';
    image?: {
        name: string;
        alternativeText?: string | null;
        url: string;
        caption?: string | null;
        width: number;
        height: number;
        formats?: Record<string, unknown>;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        previewUrl?: string | null;
        provider: string;
        provider_metadata?: unknown | null;
        createdAt: string;
        updatedAt: string;
    };
}

export interface CustomSectionData {
    title: string;
    isAvailable: boolean;
    description: RootNode[];
    image_alignment: 'left' | 'right' | null;
    featured_image: {
        url: string;
        formats?: {
            large?: { url: string };
            medium?: { url: string };
            small?: { url: string };
            thumbnail?: { url: string };
        };
    };
    primary_button: {
        label: string;
        target: string;
        variant: string | null;
        style: string | null;
        icon_button: string | null;
    } | null;
    secondary_button: {
        label: string;
        target: string;
        variant: string;
        style: string;
        icon_button: string;
    } | null;
}
