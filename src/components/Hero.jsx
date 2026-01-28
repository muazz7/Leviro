import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const heroImages = [
    '/hero-1.jpg',
    '/hero-2.jpg',
    '/hero-3.jpg',
    '/hero-4.jpg',
];

export default function Hero({ onShopClick }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Auto-slide every 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 4000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const goToSlide = (index) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setCurrentIndex(index);
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <section className="relative min-h-screen lg:h-[85vh] lg:min-h-[600px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-0 flex items-center">
                {/* Mobile Layout */}
                <div className="lg:hidden w-full flex flex-col items-center text-center">
                    {/* Title First on Mobile */}
                    <h2 className="text-3xl sm:text-4xl font-light text-black leading-tight mb-6">
                        Elegance in
                        <span className="block font-semibold">Every Thread</span>
                    </h2>

                    {/* Image Slider - Smaller on Mobile */}
                    <div className="relative w-full max-w-[280px] sm:max-w-xs mb-8">
                        {/* Decorative Frame */}
                        <div className="absolute -inset-3 bg-gradient-to-br from-amber-100/40 to-amber-50/20 rounded-xl -rotate-2" />
                        <div className="absolute -inset-3 bg-gradient-to-br from-gray-100/40 to-white/20 rounded-xl rotate-1" />

                        {/* Image Box */}
                        <div className="relative aspect-[3/4] bg-white rounded-lg shadow-xl overflow-hidden">
                            {heroImages.map((image, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentIndex
                                            ? 'opacity-100 translate-x-0'
                                            : index < currentIndex
                                                ? 'opacity-0 -translate-x-full'
                                                : 'opacity-0 translate-x-full'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Leviro Panjabi Collection ${index + 1}`}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            ))}

                            {/* Navigation Arrows - Smaller on Mobile */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-800" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-800" />
                            </button>
                        </div>

                        {/* Dot Indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                            {heroImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-black w-5'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Premium Collection Text */}
                    <p className="text-gray-500 text-xs tracking-[0.2em] uppercase mb-3">
                        Premium Collection 2026
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-sm">
                        Discover our curated collection of handcrafted Panjabis,
                        designed for the modern Bengali man who values tradition
                        and sophistication.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={onShopClick}
                        className="group inline-flex items-center gap-3 bg-black text-white px-6 py-3 font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors"
                    >
                        Shop Collection
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid grid-cols-2 gap-16 items-center w-full">
                    {/* Content */}
                    <div className="text-left">
                        <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-4">
                            Premium Collection 2026
                        </p>
                        <h2 className="text-5xl xl:text-6xl font-light text-black leading-tight mb-6">
                            Elegance in
                            <span className="block font-semibold">Every Thread</span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md">
                            Discover our curated collection of handcrafted Panjabis,
                            designed for the modern Bengali man who values tradition
                            and sophistication.
                        </p>
                        <button
                            onClick={onShopClick}
                            className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-medium text-sm tracking-wide hover:bg-gray-800 transition-colors"
                        >
                            Shop Collection
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* Image Slider */}
                    <div className="relative">
                        {/* Main Image Container */}
                        <div className="relative aspect-[3/4] max-w-md mx-auto">
                            {/* Decorative Frame */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-amber-100/50 to-amber-50/30 rounded-2xl -rotate-3" />
                            <div className="absolute -inset-4 bg-gradient-to-br from-gray-100/50 to-white/30 rounded-2xl rotate-2" />

                            {/* Image Box */}
                            <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden h-full">
                                {heroImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-500 ease-in-out ${index === currentIndex
                                                ? 'opacity-100 translate-x-0'
                                                : index < currentIndex
                                                    ? 'opacity-0 -translate-x-full'
                                                    : 'opacity-0 translate-x-full'
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Leviro Panjabi Collection ${index + 1}`}
                                            className="w-full h-full object-cover object-top"
                                        />
                                    </div>
                                ))}

                                {/* Navigation Arrows */}
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-800" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-800" />
                                </button>
                            </div>
                        </div>

                        {/* Dot Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {heroImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-black w-6'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator - Hidden on Mobile */}
            <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
                <span className="text-gray-400 text-xs tracking-widest uppercase">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent" />
            </div>
        </section>
    );
}
