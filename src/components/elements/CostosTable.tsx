'use client'

import { useEffect, useState } from 'react';
import {URL_DOMAIN} from "@/lib/globalConstants";

type CostosTableProps = {
    endpoint?: string; // puedes sobreescribir el endpoint para test
};

type Categoria = {
    nombre: string;
    tipo?: string;
    moneda?: string;
    monto: Record<string, number | null>;
    nota?: string;
};

type CostosData = {
    valores: Record<string, string>; // Ej: { "early": "Hasta el 7 de Julio", "late": "Desde el 08 de Julio" }
    categorias: Categoria[];
};

export default function CostosTable({ endpoint =  `${URL_DOMAIN}/api/home-page?populate[CostosSection][populate]=*` }: CostosTableProps) {
    const [costos, setCostos] = useState<CostosData | null>(null);

    useEffect(() => {
        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                const table = data?.data?.CostosSection?.table;
                if (table?.valores && table?.categorias) {
                    setCostos(table);
                }
            })
            .catch(err => console.error("Error fetching CostosTable:", err));
    }, [endpoint]);

    if (!costos) return null;

    const columnas = Object.keys(costos.valores);

    return (
        <div className="w-full max-w-4xl">
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-lg">
                    <thead>
                    <tr className="bg-cyan-600 text-white">
                        <th className="p-4 text-left">Categorías</th>
                        {columnas.map((key) => (
                            <th key={key} className="p-4 text-left">{costos.valores[key]}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className='text-left'>
                    {costos.categorias.map((cat, idx) => (
                        <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="p-4 font-semibold">{cat.nombre}</td>
                            {columnas.map((key) => (
                                <td key={key} className="p-4">
                                    {cat.monto?.[key] != null
                                        ? `${cat.moneda ?? ''} ${cat.monto[key]?.toLocaleString('es-PY')}`
                                        : '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                {/* Nota al pie si hay */}
                {costos.categorias.some(cat => cat.nota) && (
                    <div className="text-sm mt-4 text-white italic text-center">
                        * {costos.categorias.find(cat => cat.nota)?.nota}
                    </div>
                )}
            </div>
        </div>
    );
}
