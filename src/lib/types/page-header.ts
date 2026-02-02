/**
 * Page header component data from CMS (title, description, featured_image)
 */
export interface PageHeaderData {
  title: string;
  description?: string;
  featured_image?: {
    url: string;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  };
}
