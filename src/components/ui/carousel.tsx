"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CarouselProps {
  children: React.ReactNode
  className?: string
  showArrows?: boolean
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  itemsPerView?: number | {
    mobile: number
    tablet: number
    desktop: number
  }
  infiniteLoop?: boolean
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps
>(({ children, className, showArrows = true, autoPlay = false, interval = 5000, showDots = true, itemsPerView: propItemsPerView, infiniteLoop = false }, ref) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(autoPlay)
  const childrenArray = React.Children.toArray(children)
  const totalSlides = childrenArray.length



  // Calculate items per view based on screen size or use prop
  const [itemsPerView, setItemsPerView] = React.useState(() => {
    if (typeof propItemsPerView === 'object') {
      // Default to mobile first
      return propItemsPerView.mobile
    }
    return propItemsPerView || 4
  })


  const totalPages = Math.ceil(totalSlides / itemsPerView);
  const isPaged = !infiniteLoop;
  const activePage = isPaged? currentIndex: Math.floor(currentIndex / itemsPerView);

  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof propItemsPerView === 'object') {
        const width = window.innerWidth
        if (width >= 1024) { // lg breakpoint - desktop
          setItemsPerView(propItemsPerView.desktop)
        } else if (width >= 768) { // md breakpoint - tablet
          setItemsPerView(propItemsPerView.tablet)
        } else { // mobile
          setItemsPerView(propItemsPerView.mobile)
        }
      } else if (propItemsPerView) {
        setItemsPerView(propItemsPerView)
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [propItemsPerView])

  const nextSlide = React.useCallback(() => {
    if (infiniteLoop) {
      // Avanza por 1 slide
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    } else {
      // Avanza por página
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }
  }, [totalSlides, totalPages, infiniteLoop]);

  const prevSlide = React.useCallback(() => {
    if (infiniteLoop) {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    } else {
      setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
    }
  }, [totalSlides, totalPages, infiniteLoop]);



  React.useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      nextSlide()
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, interval, nextSlide])

  const handleMouseEnter = React.useCallback(() => {
    if (autoPlay) setIsPlaying(false)
  }, [autoPlay])

  const handleMouseLeave = React.useCallback(() => {
    if (autoPlay) setIsPlaying(true)
  }, [autoPlay])

  if (totalSlides === 0) return null

  const shouldShowArrows = showArrows && totalSlides > itemsPerView

  return (
    <div className="relative">
      {/* Navigation Arrows - Positioned outside the carousel grid */}
      {shouldShowArrows && (
        <>
          <Button
            variant="light"
            size="icon"
            className="absolute -left-8 md:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full backdrop-blur-sm z-20 transform-gpu transition-transform duration-200 hover:scale-110 active:scale-95"
            onClick={prevSlide}
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="light"
            size="icon"
            className="absolute -right-8 md:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full backdrop-blur-sm z-20 transform-gpu transition-transform duration-200 hover:scale-110 active:scale-95"
            onClick={nextSlide}
          >
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
            <span className="sr-only">Next slide</span>
          </Button>
        </>
      )}

      {/* Carousel Container */}
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: infiniteLoop 
              ? `translateX(-${currentIndex * (100 / itemsPerView)}%)`
              : `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              {child}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {autoPlay && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
            <div 
              className="h-full bg-white transition-all duration-300 ease-linear"
              style={{ 
                width: infiniteLoop
                  ? `${((currentIndex + 1) / totalSlides) * 100}%`
                  : `${((currentIndex + 1) / Math.ceil(totalSlides / itemsPerView)) * 100}%`
              }}
            />
          </div>
        )}
      </div>

      {/* Dots indicator - Positioned outside the carousel container */}
      {showDots && (infiniteLoop ? totalSlides > 0 : totalPages > 1) && (
        <div className="hidden lg:flex justify-center mt-8 mb-6">
          <div className="flex space-x-3">
            {Array.from({ length: totalPages }).map((_, pageIndex) => {
              const isActive = pageIndex === activePage;
              return (
                <button
                  key={pageIndex}
                  className={cn(
                    "w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 border-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] focus:ring-offset-2",
                    isActive
                      ? "bg-[var(--secondary-color)] border-[var(--secondary-color)] shadow-lg scale-110"
                      : "bg-transparent border-gray-400 hover:border-gray-500 hover:bg-gray-400/20"
                  )}
                  onClick={() => {
                    if (infiniteLoop) {
                      setCurrentIndex(pageIndex * itemsPerView); // primer slide de la página
                    } else {
                      setCurrentIndex(pageIndex); // página
                    }
                  }}
                  aria-label={`Go to page ${pageIndex + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}

    </div>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex", className)}
      {...props}
    />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("min-w-0 shrink-0 grow-0", className)}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="light"
      size="icon"
      className={cn(
        "absolute -left-8 md:-left-12 lg:-left-16 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full backdrop-blur-sm transform-gpu",
        className
      )}
      {...props}
    >
      <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="light"
      size="icon"
      className={cn(
        "absolute -right-8 md:-right-12 lg:-right-16 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full backdrop-blur-sm transform-gpu",
        className
      )}
      {...props}
    >
      <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselProps,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
