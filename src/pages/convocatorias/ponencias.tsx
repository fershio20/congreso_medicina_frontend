import ConvocatoriaSinglePage from "@/components/convocatorias/ConvocatoriaSinglePage";
import {
  fetchConfiguracion,
  fetchPonenciaData,
  fetchLogoUrl,
} from "@/lib/api";
import type { ConfiguracionData } from "@/types/home";
import type { PonenciaPageData } from "@/lib/types";
import { GetStaticProps } from "next";

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
    revalidate: 3600, // 1h - on-demand revalidation via Strapi webhook handles updates
  };
};

export default function PonenciasPage({
  ponenciaData,
  logoUrl,
  configuracion,
}: Props) {
  return (
    <ConvocatoriaSinglePage
      pageData={ponenciaData}
      logoUrl={logoUrl}
      configuracion={configuracion}
      pagePath="/convocatorias/ponencias"
      defaultTitle="Ponencias"
      defaultDescription="Conoce las fechas para las ponencias del IX Congreso Iberoamericano de Medicina Familiar."
    />
  );
}
