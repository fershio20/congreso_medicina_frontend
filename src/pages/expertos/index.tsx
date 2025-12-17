import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import React, {useEffect, useState} from "react";
import Head from "next/head";
import ExpertCard from "@/components/ExpertCard";
import {URL_DOMAIN} from "@/lib/globalConstants";
import PageHeader from "@/components/global/PageHeader";

interface Expert {
    id: number;
    avatar: {url: string};
    nombre: string;
    subtitulo: string;
    descripcion: string;
    pai: {nombre: string; codigo: string};
}

interface RawExpertData {
    id: number;
    attributes?: {
        avatar?: {
            data?: {
                attributes?: {
                    url?: string;
                };
            };
        };
        nombre?: string;
        subtitulo?: string;
        descripcion?: string;
        pai?: {
            data?: {
                attributes?: {
                    nombre?: string;
                    codigo?: string;
                };
            };
        };
    };
    avatar?: {
        url?: string;
    };
    nombre?: string;
    subtitulo?: string;
    descripcion?: string;
    pai?: {
        nombre?: string;
        codigo?: string;
    };
}

export default function ExpertosPage() {
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        // Use the exact same API endpoint as ExpertSection with increased page size to get all experts
        const URL_DISERTANTES_LIST = `${URL_DOMAIN}/api/Disertantes?populate[avatar][populate]=*&populate[pai][populate]=*&pagination[pageSize]=100`;
        
        fetch(URL_DISERTANTES_LIST, {
            signal: controller.signal
        })
            .then(res => {
                clearTimeout(timeoutId);
                if (!res.ok) {
                    throw new Error(`Failed to fetch experts: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(json => {
                const result = json.data;
                if (result) {
                    // Handle both possible Strapi data structures
                    const expertsData = result.map((expert: RawExpertData) => {
                        // Check if data is wrapped in attributes
                        if (expert.attributes) {
                            return {
                                id: expert.id,
                                avatar: expert.attributes.avatar?.data?.attributes,
                                nombre: expert.attributes.nombre || 'Nombre no disponible',
                                subtitulo: expert.attributes.subtitulo || 'Especialidad no disponible',
                                descripcion: expert.attributes.descripcion || 'Descripción no disponible',
                                pai: expert.attributes.pai?.data?.attributes
                            };
                        }
                        // If no attributes wrapper, use the data directly
                        return {
                            id: expert.id,
                            avatar: expert.avatar,
                            nombre: expert.nombre || 'Nombre no disponible',
                            subtitulo: expert.subtitulo || 'Especialidad no disponible',
                            descripcion: expert.descripcion || 'Descripción no disponible',
                            pai: expert.pai
                        };
                    });
                    setExperts(expertsData);
                }
                setLoading(false);
            })
            .catch(err => {
                clearTimeout(timeoutId);
                if (err.name === 'AbortError') {
                    console.error('Experts request timeout:', err);
                    setError('Request timeout - please try again');
                } else {
                    console.error('Error loading experts:', err);
                    setError(err instanceof Error ? err.message : 'An error occurred');
                }
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Head>
                <title>Expertos - Congreso Médico</title>
                <meta name="description" content="Conoce a todos los expertos y disertantes que participarán en el Congreso Paraguayo de Pediatría." />
            </Head>
            <div className="bg-white text-gray-800 space-y-12">
                <MainNav />
                
                <PageHeader 
                    title="Expertos y Disertantes"
                    description="Conoce a todos los expertos nacionales e internacionales que participarán en el XIX Congreso Paraguayo de Pediatría."
                />

                {/* Experts Grid Section */}
                <section className="py-[100px] bg-white">
                    <div className="container max-w-[1280px] mx-auto px-4">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                                <p className="mt-4 text-gray-600">Cargando expertos...</p>
                            </div>
                        ) : experts.length > 0 ? (
                            <>
                                {/* Experts Grid - 4 per row */}
                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                                    {experts.map((expert, index) => (
                                        <div key={expert.id || index} className="w-full">
                                            
                                            <ExpertCard
                                                name={expert.nombre}
                                                specialty={expert.subtitulo}
                                                description={expert.descripcion}
                                                imageSrc={(expert.avatar?.url) ? (URL_DOMAIN + expert.avatar?.url) : '/bg-default.png'}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Summary */}
                                <div className="text-center mt-16">
                                    <p className="text-lg text-gray-600">
                                        Total de expertos: <span className="font-bold ">{experts.length}</span>
                                    </p>
                                </div>
                            </>
                        ) : error ? (
                            <div className="text-center py-20">
                                <div className="text-red-500 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Error al cargar expertos</h3>
                                <p className="text-gray-500 mb-4">{error}</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="bg-[#0F62A5] text-white px-6 py-3 rounded-lg hover:bg-[#0F62A5]/90 transition-colors duration-200"
                                >
                                    Intentar de nuevo
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="text-gray-500 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay expertos disponibles</h3>
                                <p className="text-gray-500">Por favor, inténtalo más tarde.</p>
                            </div>
                        )}
                    </div>
                </section>

                <Footer/>
            </div>
        </>
    );
}
