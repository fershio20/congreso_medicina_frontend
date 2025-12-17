import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/global/PageHeader";

export default function AutoridadesPage() {
    return (
        <>
            <Head>
                <title>Autoridades - Congreso Médico</title>
                <meta name="description" content="Conoce a los miembros del Comité Organizador y la Comisión Directiva de la Sociedad Paraguaya de Pediatría." />
            </Head>
            <div className="bg-white text-gray-800 space-y-12">
                <MainNav />
                <PageHeader 
                    title="Autoridades"
                    description="Conoce a los miembros del Comité Organizador y la Comisión Directiva de la Sociedad Paraguaya de Pediatría."
                />
                <section className="py-[100px] bg-white">
                    <div className="container max-w-[1280px] mx-auto px-4 text-center">
                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Comité Organizador Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                                <div className="mb-6">
                                    <svg className="w-16 h-16 mx-auto text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Comité Organizador</h3>
                                <p className="text-gray-600 mb-6">
                                    Conoce a los miembros del Comité Organizador del Congreso de Pediatría.
                                </p>
                                <div className="text-center">
                                    <Link
                                        href="/autoridades/comite-organizador"
                                    >
                                        <Button variant="principal" size="lg">
                                            Ver Comité Organizador
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Comisión Directiva Card */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                                <div className="mb-6">
                                    <svg className="w-16 h-16 mx-auto text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Comisión Directiva SPP</h3>
                                <p className="text-gray-600 mb-6">
                                    Conoce a los miembros de la Comisión Directiva de la Sociedad Paraguaya de Pediatría.
                                </p>
                                <div className="text-center">
                                    <Link
                                        href="/autoridades/comision-directiva"
                                    >
                                        <Button variant="principal" size="lg">
                                            Ver Comisión Directiva
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer/>
            </div>
        </>
    );
}
