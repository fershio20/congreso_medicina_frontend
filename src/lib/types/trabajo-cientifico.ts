import type { PageSEO } from "./page-seo";

/**
 * Page header item for Trabajo Científico (array structure from Strapi)
 */
export interface TrabajoCientificoPageHeaderItem {
  id: number;
  title: string;
  description?: string;
}

/**
 * Trabajo Científico page data from CMS
 * Based on schema: content, page_header (array), seo
 */
export interface TrabajoCientificoPageData {
  content?: string;
  page_header?: TrabajoCientificoPageHeaderItem[];
  seo?: PageSEO;
}

/**
 * Strapi response for trabajo-cientifico single type
 */
export interface StrapiTrabajoCientificoResponse {
  data?: TrabajoCientificoPageData & {
    id?: number;
    documentId?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };
}
