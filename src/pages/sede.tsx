import MainNav from "@/components/MainNav";
import Footer from "@/components/global/footer";
import React from "react";
import DynamicHotelesSection from "@/components/hoteleria/DynamicHotelesSection";
import Head from "next/head";
import PageHeader from "@/components/global/PageHeader";
import { useTurismoPage } from "@/lib/swr";

interface TurismoPageData {
    id: number;
    show_others_hotels: boolean;
    show_interest_location: boolean;
    header: {
        id: number;
        title: string;
        description: string;
    } | null;
    sede_hotel: {
        id: number;
        title: string;
        isAvailable: boolean | null;
        description: string;
        direccion: string;
        telefono: string;
        map_location: string;
        email: string;
    };
}

export default function SedePage() {
    // Fetch turismo page data using SWR
    const { 
        data: turismoPageResult, 
        error: turismoPageError, 
        isLoading: turismoPageLoading 
    } = useTurismoPage();

    // Extract data from response
    const turismoPageData: TurismoPageData | undefined = turismoPageResult?.data;

    // Default values for when data is loading or not available
    const defaultTitle = "Sede del Congreso";
    const defaultDescription = "Información sobre la sede del congreso, hoteles y alojamiento para el Congreso de Pediatría.";

    return (
        <>
            <Head>
                <title>Sede del Congreso - Congreso Médico</title>
                <meta name="description" content="Información sobre la sede del congreso, hoteles y alojamiento para el Congreso de Pediatría." />
            </Head>
            <div className="bg-white text-gray-800 space-y-12">
                <MainNav />
                
                {turismoPageLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
                    </div>
                ) : turismoPageError ? (
                    <div className="text-center py-20">
                        <p className="text-red-600 text-lg">Error: {turismoPageError.message}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <>
                        <PageHeader 
                            title={turismoPageData?.header?.title || defaultTitle}
                            description={turismoPageData?.header?.description || defaultDescription}
                        />

                        {/* Main Content */}
                        <section className="py-16 bg-white">
                            <div className="container max-w-[1280px] mx-auto px-4">
                                <DynamicHotelesSection />
                                
                                {/* Debug Component - Remove this after fixing the issue */}
                                {/* <div className="mt-12">
                                    <DebugTurismoData />
                                </div> */}
                            </div>
                        </section>
                    </>
                )}
                
                <Footer/>
            </div>
        </>
    );
}
