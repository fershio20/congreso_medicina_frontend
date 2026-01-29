'use client'

import React from "react";
import HotelCard from "./HotelCard";
import FeaturedHotel from "./FeaturedHotel";
import { useTurismoPage, useTurismos } from "@/lib/swr";
import {URL_DOMAIN, URL_DOMAIN_IMG} from "@/lib/globalConstants";

interface TurismoPageData {
    id: number;
    show_others_hotels: boolean;
    show_interest_location: boolean;
    header: {
        id: number;
        title: string;
        description: string;
    };
    sede_hotel: {
        id: number;
        title: string;
        isAvailable: boolean | null;
        description: string;
        direccion: string;
        telefono: string;
        map_location: string;
        email: string;
        featured_image?:{
            url: string;
        }
    };
}

interface TurismoItem {
    id: number;
    documentId: string;
    title: string;
    slug: string;
    is_available: boolean;
    type: 'hotel' | 'punto_de_interes';
    description: string;
    telephone: string;
    email: string;
    distance: string;
    map_url_location: string;
    featured_image?: {
        url: string;
        formats?: {
            small?: { url: string };
            thumbnail?: { url: string };
        };
    };
}

const DynamicHotelesSection: React.FC = () => {
    // Fetch turismo page data using SWR
    const { 
        data: turismoPageResult, 
        error: turismoPageError, 
        isLoading: turismoPageLoading 
    } = useTurismoPage();

    // Fetch turismo items using SWR
    const { 
        data: turismoResult, 
        error: turismoError, 
        isLoading: turismoLoading 
    } = useTurismos();

    // Extract data from responses
    const turismoPageData: TurismoPageData | undefined = turismoPageResult?.data;
    const turismoItems: TurismoItem[] = turismoResult?.data || [];

    // Loading state
    if (turismoPageLoading || turismoLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    console.log('Turismo Page Data:', turismoPageData);

    // Error handling
    if (turismoPageError || turismoError) {
        const errorMessage = turismoPageError?.message || turismoError?.message || 'An error occurred';
        return (
            <div className="text-center py-20">
                <p className="text-red-600 text-lg">Error: {errorMessage}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    // No data check
    if (!turismoPageData) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No se encontraron datos</p>
            </div>
        );
    }

    // Filter items by type with proper null checks and fallback handling
    let hotels: TurismoItem[] = [];
    let touristAttractions: TurismoItem[] = [];
    
    try {
        hotels = turismoItems.filter((item: TurismoItem) => {
            if (!item || !item.type) {
                return false;
            }
            // Only show hotels that are available
            return item.type === 'hotel' && item.is_available === true;
        });
        
        touristAttractions = turismoItems.filter((item: TurismoItem) => {
            if (!item || !item.type) {
                return false;
            }
            // Only show tourist attractions that are available
            return item.type === 'punto_de_interes' && item.is_available === true;
        });
    } catch (error) {
        console.error('Error filtering turismo items:', error);
        // Fallback to empty arrays if filtering fails
        hotels = [];
        touristAttractions = [];
    }



    // Safety check for sede_hotel data
    if (!turismoPageData.sede_hotel) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-600 text-lg">Datos de la sede del hotel no disponibles</p>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                    <p className="text-sm text-gray-600">Datos recibidos:</p>
                    <pre className="text-xs mt-2 overflow-auto">
                        {JSON.stringify(turismoPageData, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }

    // Show a message if no items are found
    if (turismoItems.length === 0) {
        // No items found
    }

    return (
        <div className="space-y-24">
            {/* La Sede - Featured Hotel */}
            <section>
                <h2 className="text-4xl font-bold text-blue-900 mb-8">La Sede!</h2>
                <FeaturedHotel 
                    name={turismoPageData.sede_hotel.title}
                    description={turismoPageData.sede_hotel.description}
                    address={turismoPageData.sede_hotel.direccion}
                    phone={turismoPageData.sede_hotel.telefono}
                    imageSrc={turismoPageData.sede_hotel.featured_image?.url ? `${URL_DOMAIN_IMG}${turismoPageData.sede_hotel.featured_image.url}` : "/congreso/bourbone-hotel.jpg"}
                    mapLocation={turismoPageData.sede_hotel.map_location}
                    email={turismoPageData.sede_hotel.email}
                />
            </section>

            {/* Otros Hoteles - Conditionally rendered */}
            {turismoPageData.show_others_hotels && hotels.length > 0 && (
                <section className="py-20">
                    <h2 className="text-4xl font-bold text-blue-900 my-10">Otros Hoteles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {hotels.map((hotel) => (
                            <HotelCard
                                key={hotel.id}
                                name={hotel.title}
                                phone={hotel.telephone}
                                distance={hotel.distance}
                                imageSrc={hotel.featured_image?.url ? `${URL_DOMAIN}${hotel.featured_image.url}` : "/congreso/bourbone-hotel.jpg"}
                                googleMapsUrl={hotel.map_url_location}
                                email={hotel.email}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Atractivos Turisticos - Conditionally rendered */}
            {turismoPageData.show_interest_location && touristAttractions.length > 0 && (
                <section>
                    <h2 className="text-4xl font-bold text-blue-900 mb-8">Atractivos turísticos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {touristAttractions.map((attraction) => (
                            <HotelCard
                                key={attraction.id}
                                name={attraction.title}
                                phone={attraction.telephone}
                                distance={attraction.distance}
                                imageSrc={attraction.featured_image?.url ? `${URL_DOMAIN}${attraction.featured_image.url}` : "/congreso/bourbone-hotel.jpg"}
                                googleMapsUrl={attraction.map_url_location}
                                email={attraction.email}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default DynamicHotelesSection;
