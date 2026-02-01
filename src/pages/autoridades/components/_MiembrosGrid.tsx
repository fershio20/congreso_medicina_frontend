import React from "react";
import { URL_DOMAIN } from "@/lib/globalConstants";

export interface MiembroCard {
    id: number;
    Cargo: string;
    nombre: string;
    NombreCompleto?: string;
    avatar?: { url: string };
}

interface MiembrosGridProps {
    miembros?: MiembroCard[] | null;
    hasAnyAvatarOnPage?: boolean;
    cargoFallback?: string;
}

export default function MiembrosGrid(props: MiembrosGridProps) {
    const { miembros, hasAnyAvatarOnPage = false, cargoFallback = "" } = props ?? {};

    if (miembros == null || !Array.isArray(miembros) || miembros.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center gap-4">
            {miembros.map((miembro, index) => (
                <div
                    key={miembro?.id ?? index}
                    className="bg-white border-b border-[#0F62A5] p-6 text-center w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
                    style={{ borderBottomColor: "rgba(15, 98, 165, 0.41)" }}
                >
                    <div className={hasAnyAvatarOnPage ? "space-y-4" : "space-y-2"}>
                        {hasAnyAvatarOnPage && (
                            <div className="flex justify-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {miembro?.avatar?.url ? (
                                        <img
                                            src={`${URL_DOMAIN}${miembro.avatar.url}`}
                                            alt={miembro?.nombre || miembro?.NombreCompleto || ""}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                const fallback = target.nextElementSibling as HTMLElement;
                                                if (fallback) {
                                                    target.style.display = "none";
                                                    fallback.classList.remove("hidden");
                                                    fallback.classList.add("flex", "items-center", "justify-center");
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                    <div className="hidden w-full h-full bg-gray-300">
                                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <p className="text-2xl font-normal text-[#1e2939]">{miembro?.nombre ?? ""}</p>
                            <p className="text-2xl font-bold text-[#1e2939]">{miembro?.Cargo ?? cargoFallback}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
