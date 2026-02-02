/**
 * Reusable Page SEO type for CMS pages (Convocatoria, Comisión, etc.)
 * Compatible with SEO component props
 */
export interface PageSEO {
  meta_title: string;
  meta_description: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string };
  og_type?: string;
  twitter_card?: string;
  canonical_url?: string;
  no_index?: boolean;
  structured_data?: Record<string, unknown>;
}
