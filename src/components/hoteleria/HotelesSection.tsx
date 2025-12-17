'use client'

import React from "react";
import HotelCard from "./HotelCard";
import FeaturedHotel from "./FeaturedHotel";

const featuredHotel = {
    name: "Hotel Bourbon",
    description: "Ubicado en Luque - Gran Asunción, a solo 3 minutos del Aeropuerto Internacional Silvio Pettirossi. Ideal para congresos y convenciones, conectado al Centro de Convenciones Conmebol con 3.500 m² de área de exposición y capacidad para 4.500 personas. También conectado al Museo Sudamericano de Fútbol con temáticas del fútbol y colección de 9 títulos mundiales de selecciones nacionales (5 de Brasil, 2 de Argentina, 2 de Uruguay).",
    address: "Avenida Sudamericana 3104",
    phone: "+595 21 659 1000",
    imageSrc: "/congreso/bourbone-hotel.jpg"
};

const otherHotels = [
    {
        name: "Hotel Guarani",
        phone: "+595 21 444 000",
        distance: "A tan solo 5km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example1"
    },
    {
        name: "Hotel Crowne Plaza",
        phone: "+595 21 555 000",
        distance: "A tan solo 6km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example2"
    },
    {
        name: "Hotel Sheraton",
        phone: "+595 21 666 000",
        distance: "A tan solo 7km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example3"
    },
    {
        name: "Hotel Gran Hotel del Paraguay",
        phone: "+595 21 777 000",
        distance: "A tan solo 8km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example4"
    },
    {
        name: "Hotel Excelsior",
        phone: "+595 21 888 000",
        distance: "A tan solo 9km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example5"
    },
    {
        name: "Hotel Palmaroga",
        phone: "+595 21 999 000",
        distance: "A tan solo 10km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example6"
    }
];

const touristAttractions = [
    {
        name: "Centro Histórico de Asunción",
        phone: "+595 21 111 000",
        distance: "A tan solo 3km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example7"
    },
    {
        name: "Costanera de Asunción",
        phone: "+595 21 222 000",
        distance: "A tan solo 4km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example8"
    },
    {
        name: "Museo del Barro",
        phone: "+595 21 333 000",
        distance: "A tan solo 5km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example9"
    },
    {
        name: "Jardín Botánico y Zoológico",
        phone: "+595 21 444 000",
        distance: "A tan solo 6km del hotel",
        imageSrc: "/congreso/bourbone-hotel.jpg",
        googleMapsUrl: "https://maps.app.goo.gl/example10"
    }
];

const HotelesSection: React.FC = () => {
    return (
        <div className="space-y-24">
            {/* La Sede - Featured Hotel */}
            <section>
                <h2 className="text-4xl font-bold text-blue-900 mb-8">La Sede</h2>
                <FeaturedHotel {...featuredHotel} />
            </section>

            {/* Otros Hoteles */}
            <section className="py-20">
                <h2 className="text-4xl font-bold text-blue-900 my-10">Otros Hoteles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherHotels.map((hotel, index) => (
                        <HotelCard
                            key={index}
                            name={hotel.name}
                            phone={hotel.phone}
                            distance={hotel.distance}
                            imageSrc={hotel.imageSrc}
                            googleMapsUrl={hotel.googleMapsUrl}
                        />
                    ))}
                </div>
            </section>

            {/* Atractivos Turisticos */}
            <section>
                <h2 className="text-4xl font-bold text-blue-900 mb-8">Atractivos turisticos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {touristAttractions.map((attraction, index) => (
                        <HotelCard
                            key={index}
                            name={attraction.name}
                            phone={attraction.phone}
                            distance={attraction.distance}
                            imageSrc={attraction.imageSrc}
                            googleMapsUrl={attraction.googleMapsUrl}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HotelesSection;
