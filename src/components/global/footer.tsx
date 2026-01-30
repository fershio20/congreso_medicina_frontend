'use client'

import React, { useMemo } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {URL_DOMAIN, URL_DOMAIN_IMG} from "@/lib/globalConstants";
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { HomeGeneralInterface } from '@/types/sections';
import type { ConfiguracionData } from "@/types/home";

interface FooterProps {
    configuracion?: ConfiguracionData | null;
}

const Footer: React.FC<FooterProps> = ({ configuracion }) => {
    const router = useRouter();
    const pathname = usePathname();

    // Fetch logo using SWR
    const { data: homePageData } = useSWR(
        `${URL_DOMAIN}/api/configuracion?populate[logo][populate]=*&populate[main_navigation][populate]=*&populate[footer][populate]=*`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000,
            errorRetryCount: 0, // Don't retry - if it fails, show fallback
            shouldRetryOnError: false, // Don't retry on any error
        }
    );


    // Extract HomeGeneral from SWR data
    const HomeGeneral: HomeGeneralInterface | null = useMemo(() => {
        // Handle null response (404) or missing data gracefully
        if (!homePageData || !homePageData.data?.HomeGeneral) return null;
        const section = homePageData.data.HomeGeneral;
        return {
            logoCongreso: section.logoCongreso?.url ? URL_DOMAIN + section.logoCongreso.url : ''
        };
    }, [homePageData]);

    // Function to handle section navigation (same logic as MainNav)
    const handleSectionClick = (sectionId: string) => {
        if (pathname === '/') {
            // If on home page, scroll to section
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If on other pages, navigate to home page with hash
            router.push(`/#${sectionId}`);
        }
    };

    // console.log('Footer configuracion:', homePageData?.data?.footer.copy_text)
    return (
        <footer 
            className="py-0 pb-12 pt-5"
            style={{
                backgroundColor: configuracion?.color_main || '#045084'
            }}
        >
            <div className="container mx-auto px-4 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    {homePageData?.data?.footer?.logo?.url && (
                        <div className="bg-white rounded-full shadow-lg p-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`${URL_DOMAIN_IMG}${homePageData.data.footer.logo.url}`}
                                alt="Sociedad Paraguaya de Pediatría"
                                className="h-16 w-16 object-cover rounded-full"
                            />
                        </div>
                    )}
                </div>

                {/* Links */}
                {/*<nav className="flex flex-col md:flex-row justify-center gap-8 mb-8">
                    <button 
                        onClick={() => handleSectionClick('inicio')}
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                    >
                        Inicio
                    </button>
                    <Link 
                        href="/autoridades/comision-directiva"
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors duration-200"
                    >
                        Comisión Directiva
                    </Link>
                    <Link 
                        href="/autoridades/comite-organizador"
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors duration-200"
                    >
                        Comité Organizador
                    </Link>
                    <button 
                        onClick={() => handleSectionClick('costos')}
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                    >
                        Costos
                    </button>
                    <button 
                        onClick={() => handleSectionClick('expertos')}
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors duration-200 cursor-pointer"
                    >
                        Expertos
                    </button>
                    <Link 
                        href="/talleres"
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors duration-200"
                    >
                        Pre-Congreso
                    </Link>
                    <Link 
                        href="/programa"
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors duration-200"
                    >
                        Programa
                    </Link>
                </nav>*/}

                {/* Separador */}
                <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center">
                    {/* Copyright */}
                    <p className="text-xs text-white/80 mb-4 md:mb-0">
                        {homePageData?.data?.footer.copy_text || ''}&nbsp;
                        Desarrollado por <a className='underline hover:text-white transition-colors duration-200' href="https://www.rocketpy.com/" target='_blank' rel="noopener noreferrer">Rocket Studio</a>
                    </p>

                    {/* Redes sociales */}
                    <div className="flex justify-center gap-4 text-white text-xl">
                        {homePageData?.data?.footer.social_facebook &&(
                        <a href={`/${homePageData?.data?.footer.social_facebook}`} aria-label="Facebook" className="hover:text-gray-300 transition-colors duration-200">
                            <FaFacebookF />
                        </a>
                        )}

                        {homePageData?.data?.footer.social_twitter &&(
                        <a href={`/${homePageData?.data?.footer.social_twitter}`} aria-label="Twitter" className="hover:text-gray-300 transition-colors duration-200">
                            <FaTwitter />
                        </a>
                        )}

                        {homePageData?.data?.footer.social_instagram &&(
                        <a href={`/${homePageData?.data?.footer.social_instagram}`} aria-label="Instagram" className="hover:text-gray-300 transition-colors duration-200">
                            <FaInstagram />
                        </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
