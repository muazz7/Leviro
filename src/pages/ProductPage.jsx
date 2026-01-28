import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import CartDrawer from '../components/CartDrawer';
import Checkout from '../components/Checkout';
import Footer from '../components/Footer';

export default function ProductPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products, addToCart, getCartCount } = useStore();

    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeError, setSizeError] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckout, setIsCheckout] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    const product = products.find(p => p.id === productId);
    const cartCount = getCartCount();

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-light text-black mb-4">Product Not Found</h1>
                <p className="text-gray-500 mb-8">The product you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        addToCart(product, selectedSize);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setSizeError(false);
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        setIsCheckout(true);
    };

    const handleOrderSuccess = () => {
        setIsCheckout(false);
        navigate('/');
    };

    if (isCheckout) {
        return (
            <Checkout
                onBack={() => setIsCheckout(false)}
                onSuccess={handleOrderSuccess}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Back + Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <Link to="/" className="flex items-center">
                                <h1 className="text-2xl font-bold tracking-tight text-black">
                                    LEVIRO
                                </h1>
                            </Link>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            <Link
                                to="/admin"
                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Admin
                            </Link>
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 hover:bg-gray-50 rounded-full transition-colors"
                                aria-label="Open cart"
                            >
                                <ShoppingBag className="w-6 h-6 text-black" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                        {/* Product Image */}
                        <div className="relative">
                            <div className="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden shadow-lg">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col">
                            <div className="flex-1">
                                <p className="text-gray-500 text-xs tracking-[0.2em] uppercase mb-2">
                                    Leviro Collection
                                </p>
                                <h1 className="text-3xl lg:text-4xl font-light text-black mb-4">
                                    {product.name}
                                </h1>
                                <p className="text-3xl font-semibold text-black mb-8">
                                    ৳ {product.price.toLocaleString('en-BD')}
                                </p>

                                <p className="text-gray-600 leading-relaxed mb-10 text-lg">
                                    {product.description}
                                </p>

                                {/* Size Selector */}
                                <div className="mb-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-black">
                                            Select Size
                                        </span>
                                        {sizeError && (
                                            <span className="text-sm text-red-500">
                                                Please select a size
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => handleSizeSelect(size)}
                                                className={`min-w-[56px] px-5 py-3.5 border text-sm font-medium transition-all rounded-lg ${selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : sizeError
                                                        ? 'border-red-300 hover:border-black'
                                                        : 'border-gray-200 hover:border-black'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={addedToCart}
                                className={`w-full py-4 font-medium text-sm tracking-wide transition-all flex items-center justify-center gap-2 ${addedToCart
                                    ? 'bg-green-600 text-white'
                                    : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Added to Cart
                                    </>
                                ) : (
                                    'Add to Cart'
                                )}
                            </button>

                            {/* Additional Info */}
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">Delivery</p>
                                        <p className="text-black font-medium">3-5 Business Days</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Returns</p>
                                        <p className="text-black font-medium">7 Days Easy Return</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Payment</p>
                                        <p className="text-black font-medium">Cash on Delivery</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Support</p>
                                        <p className="text-black font-medium">01714811255</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={handleCheckout}
            />
        </div>
    );
}
