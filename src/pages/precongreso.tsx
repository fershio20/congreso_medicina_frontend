import React from 'react';
import MainNav from '@/components/MainNav';
import PreTalleresSection from '@/components/home/PreTalleresSection';

const PrecongresoPage = () => {
    return (
        <>
            <MainNav />
            <div className="pt-[100px]">
                <div className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Precongreso
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                            Actividades previas al congreso principal, incluyendo talleres especializados y sesiones de preparación
                        </p>
                    </div>
                </div>
                
                <PreTalleresSection />
            </div>
        </>
    );
};

export default PrecongresoPage;
