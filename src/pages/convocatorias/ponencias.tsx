import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import PageHeader from "@/components/global/PageHeader";
import SEO from "@/components/SEO";
import {
    fetchConfiguracion,
    fetchPonenciaData,
    fetchLogoUrl,
} from "@/lib/api";
import type {ConfiguracionData} from "@/types/home";
import type {PonenciaPageData} from "@/lib/types";
import {URL_DOMAIN, URL_DOMAIN_IMG} from "@/lib/globalConstants";
import {GetStaticProps} from "next";

interface Props {
    ponenciaData: PonenciaPageData | null;
    logoUrl: string | null;
    configuracion: ConfiguracionData | null;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const [ponenciaData, configuracion, logoUrl] = await Promise.all([
        fetchPonenciaData(),
        fetchConfiguracion(),
        fetchLogoUrl(),
    ]);

    return {
        props: {
            ponenciaData: ponenciaData ?? null,
            logoUrl: logoUrl ?? null,
            configuracion: configuracion ?? null,
        },
        revalidate: 60,
    };
};

function getBackgroundImage(pageHeader?: PonenciaPageData["page_header"]): string {
    if (!pageHeader?.featured_image) return "/bg-default-blue.png";
    const img = pageHeader.featured_image;
    const url = img.formats?.large?.url ?? img.formats?.medium?.url ?? img.url;
    return url ? `${URL_DOMAIN_IMG}${url}` : "/bg-default-blue.png";
}

export default function PonenciasPage({
                                          ponenciaData,
                                          logoUrl,
                                          configuracion,
                                      }: Props) {

    const header = ponenciaData?.page_header;
    const title = header?.title ?? "Ponencias";
    const description = header?.description ?? "Conoce las fechas para las ponencias del IX Congreso Iberoamericano de Medicina Familiar.";
    const backgroundImage = getBackgroundImage(header);
    const pageUrl = `${URL_DOMAIN}/convocatorias/ponencias`;

    return (
        <>
            <SEO
                pageSEO={ponenciaData?.seo}
                pageTitle={title}
                pageDescription={description}
                pageImage={backgroundImage}
                pageUrl={pageUrl}
                pageType="article"
                logoUrl={logoUrl}
            />

            <div className="bg-white text-gray-800 space-y-12">
                <MainNav configuracion={configuracion}/>

                <PageHeader
                    title={title}
                    description={description}
                    customBackgroundImage={backgroundImage}
                    showBlueOverlay={false}
                />

                {ponenciaData?.content && (
                    <section className="py-16 bg-white">
                        <div className="container max-w-[1280px] mx-auto px-4">
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{__html: ponenciaData.content}}
                            />
                        </div>
                    </section>
                )}

                <Footer configuracion={configuracion}/>
            </div>
        </>
    );
}
