import ConvocatoriaSinglePage from "@/components/convocatorias/ConvocatoriaSinglePage";
import {
  fetchConfiguracion,
  fetchWaynakayData,
  fetchLogoUrl,
} from "@/lib/api";
import type { ConfiguracionData } from "@/types/home";
import type { PonenciaPageData } from "@/lib/types";
import { GetStaticProps } from "next";

interface Props {
  waynakayData: PonenciaPageData | null;
  logoUrl: string | null;
  configuracion: ConfiguracionData | null;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [waynakayData, configuracion, logoUrl] = await Promise.all([
    fetchWaynakayData(),
    fetchConfiguracion(),
    fetchLogoUrl(),
  ]);

  return {
    props: {
      waynakayData: waynakayData ?? null,
      logoUrl: logoUrl ?? null,
      configuracion: configuracion ?? null,
    },
    revalidate: 60,
  };
};

export default function WaynakayPage({
  waynakayData,
  logoUrl,
  configuracion,
}: Props) {
  return (
    <ConvocatoriaSinglePage
      pageData={waynakayData}
      logoUrl={logoUrl}
      configuracion={configuracion}
      pagePath="/convocatorias/waynakay"
      defaultTitle="Waynakay"
      defaultDescription="Conoce las fechas y condiciones de la convocatoria Waynakay del IX Congreso Iberoamericano de Medicina Familiar."
    />
  );
}
