'use client'

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

// Button type definitions
type ButtonType = 'text' | 'icon' | 'trail' | 'start' | 'spinner';

interface ButtonConfig {
    type: ButtonType;
    label?: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
}

// Define the RootNode type inline to match Strapi's structure
type RootNode = {
    type: 'paragraph' | 'quote' | 'code' | 'heading' | 'list' | 'image';
    children?: unknown[];
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    format?: 'ordered' | 'unordered';
    image?: {
        name: string;
        alternativeText?: string | null;
        url: string;
        caption?: string | null;
        width: number;
        height: number;
        formats?: Record<string, unknown>;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        previewUrl?: string | null;
        provider: string;
        provider_metadata?: unknown | null;
        createdAt: string;
        updatedAt: string;
    };
};

interface CustomSectionProps {
    Title: string;
    description: string | RootNode[];
    featuredImage: string;
    targetUrl: string;
    alignment: 'left' | 'right';
    id?: string;
    /**
     * Primary button configuration. This button will be displayed on the left side.
     * Uses the same configuration as secondaryButton for consistency.
     */
    primaryButton?: ButtonConfig;
    /**
     * Secondary button configuration. This button will be displayed on the right side.
     * The position property determines if it appears on the left or right of the primary button.
     */
    secondaryButton?: ButtonConfig & {
        position: 'left' | 'right';
    };
}

