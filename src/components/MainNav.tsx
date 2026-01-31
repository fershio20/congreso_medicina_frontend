"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {BACKEND_URL, URL_DOMAIN, URL_DOMAIN_IMG} from '@/lib/globalConstants';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { HomeGeneralInterface } from '@/types/sections';
import type { ConfiguracionData } from '@/types/home';
import type { NavigationTree, NavigationTreeItem } from '@/types/navigation';

/** Fallback sections when navigation API is unavailable */
interface Section {
    id: string;
    label: string;
    isRoute: boolean;
    url?: string;
}

const NAVIGATION_SLUG = 'navigation';
const NAVIGATION_API = `${URL_DOMAIN}/api/navigation/render/${NAVIGATION_SLUG}?type=TREE&menu=true`;

/** Normalized nav item for rendering (from API tree or fallback) */
interface NavItem {
    id: string;
    label: string;
    path: string;
    external: boolean;
    items?: NavItem[];
}

interface MainNavProps {
    configuracion?: ConfiguracionData | null;
}

function treeItemToNavItem(item: NavigationTreeItem, index: number): NavItem {
    const id = item.uiRouterKey || item.slug || item.path?.replace(/^\/#?/, '') || `nav-${index}`;
    return {
        id,
        label: item.title,
        path: item.path || '#',
        external: item.external ?? item.type === 'EXTERNAL',
        items: item.items?.length ? item.items.map((child, i) => treeItemToNavItem(child, i)) : undefined,
    };
}

function sectionsToNavItems(sections: Section[]): NavItem[] {
    return sections.map((s) => ({
        id: s.id,
        label: s.label,
        path: s.url || (s.isRoute ? `/${s.id}` : `/#${s.id}`),
        external: false,
        items: undefined,
    }));
}

const MainNav: React.FC<MainNavProps> = ({ configuracion }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState('inicio');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [borderStyle, setBorderStyle] = useState({ x: 0, width: 0 });

    // Fallback sections when navigation API is not used
    const fallbackSections: Section[] = useMemo(() => [
        { id: "inicio", label: "Inicio", isRoute: false },
        { id: "ejes", label: "Ejes", isRoute: false },
        { id: "sede", label: "Sede", isRoute: false, url: "/sede" },
    ], []);

    // Fetch navigation from Strapi Navigation plugin (slug: navigation)
    const { data: navData } = useSWR<NavigationTree>(
        NAVIGATION_API,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000,
            errorRetryCount: 0,
            shouldRetryOnError: false,
        }
    );

    // console.log('Navigation Data:', navData);

    // Normalized nav items: from API tree or fallback sections
    const navItems: NavItem[] = useMemo(() => {
        if (navData && Array.isArray(navData) && navData.length > 0) {
            return navData.map((item, i) => treeItemToNavItem(item, i));
        }
        return sectionsToNavItems(fallbackSections);
    }, [navData, fallbackSections]);

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

    // Set initial border position for first nav item
    const firstNavId = navItems[0]?.id;
    useEffect(() => {
        const timer = setTimeout(() => {
            const firstButton = firstNavId ? menuRefs.current[firstNavId] : null;
            const menuContainer = document.getElementById('menuContainer');
            
            if (firstButton && menuContainer) {
                const buttonRect = firstButton.getBoundingClientRect();
                const containerRect = menuContainer.getBoundingClientRect();
                const relativeX = buttonRect.left - containerRect.left;
                setBorderStyle({ x: relativeX, width: buttonRect.width });
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [firstNavId]);

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
                    // Check other sections (only non-external, anchor-style items)
                    for (const item of navItems) {
                        if (item.external || (item.path.startsWith('http') || (item.path !== '/' && !item.path.startsWith('/#')))) continue;
                        const sectionId = item.path === '/' ? 'inicio' : item.path.replace(/^\/#?/, '');
                        const element = document.getElementById(sectionId);
                        if (element) {
                            const rect = element.getBoundingClientRect();
                            if (rect.top <= 100 && rect.bottom >= 100) {
                                setActiveSection(item.id);
                                break;
                            }
                        }
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navItems]);

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

    const handleNavClick = (item: NavItem) => {
        setActiveSection(item.id);
        setIsMobileMenuOpen(false);

        if (item.external || item.path.startsWith('http')) {
            window.open(item.path, '_blank', 'noopener,noreferrer');
            return;
        }

        const isAnchor = item.path === '/' || item.path.startsWith('/#');
        const sectionId = isAnchor ? (item.path === '/' ? 'inicio' : item.path.replace(/^\/#?/, '')) : null;

        if (isAnchor && sectionId) {
            if (pathname !== '/') {
                router.push(`/#${sectionId}`);
            } else {
                if (sectionId === 'inicio') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    const element = document.getElementById(sectionId);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } else {
            router.push(item.path || '/');
        }
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
                    <div className="shrink-0">
                        <Link href="/" className="flex items-center">
                            <div className="bg-white rounded-full  transition-all duration-300">

                                {(configuracion?.logo?.url || HomeGeneral?.logoCongreso) ? (
                                    <img
                                        src={
                                            configuracion?.logo?.url 
                                                ? (configuracion.logo.url.startsWith('http') 
                                                    ? configuracion.logo.url 
                                                    : URL_DOMAIN_IMG + configuracion.logo.url)
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
                                        <span className="text-white font-bold text-lg">CM</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block relative h-full">
                        <div id="menuContainer" className="flex items-stretch h-full">
                            {navItems.map((item) => (
                                <div key={item.id} className="relative h-full flex items-stretch">
                                    {item.items && item.items.length > 0 ? (
                                        <>
                                            <button
                                                ref={(el) => { menuRefs.current[item.id] = el; }}
                                                className="h-full px-6 text-sm font-medium hover:cursor-pointer transition-all duration-300 hover:text-white flex items-center justify-center gap-2"
                                                onMouseEnter={() => setHoveredSection(item.id)}
                                                onMouseLeave={() => setHoveredSection(null)}
                                                style={{
                                                    color: configuracion?.main_navigation?.dark_mode ? '#FFF' : (configuracion?.color_main ? configuracion?.color_main : '#333'),
                                                }}
                                            >
                                                {item.label}
                                                <svg className="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <AnimatePresence>
                                                {hoveredSection === item.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                                        onMouseEnter={() => setHoveredSection(item.id)}
                                                        onMouseLeave={() => setHoveredSection(null)}
                                                    >
                                                        {item.items.map((child) => (
                                                            child.external || child.path.startsWith('http') ? (
                                                                <a
                                                                    key={child.id}
                                                                    href={child.path}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    {child.label}
                                                                </a>
                                                            ) : (
                                                                <Link
                                                                    key={child.id}
                                                                    href={child.path}
                                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    onClick={() => { handleNavClick(child); setHoveredSection(null); }}
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            )
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        item.external || item.path.startsWith('http') ? (
                                            <a
                                                ref={(el) => { if (el) menuRefs.current[item.id] = el as unknown as HTMLButtonElement; }}
                                                href={item.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-full px-6 text-sm font-medium hover:cursor-pointer transition-all duration-300 hover:text-white flex items-center justify-center"
                                                onMouseEnter={() => setHoveredSection(item.id)}
                                                onMouseLeave={() => setHoveredSection(null)}
                                                style={{
                                                    color: configuracion?.main_navigation?.dark_mode ? '#FFF' : (configuracion?.color_main ? configuracion?.color_main : '#333'),
                                                }}
                                            >
                                                {item.label}
                                            </a>
                                        ) : (
                                            <button
                                                ref={(el) => { menuRefs.current[item.id] = el; }}
                                                className="h-full px-6 text-sm font-medium hover:cursor-pointer transition-all duration-300 hover:text-white flex items-center justify-center"
                                                onMouseEnter={() => setHoveredSection(item.id)}
                                                onMouseLeave={() => setHoveredSection(null)}
                                                onClick={() => handleNavClick(item)}
                                                style={{
                                                    color: configuracion?.main_navigation?.dark_mode ? '#FFF' : (configuracion?.color_main ? configuracion?.color_main : '#333'),
                                                }}
                                            >
                                                {item.label}
                                            </button>
                                        )
                                    )}
                                </div>
                            ))}
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
                                {navItems.map((item) => (
                                    <div key={item.id}>
                                        {item.items && item.items.length > 0 ? (
                                            <div className="px-3 py-2">
                                                <div className="text-white font-medium mb-2">{item.label}</div>
                                                <div className="ml-4 space-y-1">
                                                    {item.items.map((child) => (
                                                        child.external || child.path.startsWith('http') ? (
                                                            <a
                                                                key={child.id}
                                                                href={child.path}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block text-white hover:text-gray-300 transition-colors duration-300"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {child.label}
                                                            </a>
                                                        ) : (
                                                            <Link
                                                                key={child.id}
                                                                href={child.path}
                                                                className="block text-white hover:text-gray-300 transition-colors duration-300"
                                                                onClick={() => handleNavClick(child)}
                                                            >
                                                                {child.label}
                                                            </Link>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        ) : item.external || item.path.startsWith('http') ? (
                                            <a
                                                href={item.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#045084] transition-colors duration-300"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.label}
                                            </a>
                                        ) : (
                                            <button
                                                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#045084] transition-colors duration-300 ${activeSection === item.id ? 'bg-[#045084]' : ''}`}
                                                onClick={() => handleNavClick(item)}
                                            >
                                                {item.label}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default MainNav;
