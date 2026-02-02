import type { PageHeaderData } from "./page-header";
import type { PageSEO } from "./page-seo";

/**
 * Convocatoria - Ponencia page data from CMS
 * Based on schema: page_header, content, seo
 */
export interface PonenciaPageData {
  page_header?: PageHeaderData;
  content?: string;
  seo?: PageSEO;
}

/**
 * Strapi response wrapper for Ponencia single type
 */
export interface StrapiPonenciaResponse {
  data?: {
    attributes?: PonenciaPageData;
    id?: number;
  };
}
