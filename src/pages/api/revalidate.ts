import type { NextApiRequest, NextApiResponse } from "next";

/**
 * On-demand revalidation API
 * Refresca las páginas al instante cuando se actualiza el CMS (Strapi),
 * en lugar de depender de intervalos cortos de `revalidate` (que consumen
 * muchas ISR Write Units en Vercel).
 *
 * Autenticación (cualquiera de las dos):
 *   - Query:  ?secret=REVALIDATE_SECRET
 *   - Header: x-revalidate-secret: REVALIDATE_SECRET
 *             (también se acepta x-revalidate-token por compatibilidad)
 *
 * Uso desde Strapi (Settings > Webhooks):
 *   URL:     https://tu-dominio.com/api/revalidate
 *   Method:  POST
 *   Headers: x-revalidate-secret: REVALIDATE_SECRET
 *            Content-Type: application/json
 *   Events:  Entry create / update / publish / unpublish
 *
 * Uso manual (emergencias):
 *   POST /api/revalidate?secret=...           body: { "model": "home-page" }
 *   POST /api/revalidate?secret=...           body: { "paths": ["/", "/programa"] }
 *   GET  /api/revalidate?secret=...&path=/programa
 */

// Mapa de modelo de Strapi -> rutas afectadas en el frontend.
// Las claves coinciden con el `model` (o el slug derivado del `uid`) del webhook.
const STRAPI_MODEL_TO_PATHS: Record<string, string[]> = {
  "home-page": [
    "/",
    "/autoridades/comision-directiva",
    "/autoridades/comite-organizador",
    "/talleres",
    "/programa",
  ],
  configuracion: [
    "/",
    "/sede",
    "/expertos",
    "/programa",
    "/talleres",
    "/autoridades/comision-directiva",
    "/autoridades/comite-organizador",
    "/convocatorias/ponencias",
    "/convocatorias/waynakay",
    "/convocatorias/trabajos-cientificos",
    "/costos/costos-nacionales",
    "/costos/costos-internacionales",
  ],
  "seo-setting": [
    "/autoridades/comision-directiva",
    "/autoridades/comite-organizador",
    "/talleres",
    "/programa",
  ],
  ponencia: ["/convocatorias/ponencias"],
  waynakay: ["/convocatorias/waynakay"],
  "trabajo-cientifico": ["/convocatorias/trabajos-cientificos"],
  "costos-nacionales": ["/costos/costos-nacionales"],
  "costos-internacionales": ["/costos/costos-internacionales"],
  // El endpoint de disertantes es /api/Disertantes; el webhook puede mandar
  // "disertante", "Disertante" o "disertantes". Cubrimos las variantes.
  Disertantes: ["/expertos"],
  disertante: ["/expertos"],
  disertantes: ["/expertos"],
  "talleres-page": ["/talleres"],
  taller: ["/talleres"],
  "pagina-de-programa": ["/programa"],
  "comision-page": ["/autoridades/comite-organizador"],
  "consejo-directivo-page": ["/autoridades/comision-directiva"],
  // Sede / turismo: la página /sede ahora consume estos datos en getStaticProps.
  "turismo-page": ["/sede"],
  turismo: ["/sede"],
  turismos: ["/sede"],
};

/**
 * Deriva el nombre del modelo desde el `uid` de Strapi.
 * Ej: "api::home-page.home-page" -> "home-page"
 */
function modelFromUid(uid?: unknown): string | undefined {
  if (typeof uid !== "string") return undefined;
  const parts = uid.split(".");
  return parts[parts.length - 1] || undefined;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Missing REVALIDATE_SECRET" });
  }

  const token =
    req.query.secret ??
    req.headers["x-revalidate-secret"] ??
    req.headers["x-revalidate-token"];

  if (token !== secret) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // 1) Rutas manuales explícitas: query ?path= o body.paths
  const queryPath = req.query.path;
  const bodyPaths = (req.body?.paths as unknown) as string[] | undefined;

  // 2) Modelo de Strapi: body.model o derivado de body.uid
  const model =
    (req.body?.model as string | undefined) ?? modelFromUid(req.body?.uid);

  let pathsToRevalidate: string[] = [];

  if (queryPath) {
    pathsToRevalidate = Array.isArray(queryPath) ? queryPath : [queryPath];
  } else if (Array.isArray(bodyPaths) && bodyPaths.length) {
    pathsToRevalidate = bodyPaths;
  } else if (model && STRAPI_MODEL_TO_PATHS[model]) {
    pathsToRevalidate = STRAPI_MODEL_TO_PATHS[model];
  }

  // Solo rutas absolutas válidas
  pathsToRevalidate = pathsToRevalidate.filter(
    (p) => typeof p === "string" && p.startsWith("/")
  );

  if (!pathsToRevalidate.length) {
    return res.status(400).json({
      message: "Unknown model or no valid paths provided",
      model: model ?? null,
    });
  }

  // Promise.allSettled: una ruta que falle no bloquea las demás
  const results = await Promise.allSettled(
    pathsToRevalidate.map((p) => res.revalidate(p))
  );

  const revalidated: string[] = [];
  const failed: { path: string; error: string }[] = [];

  results.forEach((result, i) => {
    const path = pathsToRevalidate[i];
    if (result.status === "fulfilled") {
      revalidated.push(path);
    } else {
      failed.push({
        path,
        error:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
    }
  });

  if (failed.length) {
    console.error("Revalidation errors:", failed);
  }

  return res.status(failed.length && !revalidated.length ? 500 : 200).json({
    revalidated: revalidated.length > 0,
    model: model ?? null,
    paths: revalidated,
    failed,
  });
}
