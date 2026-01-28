import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import CartDrawer from '../components/CartDrawer';
import Checkout from '../components/Checkout';
import Footer from '../components/Footer';

export default function Home({ onAdminClick }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckout, setIsCheckout] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const productsRef = useRef(null);
    const navigate = useNavigate();

    const scrollToProducts = () => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCartClick = () => {
        setIsCartOpen(true);
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        setIsCheckout(true);
    };

    const handleBackToShop = () => {
        setIsCheckout(false);
    };

    const handleOrderSuccess = () => {
        setIsCheckout(false);
        setOrderSuccess(true);
        setTimeout(() => setOrderSuccess(false), 5000);
    };

    // Show checkout page
    if (isCheckout) {
        return (
            <Checkout
                onBack={handleBackToShop}
                onSuccess={handleOrderSuccess}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header
                onCartClick={handleCartClick}
                onAdminClick={onAdminClick}
            />

            <main>
                <Hero onShopClick={scrollToProducts} />

                <div ref={productsRef}>
                    <ProductGrid />
                </div>
            </main>

            <Footer />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={handleCloseCart}
                onCheckout={handleCheckout}
            />

            {/* Order Success Overlay */}
            {orderSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-lg p-8 max-w-sm text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-black mb-2">Order Placed!</h2>
                        <p className="text-gray-500 text-sm">
                            Thank you for your order. We will contact you shortly to confirm delivery.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
