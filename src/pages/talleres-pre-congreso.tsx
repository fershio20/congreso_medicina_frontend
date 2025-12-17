import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import React, { useState } from "react";
import Head from "next/head";
import { GetStaticProps } from "next";
import PageHeader from "@/components/global/PageHeader";

interface TallerImage {
    id: number;
    titulo: string;
    descripcion?: string;
    imagen: {
        url: string;
        alt?: string;
    };
    fecha?: string;
    costo?: string;
}

interface TalleresPageProps {
    talleres: TallerImage[];
}

// Modal component for full-size image viewing
interface ImageModalProps {
    isOpen: boolean;
    imageUrl: string;
    imageAlt: string;
    onClose: () => void;
}

function ImageModal({ isOpen, imageUrl, imageAlt, onClose }: ImageModalProps) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div className="relative max-w-7xl max-h-full">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all duration-200 z-10"
                    aria-label="Cerrar imagen"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}

export const getStaticProps: GetStaticProps<TalleresPageProps> = async () => {
    // Sample data for testing - will be replaced with API call later
    const mockTalleres: TallerImage[] = [
        {
            id: 1,
            titulo: "Taller Pre-congreso - Vacunación a lo Largo de la Vida",
            descripcion: "Coordinadora: Dra. Ana García. Disertantes nacionales y extranjeros",
            imagen: {
                url: "/talleres/taller-vacunacion-1.jpg",
                alt: "Taller de Vacunación a lo Largo de la Vida"
            },
            fecha: "05 de Mayo 2025",
            costo: "Acceso Gratuito"
        },
        {
            id: 2,
            titulo: "Jornada Pre-congreso - Pediatría Ambulatoria",
            descripcion: "Claves, retos y herramientas prácticas",
            imagen: {
                url: "/talleres/jornada-pediatria-ambulatoria.jpg", 
                alt: "Jornada de Pediatría Ambulatoria"
            },
            fecha: "05 de Mayo 2025",
            costo: "Acceso Gratuito"
        },
        {
            id: 3,
            titulo: "Taller Pre-congreso - Simulación Clínica",
            descripcion: "En urgencias vitales y seguridad del paciente",
            imagen: {
                url: "/talleres/taller-simulacion-clinica.jpg",
                alt: "Taller de Simulación Clínica"
            },
            fecha: "05 de Mayo 2025",
            costo: "Cupos limitados - Costo: Gs. 200.000"
        },
        {
            id: 4,
            titulo: "Taller Pre-congreso - Transporte Crítico",
            descripcion: "Estabilización al traslado seguro",
            imagen: {
                url: "/talleres/taller-transporte-critico.jpg",
                alt: "Taller de Transporte Crítico"
            },
            fecha: "05 de Mayo 2025",
            costo: "Cupos limitados - Costo: Gs. 200.000"
        },
        {
            id: 5,
            titulo: "Taller Pre-congreso - Salud Ambiental",
            descripcion: "Impacto en la salud pediátrica",
            imagen: {
                url: "/talleres/taller-salud-ambiental.jpg",
                alt: "Taller de Salud Ambiental"
            },
            fecha: "05 de Mayo 2025",
            costo: "Acceso Gratuito"
        },
        {
            id: 6,
            titulo: "Taller Pre-congreso - Vacunación Repetido",
            descripcion: "Segunda sesión de vacunación",
            imagen: {
                url: "/talleres/taller-vacunacion-2.jpg",
                alt: "Taller de Vacunación - Segunda Sesión"
            },
            fecha: "05 de Mayo 2025",
            costo: "Acceso Gratuito"
        }
    ];

    return {
        props: { talleres: mockTalleres },
        revalidate: 60 * 10, // 10 minutes
    };
};

export default function TalleresPreCongresoPage({ talleres }: TalleresPageProps) {
    const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

    const openImageModal = (imageUrl: string, imageAlt: string) => {
        setSelectedImage({ url: imageUrl, alt: imageAlt });
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <Head>
                <title>Talleres Pre-congreso - Congreso Médico</title>
                <meta name="description" content="Descubre los talleres y jornadas pre-congreso del Congreso Paraguayo de Pediatría. Información sobre fechas, costos y contenidos." />
            </Head>
            <div className="bg-white text-gray-800 space-y-12">
                <MainNav />
                
                <PageHeader 
                    title="Talleres Pre-congreso"
                    description="Descubre los talleres y jornadas pre-congreso disponibles. Haz clic en cualquier imagen para verla en tamaño completo."
                />

                {/* Talleres Gallery Section */}
                <section className="py-[100px] bg-white">
                    <div className="container max-w-[1280px] mx-auto px-4">
                        {talleres.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {talleres.map((taller) => (
                                    <div key={taller.id} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <div 
                                            className="cursor-pointer relative group"
                                            onClick={() => openImageModal(taller.imagen.url, taller.imagen.alt || taller.titulo)}
                                        >
                                            <img
                                                src={taller.imagen.url}
                                                alt={taller.imagen.alt || taller.titulo}
                                                className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-6">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{taller.titulo}</h3>
                                            {taller.descripcion && (
                                                <p className="text-gray-600 mb-3 text-sm sm:text-base">{taller.descripcion}</p>
                                            )}
                                            <div className="space-y-2">
                                                {taller.fecha && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {taller.fecha}
                                                    </div>
                                                )}
                                                {taller.costo && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                        </svg>
                                                        {taller.costo}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">
                                <p>Cargando información de talleres...</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Image Modal */}
                <ImageModal
                    isOpen={selectedImage !== null}
                    imageUrl={selectedImage?.url || ""}
                    imageAlt={selectedImage?.alt || ""}
                    onClose={closeImageModal}
                />

                <Footer/>
            </div>
        </>
    );
}
