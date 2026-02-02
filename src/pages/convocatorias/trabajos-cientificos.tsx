import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import PageHeader from "@/components/global/PageHeader";
import SEO from "@/components/SEO";
import {
    fetchConfiguracion,
    fetchTrabajoCientificoData,
    fetchLogoUrl,
} from "@/lib/api";
import type { ConfiguracionData } from "@/types/home";
import type { TrabajoCientificoPageData } from "@/lib/types";
import { URL_DOMAIN } from "@/lib/globalConstants";
import { GetStaticProps } from "next";

interface Props {
    trabajoCientificoData: TrabajoCientificoPageData | null;
    logoUrl: string | null;
    configuracion: ConfiguracionData | null;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const [trabajoCientificoData, configuracion, logoUrl] = await Promise.all([
        fetchTrabajoCientificoData(),
        fetchConfiguracion(),
        fetchLogoUrl(),
    ]);

    return {
        props: {
            trabajoCientificoData: trabajoCientificoData ?? null,
            logoUrl: logoUrl ?? null,
            configuracion: configuracion ?? null,
        },
        revalidate: 60,
    };
};

export default function TrabajosCientificosPage({
    trabajoCientificoData,
    logoUrl,
    configuracion,
}: Props) {
    const header = trabajoCientificoData?.page_header?.[0];
    const title = header?.title ?? "Trabajos Científicos";
    const description =
        header?.description ??
        "Conoce las bases y fechas para la presentación de trabajos científicos del IX Congreso Iberoamericano de Medicina Familiar.";
    const backgroundImage = "/bg-default-blue.png";
    const pageUrl = `${URL_DOMAIN}/convocatorias/trabajos-cientificos`;

    return (
        <>
            <SEO
                pageSEO={trabajoCientificoData?.seo}
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

                {trabajoCientificoData?.content && (
                    <section className="py-16 bg-white">
                        <div className="container max-w-[1280px] mx-auto px-4">
                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: trabajoCientificoData.content,
                                }}
                            />
                        </div>
                    </section>
                )}

                <Footer configuracion={configuracion} />
            </div>
        </>
    );
}
