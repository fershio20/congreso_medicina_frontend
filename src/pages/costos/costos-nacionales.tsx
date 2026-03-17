import ConvocatoriaSinglePage from "@/components/convocatorias/ConvocatoriaSinglePage";
import {
  fetchConfiguracion,
  fetchCostosNacionalesData,
  fetchLogoUrl,
} from "@/lib/api";
import type { ConfiguracionData } from "@/types/home";
import type { PonenciaPageData } from "@/lib/types";
import { GetStaticProps } from "next";

interface Props {
  costosNacionalesData: PonenciaPageData | null;
  logoUrl: string | null;
  configuracion: ConfiguracionData | null;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [costosNacionalesData, configuracion, logoUrl] = await Promise.all([
    fetchCostosNacionalesData(),
    fetchConfiguracion(),
    fetchLogoUrl(),
  ]);

  return {
    props: {
      costosNacionalesData: costosNacionalesData ?? null,
      logoUrl: logoUrl ?? null,
      configuracion: configuracion ?? null,
    },
    revalidate: 60,
  };
};

export default function CostosNacionalesPage({
  costosNacionalesData,
  logoUrl,
  configuracion,
}: Props) {
  return (
    <ConvocatoriaSinglePage
      pageData={costosNacionalesData}
      logoUrl={logoUrl}
      configuracion={configuracion}
      pagePath="/costos/costos-nacionales"
      defaultTitle="Costos nacionales"
      defaultDescription="Conoce los costos nacionales del IX Congreso Iberoamericano de Medicina Familiar."
    />
  );
}
