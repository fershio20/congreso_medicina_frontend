"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {BACKEND_URL, URL_DOMAIN} from '@/lib/globalConstants';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { HomeGeneralInterface } from '@/types/sections';
import type { ConfiguracionData } from '@/types/home';

interface Section {
    id: string;
    label: string;
    isRoute: boolean;
    url?: string;
}

interface MainNavProps {
    configuracion?: ConfiguracionData | null;
}

const MainNav: React.FC<MainNavProps> = ({ configuracion }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState('inicio');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAutoridadesOpen, setIsAutoridadesOpen] = useState(false);
    const [isCongresoOpen, setIsCongresoOpen] = useState(false);
    const [borderStyle, setBorderStyle] = useState({ x: 0, width: 0 });

    // Fetch logo using SWR
    const { data: homePageData, error: homePageError } = useSWR(
        `${URL_DOMAIN}/api/home-page?populate[HomeGeneral][populate]=*`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000,
            errorRetryCount: 0, // Don't retry - if it fails, show fallback
            shouldRetryOnError: false, // Don't retry on any error
            onError: (err) => {
                // Only log non-404 errors (404s are handled silently by fetcher)
                if (err instanceof Error && !err.message.includes('404')) {
                    console.warn('Error loading logo data (non-critical):', err.message);
                }
            }
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

    // Refs for menu items
    const menuRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // Set initial border position for "Inicio"
    useEffect(() => {
        const timer = setTimeout(() => {
            const inicioButton = menuRefs.current['inicio'];
            const menuContainer = document.getElementById('menuContainer');
            
            if (inicioButton && menuContainer) {
                const buttonRect = inicioButton.getBoundingClientRect();
                const containerRect = menuContainer.getBoundingClientRect();
                
                const relativeX = buttonRect.left - containerRect.left;
                
                setBorderStyle({
                    x: relativeX,
                    width: buttonRect.width
                });
            }
        }, 100); // Small delay to ensure DOM is ready
        
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Handle hash fragment navigation
        const handleHashNavigation = () => {
            if (typeof window !== 'undefined') {
                const hash = window.location.hash.replace('#', '');
                if (hash && pathname === '/') {
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                        const element = document.getElementById(hash);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                            setActiveSection(hash);
                        }
                    }, 100);
                }
            }
        };

        handleHashNavigation();
    }, [pathname]);

    const sections: Section[] = useMemo(() => [
        { id: "inicio", label: "Inicio", isRoute: false },
        { id: "expertos", label: "Expertos", isRoute: true, url: "/expertos" },
        { id: "costos", label: "Costos", isRoute: false },
        { id: "sede", label: "Sede", isRoute: true, url: "/sede" },
    ], []);


    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 100);

            // Update active section based on scroll position
            const heroSection = document.getElementById('inicio');
            if (heroSection) {
                const heroTop = heroSection.offsetTop;
                const heroHeight = heroSection.offsetHeight;
                
                if (scrollPosition < heroTop + heroHeight) {
                    setActiveSection('inicio');
                } else {
                    // Check other sections
                    for (const section of sections) {
                        if (section.isRoute) continue; // Skip route sections
                        
                        const element = document.getElementById(section.id);
                        if (element) {
                            const rect = element.getBoundingClientRect();
                            if (rect.top <= 100 && rect.bottom >= 100) {
                                setActiveSection(section.id);
                                break;
                            }
                        }
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    // Update border position and width based on current section
    useEffect(() => {
        const currentSection = hoveredSection || activeSection;
        const buttonRef = menuRefs.current[currentSection];
        
        if (buttonRef) {
            const rect = buttonRef.getBoundingClientRect();
            // Get the menuContainer element as the reference point
            const menuContainer = document.getElementById('menuContainer');
            const containerRect = menuContainer?.getBoundingClientRect();
            
            if (containerRect) {
                // Calculate position relative to the menuContainer
                const relativeX = rect.left - containerRect.left;
                
                setBorderStyle({
                    x: relativeX,
                    width: rect.width
                });
            }
        }
    }, [hoveredSection, activeSection]);

    const handleSectionClick = (sectionId: string) => {
        // Find the section configuration
        const section = sections.find(s => s.id === sectionId);
        
        if (section?.isRoute) {
            // For route sections, navigate to the dedicated page
            router.push(section.url || `/${sectionId}`);
        } else {
            // Check if we're on the home page
            if (pathname !== '/') {
                // If not on home page, navigate to home page with hash
                router.push(`/#${sectionId}`);
            } else {
                // If on home page, scroll to section
                if (sectionId === 'inicio') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const element = document.getElementById(sectionId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        }
        setActiveSection(sectionId);
        setIsMobileMenuOpen(false);
    };

    if(homePageError) {
        console.log('Error loading logo data:', homePageError);
    }



    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-lg
                ${configuracion?.main_navigation?.customClass ? configuracion?.main_navigation?.customClass : '' }
                ${configuracion?.main_navigation?.dark_mode ? configuracion?.main_navigation?.dark_mode : ''}
            `}
            style={{
                height: isScrolled ? '70px' : '100px',
                backgroundColor: configuracion?.main_navigation?.dark_mode ? (configuracion?.color_main ? configuracion.color_main : '#045084') : '#FFFF',
            }}
        >
            <nav className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-full">
                    {/* Logo with white circular background */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <div className="bg-white rounded-full  transition-all duration-300">
                                {(configuracion?.logo?.url || HomeGeneral?.logoCongreso) ? (
                                    <img
                                        src={
                                            configuracion?.logo?.url 
                                                ? (configuracion.logo.url.startsWith('http') 
                                                    ? configuracion.logo.url 
                                                    : BACKEND_URL + configuracion.logo.url)
                                                : HomeGeneral?.logoCongreso || '/logo-congreso-placeholder.png'
                                        }
                                        alt="Logo Congreso"
                                        className="transition-all duration-300"
                                        style={{
                                            height: isScrolled ? '40px' : 'auto',
                                            width: isScrolled ? '40px' : '60px',
                                            maxWidth: isScrolled ? 'auto' : '60px',
                                        }}
                                    />
                                ) : (
                                    <div 
                                        className={`bg-[#045084] rounded-full flex items-center justify-center transition-all duration-300`}
                                        style={{
                                            height: isScrolled ? '40px' : '60px',
                                            width: isScrolled ? '40px' : '60px'
                                        }}
                                    >
                                        <span className="text-white font-bold text-lg">CPP</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block relative h-full">
                        <div id="menuContainer" className="flex items-stretch h-full">
                            {sections.map((section) => (
                                <div key={section.id} className="relative h-full flex items-stretch">
                                    <button
                                        ref={(el) => { menuRefs.current[section.id] = el; }}
                                        className={`h-full px-6 text-sm font-medium hover:cursor-pointer
                                        
                                        transition-all duration-300 hover:text-white flex items-center justify-center`}
                                        onMouseEnter={() => setHoveredSection(section.id)}
                                        onMouseLeave={() => setHoveredSection(null)}
                                        onClick={() => handleSectionClick(section.id)}
                                        style={{
                                            color: configuracion?.main_navigation?.dark_mode ? '#FFF' : (configuracion?.color_main ? configuracion?.color_main : '#333'),
                                        }}
                                    >
                                        {section.label}
                                    </button>
                                </div>
                            ))}
                            
                            {/* Congreso Dropdown */}
                            {/*<div className="relative h-full flex items-stretch">
                                <button
                                    ref={(el) => { menuRefs.current['congreso'] = el; }}
                                    className={`h-full px-6 text-sm font-medium  transition-all duration-300  flex items-center justify-center gap-2`}
                                    onMouseEnter={() => setIsCongresoOpen(true)}
                                    onMouseLeave={() => setIsCongresoOpen(false)}
                                    style={{
                                        color: configuracion?.main_navigation?.dark_mode ? '#FFF' : (configuracion?.color_main ? configuracion?.color_main : '#333'),
                                    }}
                                >
                                    Congreso
                                    <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <AnimatePresence>
                                    {isCongresoOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                            onMouseEnter={() => setIsCongresoOpen(true)}
                                            onMouseLeave={() => setIsCongresoOpen(false)}
                                        >
                                            <Link
                                                href="/talleres"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Pre Talleres
                                            </Link>
                                            <Link
                                                href="/programa"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Programa
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>*/}

                            {/* Autoridades Dropdown */}
                            {/*<div className="relative h-full flex items-stretch">
                                <button
                                    ref={(el) => { menuRefs.current['autoridades'] = el; }}
                                    className={`h-full px-6 text-sm font-medium text-white transition-all duration-300 hover:text-white flex items-center justify-center gap-2`}
                                    onMouseEnter={() => setIsAutoridadesOpen(true)}
                                    onMouseLeave={() => setIsAutoridadesOpen(false)}
                                    style={{
                                        color: configuracion?.main_navigation?.dark_mode ? '#FFF' : (configuracion?.color_main ? configuracion?.color_main : '#333'),
                                    }}
                                >
                                    Autoridades
                                    <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <AnimatePresence>
                                    {isAutoridadesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                            onMouseEnter={() => setIsAutoridadesOpen(true)}
                                            onMouseLeave={() => setIsAutoridadesOpen(false)}
                                        >
                                            <Link
                                                href="/autoridades/comision-directiva"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Comisión Directiva
                                            </Link>
                                            <Link
                                                href="/autoridades/comite-organizador"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Comité Organizador
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>*/}

                            {/* Temas libres - Using Button component with principal variant */}
                            <div className="ml-6 flex items-center">
                                <Button
                                    variant="ghost"
                                    size="default"
                                    className={`h-full px-6 rounded-none  text-white hover:text-gray-200`}
                                    style={{
                                        backgroundColor: configuracion?.color_accent ? configuracion.color_accent : '#045084',
                                        // background:  '#045084',
                                    }}
                                    onClick={() => {
                                        if (pathname === '/') {
                                            // If on home page, scroll to temas libres section
                                            const element = document.getElementById('temas-libres');
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        } else {
                                            // If on other pages, navigate to home page with hash
                                            router.push('/#temas-libres');
                                        }
                                    }}
                                >
                                    Temas libres
                                </Button>
                            </div>
                        </div>

                        {/* Moving bottom border */}
                        <motion.div
                            className="absolute bottom-0 h-1 rounded-full"
                            style={{
                                backgroundColor: configuracion?.color_accent || '#5eead4'
                            }}
                            initial={false}
                            animate={{
                                x: borderStyle.x,
                                width: borderStyle.width
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                        />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden bg-[#045084] border-t border-gray-700"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#045084] transition-colors duration-300 ${activeSection === section.id ? 'bg-[#045084]' : ''}`}
                                        onClick={() => handleSectionClick(section.id)}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                                
                                {/* Mobile Congreso Options */}
                                <div className="px-3 py-2">
                                    <div className="text-white font-medium mb-2">Congreso</div>
                                    <div className="ml-4 space-y-1">
                                        <Link
                                            href="/talleres"
                                            className="block text-white hover:text-gray-300 transition-colors duration-300"
                                        >
                                            Pre Talleres
                                        </Link>
                                        <Link
                                            href="/programa"
                                            className="block text-white hover:text-gray-300 transition-colors duration-300"
                                        >
                                            Programa
                                        </Link>
                                    </div>
                                </div>

                                {/* Mobile Autoridades Options */}
                                <div className="px-3 py-2">
                                    <div className="text-white font-medium mb-2">Autoridades</div>
                                    <div className="ml-4 space-y-1">
                                        <Link
                                            href="/autoridades/comision-directiva"
                                            className="block text-white hover:text-gray-300 transition-colors duration-300"
                                        >
                                            Comisión Directiva
                                        </Link>
                                        <Link
                                            href="/autoridades/comite-organizador"
                                            className="block text-white hover:text-gray-300 transition-colors duration-300"
                                        >
                                            Comité Organizador
                                        </Link>
                                    </div>
                                </div>

                                {/* Mobile Temas libres */}
                                <div className="px-3 py-2">
                                    <Button
                                        variant="principal"
                                        size="default"
                                        className="w-full"
                                        onClick={() => {
                                            if (pathname === '/') {
                                                // If on home page, scroll to temas libres section
                                                const element = document.getElementById('temas-libres');
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            } else {
                                                // If on other pages, navigate to home page with hash
                                                router.push('/#temas-libres');
                                            }
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Temas libres
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default MainNav;