const CustomSection: React.FC<CustomSectionProps> = ({
    Title,
    description,
    featuredImage,
    targetUrl,
    alignment,
    id,
    primaryButton,
    secondaryButton,
}) => {
    // Default main button configuration
    const defaultPrimaryButton: ButtonConfig = {
        type: 'text',
        label: 'Ver más',
        href: targetUrl
    };

    // If mainButton is provided, use it; otherwise, if mainIconLabel is provided, create an icon button
    // This allows mainButton to take precedence over mainIconLabel
    const finalPrimaryButton = primaryButton || defaultPrimaryButton;

    // Render button based on type
    const renderButton = (config: ButtonConfig, variant: 'default' | 'outline' | 'principal' = 'default', size: 'default' | 'lg' = 'default') => {
        const buttonContent = () => {
            switch (config.type) {
                case 'text':
                    return config.label || 'Button';
                
                case 'icon':
                    return (
                        <>
                            {config.label || 'Button'}
                            {config.icon || <ArrowRight className="h-4 w-4 ml-2" />}
                        </>
                    );
                
                case 'trail':
                    return (
                        <>
                            {config.label || 'Button'}
                            {config.icon || <ArrowRight className="h-4 w-4 ml-2" />}
                        </>
                    );
                
                case 'start':
                    return (
                        <>
                            {config.icon || <ArrowRight className="h-4 w-4 mr-2" />}
                            {config.label || 'Button'}
                        </>
                    );
                
                case 'spinner':
                    return (
                        <>
                            {config.label || 'Loading...'}
                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                        </>
                    );
                
                default:
                    return config.label || 'Button';
            }
        };

        if (config.href) {
            return (
                <Link href={config.href}>
                    <Button 
                        size={size} 
                        variant={variant}
                        className="flex items-center cursor-pointer"
                    >
                        {buttonContent()}
                    </Button>
                </Link>
            );
        }

        return (
            <Button 
                size={size} 
                variant={variant}
                className="flex items-center cursor-pointer"
                onClick={config.onClick}
            >
                {buttonContent()}
            </Button>
        );
    };

    const ImageSection = () => (
        <div className="w-full lg:w-1/2 relative lg:h-full">
            <div className="px-4 sm:px-6 lg:px-0 pt-8 sm:pt-8 lg:pt-0 lg:p-0 lg:pt-0 lg:h-full">
                <div className="aspect-video w-full relative lg:aspect-auto lg:h-full">
                    <img
                        src={featuredImage}
                        alt={Title}
                        className="w-full h-full object-cover object-center rounded-lg lg:rounded-[0px]"
                    />
                </div>
            </div>
        </div>
    );

    const ContentSection = () => (
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center bg-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[var(--secondary-color)] mb-4 sm:mb-6 leading-tight">
                {Title}
            </h2>
            
            {/* Render description based on type */}
            {typeof description === 'string' ? (
                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                    {description}
                </p>
            ) : (
                <div className="mb-6 sm:mb-8 rich-text-content">
                    <BlocksRenderer 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        content={description as any} 
                        blocks={{
                            paragraph: ({ children }) => (
                                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 [&_a]:text-[#0F62A5] [&_a]:underline [&_a]:hover:text-[#0F62A5]/80 [&_a]:transition-colors [&_a]:duration-200">
                                    {children}
                                </p>
                            ),
                            heading: ({ children, level }) => {
                                const headingClasses = "mb-4 font-bold text-gray-800 [&_a]:text-[#0F62A5] [&_a]:underline [&_a]:hover:text-[#0F62A5]/80 [&_a]:transition-colors [&_a]:duration-200";
                                if (level === 1) return <h1 className={headingClasses}>{children}</h1>;
                                if (level === 2) return <h2 className={headingClasses}>{children}</h2>;
                                if (level === 3) return <h3 className={headingClasses}>{children}</h3>;
                                if (level === 4) return <h4 className={headingClasses}>{children}</h4>;
                                if (level === 5) return <h5 className={headingClasses}>{children}</h5>;
                                if (level === 6) return <h6 className={headingClasses}>{children}</h6>;
                                return <h3 className={headingClasses}>{children}</h3>;
                            },
                            list: ({ children, format }) => {
                                const ListTag = format === 'ordered' ? 'ol' : 'ul';
                                const listClassName = format === 'ordered' ? 'list-decimal' : 'list-disc';
                                return React.createElement(ListTag, {
                                    className: `ml-6 mb-4 space-y-2 ${listClassName} [&_a]:text-[#0F62A5] [&_a]:underline [&_a]:hover:text-[#0F62A5]/80 [&_a]:transition-colors [&_a]:duration-200`
                                }, children);
                            },
                            quote: ({ children }) => (
                                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-700 [&_a]:text-[#0F62A5] [&_a]:underline [&_a]:hover:text-[#0F62A5]/80 [&_a]:transition-colors [&_a]:duration-200">
                                    {children}
                                </blockquote>
                            ),
                            code: ({ children }) => (
                                <pre className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
                                    <code className="text-sm text-gray-800">{children}</code>
                                </pre>
                            ),
                            image: ({ image }) => (
                                <div className="mb-4">
                                    <img
                                        src={image.url}
                                        alt={image.alternativeText || ''}
                                        className="max-w-full h-auto rounded-lg"
                                    />
                                    {image.caption && (
                                        <p className="text-sm text-gray-500 mt-2 text-center">{image.caption}</p>
                                    )}
                                </div>
                            )
                        }}
                    />
                </div>
            )}
            
            {/* Button Container */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Secondary Button (Left) */}
                {secondaryButton && secondaryButton.position === 'left' && (
                    <div>
                        {renderButton(secondaryButton, 'outline', 'lg')}
                    </div>
                )}
                
                {/* Main Button */}
                <div>
                    {renderButton(finalPrimaryButton, 'principal', 'lg')}
                </div>
                
                {/* Secondary Button (Right) */}
                {secondaryButton && secondaryButton.position === 'right' && (
                    <div>
                        {renderButton(secondaryButton, 'outline', 'lg')}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <section id={id} className="relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch lg:h-[800px]">
                {/* On mobile, always show image first, then content */}
                <div className="lg:hidden">
                    <ImageSection />
                    <ContentSection />
                </div>
                
                {/* On desktop, respect the alignment prop */}
                <div className="hidden lg:flex w-full h-full items-stretch">
                    {alignment === 'left' ? (
                        <>
                            <ImageSection />
                            <ContentSection />
                        </>
                    ) : (
                        <>
                            <ContentSection />
                            <ImageSection />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CustomSection;
