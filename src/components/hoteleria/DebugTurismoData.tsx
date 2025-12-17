'use client'

import React from "react";
import { useTurismoPage, useTurismos } from "@/lib/swr";

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

const DebugTurismoData: React.FC = () => {
    // Fetch turismo page data using SWR
    const { 
        data: turismoPageData, 
        error: turismoPageError, 
        isLoading: turismoPageLoading 
    } = useTurismoPage();

    // Fetch turismo items using SWR
    const { 
        data: turismoItemsData, 
        error: turismoItemsError, 
        isLoading: turismoItemsLoading 
    } = useTurismos();

    const isLoading = turismoPageLoading || turismoItemsLoading;
    const hasError = turismoPageError || turismoItemsError;

    if (isLoading) {
        return <div>Loading debug data...</div>;
    }

    if (hasError) {
        const errorMessage = turismoPageError?.message || turismoItemsError?.message || 'An error occurred';
        return <div>Error: {errorMessage}</div>;
    }

    // Process and categorize the data
    const turismoItems: TurismoItem[] = turismoItemsData?.data || [];
    const allHotels = turismoItems.filter(item => item.type === 'hotel');
    const allAttractions = turismoItems.filter(item => item.type === 'punto_de_interes');
    
    // Only show available items
    const hotels = allHotels.filter(item => item.is_available === true);
    const touristAttractions = allAttractions.filter(item => item.is_available === true);

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Debug: Turismo Data</h3>
            
            <div className="mb-6">
                <h4 className="font-semibold mb-2">Summary:</h4>
                <div className="bg-white p-3 rounded text-sm">
                    <p><strong>Total Items:</strong> {turismoItems.length}</p>
                    <p><strong>All Hotels:</strong> {allHotels.length} (type: &quot;hotel&quot;)</p>
                    <p><strong>Available Hotels:</strong> {hotels.length} (is_available: true)</p>
                    <p><strong>All Tourist Attractions:</strong> {allAttractions.length} (type: &quot;punto_de_interes&quot;)</p>
                    <p><strong>Available Tourist Attractions:</strong> {touristAttractions.length} (is_available: true)</p>
                    <p><strong>Show Others Hotels:</strong> {turismoPageData?.data?.show_others_hotels ? 'Yes' : 'No'}</p>
                    <p><strong>Show Interest Location:</strong> {turismoPageData?.data?.show_interest_location ? 'Yes' : 'No'}</p>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-2">Available Hotels (is_available: true):</h4>
                <div className="bg-white p-3 rounded text-sm">
                    {hotels.length > 0 ? (
                        hotels.map((hotel, index) => (
                            <div key={hotel.id} className="mb-2 p-2 border-l-4 border-blue-500 bg-blue-50">
                                <p><strong>{index + 1}. {hotel.title}</strong></p>
                                <p>Type: {hotel.type}</p>
                                <p>Phone: {hotel.telephone}</p>
                                <p>Distance: {hotel.distance}</p>
                                <p>Available: {hotel.is_available ? 'Yes' : 'No'}</p>
                                <p>Email: {hotel.email || 'N/A'}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No available hotels found</p>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-2">Available Tourist Attractions (is_available: true):</h4>
                <div className="bg-white p-3 rounded text-sm">
                    {touristAttractions.length > 0 ? (
                        touristAttractions.map((attraction, index) => (
                            <div key={attraction.id} className="mb-2 p-2 border-l-4 border-green-500 bg-green-50">
                                <p><strong>{index + 1}. {attraction.title}</strong></p>
                                <p>Type: {attraction.type}</p>
                                <p>Phone: {attraction.telephone}</p>
                                <p>Distance: {attraction.distance}</p>
                                <p>Available: {attraction.is_available ? 'Yes' : 'No'}</p>
                                <p>Email: {attraction.email || 'N/A'}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No available tourist attractions found</p>
                    )}
                </div>
            </div>
            
            <div className="mb-6">
                <h4 className="font-semibold mb-2">Turismo Page Data:</h4>
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
                    {JSON.stringify(turismoPageData, null, 2)}
                </pre>
            </div>
            
            <div>
                <h4 className="font-semibold mb-2">Raw Turismo Items Data:</h4>
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
                    {JSON.stringify(turismoItemsData, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default DebugTurismoData;
