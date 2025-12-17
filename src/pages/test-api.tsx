import React from "react";
import { useTurismoPage, useTurismos } from "@/lib/swr";
import DebugTurismoData from "@/components/hoteleria/DebugTurismoData";

export default function TestApiPage() {
    // Fetch turismo page data using SWR
    const { 
        data: turismoPageResult, 
        error: turismoPageError, 
        isLoading: turismoPageLoading 
    } = useTurismoPage();

    // Fetch turismos data using SWR
    const { 
        data: turismosResult, 
        error: turismosError, 
        isLoading: turismosLoading 
    } = useTurismos();

    const isLoading = turismoPageLoading || turismosLoading;
    const hasError = turismoPageError || turismosError;

    if (isLoading) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Testing API Endpoints...</h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">API Endpoints Test</h1>
            
            {hasError && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <strong>Error:</strong> {turismoPageError?.message || turismosError?.message}
                </div>
            )}

            {/* Enhanced Debug Component */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Data Filtering & Categorization</h2>
                <DebugTurismoData />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-xl font-semibold mb-3">Turismo Page Endpoint</h2>
                    <div className="bg-gray-100 p-4 rounded">
                        <pre className="text-xs overflow-auto max-h-96">
                            {turismoPageResult ? JSON.stringify(turismoPageResult, null, 2) : 'No data'}
                        </pre>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-3">Turismos Endpoint</h2>
                    <div className="bg-gray-100 p-4 rounded">
                        <pre className="text-xs overflow-auto max-h-96">
                            {turismosResult ? JSON.stringify(turismosResult, null, 2) : 'No data'}
                        </pre>
                    </div>
                </div>
            </div>
            
            <div className="mt-6">
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Retry Test
                </button>
            </div>
        </div>
    );
}
