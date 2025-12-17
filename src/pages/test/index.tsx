import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import React from "react";
import { URL_DOMAIN } from "@/lib/globalConstants";

/* ===== Tipos mínimos para lo que mostramos en la UI ===== */
type Miembro = {
  id: number;
  nombre?: string;
  Cargo?: string | null;
};

type Comite = {
  id: number;
  Seccion: string;
  Miembros: Miembro[];
};

type Props = {
  comite: Comite[];
};

/* ===== Helpers ===== */
const ENDPOINT_PATH =
  "/api/home-page?populate[ComiteOrganizadorSection][populate][Miembros][populate]=*";

/**
 * Normaliza Strapi v4/v5:
 * - a veces los datos vienen en data.attributes
 * - otras veces directamente en data
 */
interface StrapiResponse {
  data?: {
    attributes?: {
      ComiteOrganizadorSection?: Comite[];
    };
    ComiteOrganizadorSection?: Comite[];
  };
}

function extractComiteFromStrapi(json: StrapiResponse): Comite[] {
  const root = json?.data?.attributes ?? json?.data ?? {};
  return root?.ComiteOrganizadorSection ?? [];
}

/* =========================================================
   SSG + ISR
   - Genera HTML estático en build
   - Revalida en background cada X segundos
   ========================================================= */
export const getStaticProps: GetStaticProps<Props> = async () => {
  const ENDPOINT = `${URL_DOMAIN}${ENDPOINT_PATH}`;

  try {
    const res = await fetch(ENDPOINT, {
      headers: { Accept: "application/json" },
      // Importante en Next 13+ si el hosting soporta cacheo nativo:
      // cache: "no-store"   // <- Úsalo SOLO si no quieres cache en edge
      // next: { revalidate: 600 } // <- No mezclar con getStaticProps
    });

    if (!res.ok) {
      console.error("Fetch failed:", res.status, ENDPOINT);
      return {
        props: { comite: [] },
        revalidate: 60 * 10, // revalida igual para reintentar más tarde
      };
    }

    const json = await res.json();
    const comite = extractComiteFromStrapi(json);

    return {
      props: { comite },
      // ⏱ Revalidación en background cada 10 minutos
      revalidate: 60 * 10,
    };
  } catch (err) {
    console.error("Error fetching comité:", err);
    return {
      props: { comite: [] },
      revalidate: 60 * 10,
    };
  }
};

/* ==========================
   UI: simple y clara
   ========================== */
export default function Test({
  comite,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Test – Comité (SSG + ISR)</title>
        <meta name="description" content="Listado del comité desde Strapi usando SSG + ISR." />
      </Head>

      <main className="max-w-[1100px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Comité (SSG + ISR)</h1>

        {comite.length === 0 ? (
          <div className="rounded-lg border border-slate-200 p-6 bg-slate-50">
            <p className="text-slate-600">
              No hay datos por ahora. Verifica el endpoint o revisa permisos públicos en Strapi.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Esta página se revalidará automáticamente en segundo plano según el intervalo
              configurado (ISR).
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {comite.map((sec) => (
              <section key={sec.id} className="rounded-lg border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">{sec.Seccion}</h2>

                {sec.Miembros?.length ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sec.Miembros.map((m) => (
                      <li
                        key={m.id}
                        className="rounded-md border border-slate-200 p-4 bg-white shadow-sm"
                      >
                        <p className="font-medium text-slate-900">
                          {m.nombre || "Sin nombre"}
                        </p>
                        {m.Cargo ? (
                          <p className="text-sm text-slate-600">{m.Cargo}</p>
                        ) : (
                          <p className="text-sm text-slate-400">—</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">Sin miembros registrados.</p>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
