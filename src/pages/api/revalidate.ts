import type { NextApiRequest, NextApiResponse } from "next";

/**
 * On-demand revalidation API
 * Refresca las páginas al instante cuando se actualiza el CMS (Strapi).
 *
 * Uso:
 *   POST /api/revalidate?secret=REVALIDATE_SECRET
 *   POST /api/revalidate?secret=REVALIDATE_SECRET&path=/convocatorias/ponencias
 *
 * Webhook Strapi: Admin > Settings > Webhooks
 *   URL: https://tu-dominio.com/api/revalidate?secret=REVALIDATE_SECRET
 *   Events: entry.create, entry.update, entry.delete (Ponencia, Trabajo Científico)
 */
const CONVOCATORIAS_PATHS = [
  "/convocatorias/ponencias",
  "/convocatorias/trabajos-cientificos",
  "/convocatorias/waynakay",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const secret = process.env.REVALIDATE_SECRET;
  const token = req.query.secret ?? req.headers["x-revalidate-token"];

  if (!secret || token !== secret) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const pathParam = req.query.path;
  const pathsToRevalidate = pathParam
    ? (Array.isArray(pathParam) ? pathParam : [pathParam])
    : CONVOCATORIAS_PATHS;

  try {
    for (const path of pathsToRevalidate) {
      await res.revalidate(path);
    }
    return res.json({
      revalidated: true,
      paths: pathsToRevalidate,
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return res.status(500).json({
      message: "Error revalidating",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
