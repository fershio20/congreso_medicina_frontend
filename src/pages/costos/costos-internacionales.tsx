import ConvocatoriaSinglePage from "@/components/convocatorias/ConvocatoriaSinglePage";
import {
  fetchConfiguracion,
  fetchCostosInternacionalesData,
  fetchLogoUrl,
} from "@/lib/api";
import type { ConfiguracionData } from "@/types/home";
import type { PonenciaPageData } from "@/lib/types";
import { GetStaticProps } from "next";

interface Props {
  costosInternacionalesData: PonenciaPageData | null;
  logoUrl: string | null;
  configuracion: ConfiguracionData | null;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [costosInternacionalesData, configuracion, logoUrl] = await Promise.all([
    fetchCostosInternacionalesData(),
    fetchConfiguracion(),
    fetchLogoUrl(),
  ]);

  return {
    props: {
      costosInternacionalesData: costosInternacionalesData ?? null,
      logoUrl: logoUrl ?? null,
      configuracion: configuracion ?? null,
    },
    revalidate: 60,
  };
};

export default function CostosInternacionalesPage({
  costosInternacionalesData,
  logoUrl,
  configuracion,
}: Props) {
  return (
    <ConvocatoriaSinglePage
      pageData={costosInternacionalesData}
      logoUrl={logoUrl}
      configuracion={configuracion}
      pagePath="/costos/costos-internacionales"
      defaultTitle="Costos internacionales"
      defaultDescription="Conoce los costos internacionales del IX Congreso Iberoamericano de Medicina Familiar."
    />
  );
}
