import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import PageHeader from "@/components/global/PageHeader";
import SEO from "@/components/SEO";
import type { ConfiguracionData } from "@/types/home";
import type { PonenciaPageData } from "@/lib/types";
import { URL_DOMAIN, URL_DOMAIN_IMG } from "@/lib/globalConstants";

export interface ConvocatoriaSinglePageProps {
  pageData: PonenciaPageData | null;
  logoUrl: string | null;
  configuracion: ConfiguracionData | null;
  /** Ruta de la página (ej: /convocatorias/ponencias, /convocatorias/waynakay) */
  pagePath: string;
  /** Título por defecto si no viene del CMS */
  defaultTitle: string;
  /** Descripción por defecto si no viene del CMS */
  defaultDescription: string;
}

function getBackgroundImage(pageHeader?: PonenciaPageData["page_header"]): string {
  if (!pageHeader?.featured_image) return "/bg-default-blue.png";
  const img = pageHeader.featured_image;
  const url = img.formats?.large?.url ?? img.formats?.medium?.url ?? img.url;
  return url ? `${URL_DOMAIN_IMG}${url}` : "/bg-default-blue.png";
}

/**
 * Layout compartido para páginas de convocatoria con single type en Strapi
 * (Ponencia, Waynakay, etc.) - Mismo diseño y flujo, diferente endpoint/contenido.
 */
export default function ConvocatoriaSinglePage({
  pageData,
  logoUrl,
  configuracion,
  pagePath,
  defaultTitle,
  defaultDescription,
}: ConvocatoriaSinglePageProps) {
  const header = pageData?.page_header;
  const title = header?.title ?? defaultTitle;
  const description = header?.description ?? defaultDescription;
  const backgroundImage = getBackgroundImage(header);
  const pageUrl = `${URL_DOMAIN}${pagePath}`;

  return (
    <>
      <SEO
        pageSEO={pageData?.seo}
        pageTitle={title}
        pageDescription={description}
        pageImage={backgroundImage}
        pageUrl={pageUrl}
        pageType="article"
        logoUrl={logoUrl}
      />

      <div className="bg-white text-gray-800 space-y-12">
        <MainNav configuracion={configuracion} />

        <PageHeader
          title={title}
          description={description}
          customBackgroundImage={backgroundImage}
          showBlueOverlay={false}
        />

        {pageData?.content && (
          <section className="py-16 bg-white">
            <div className="container max-w-[1280px] mx-auto px-4">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
            </div>
          </section>
        )}

        <Footer configuracion={configuracion} />
      </div>
    </>
  );
}
