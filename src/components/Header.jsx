import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Header({ onCartClick }) {
    const { getCartCount } = useStore();
    const cartCount = getCartCount();

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex items-center">
                        <h1 className="text-2xl font-bold tracking-tight text-black">
                            LEVIRO
                        </h1>
                    </a>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                        {/* Hidden admin link */}
                        <Link
                            to="/admin"
                            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Admin
                        </Link>

                        {/* Cart Button */}
                        <button
                            onClick={onCartClick}
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
    );
}
