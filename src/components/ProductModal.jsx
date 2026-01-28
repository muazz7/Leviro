import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function ProductModal({ product, onClose }) {
    const { addToCart } = useStore();
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeError, setSizeError] = useState(false);

    if (!product) return null;

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        addToCart(product, selectedSize);
        onClose();
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setSizeError(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 modal-overlay"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto modal-content">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="aspect-square md:aspect-auto bg-gray-50">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="p-6 md:p-10 flex flex-col">
                        <div className="flex-1">
                            <p className="text-gray-500 text-xs tracking-[0.2em] uppercase mb-2">
                                Leviro Collection
                            </p>
                            <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
                                {product.name}
                            </h2>
                            <p className="text-2xl font-semibold text-black mb-6">
                                ৳ {product.price.toLocaleString('en-BD')}
                            </p>

                            <p className="text-gray-600 leading-relaxed mb-8">
                                {product.description}
                            </p>

                            {/* Size Selector */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-black">
                                        Select Size
                                    </span>
                                    {sizeError && (
                                        <span className="text-sm text-red-500">
                                            Please select a size
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeSelect(size)}
                                            className={`min-w-[48px] px-4 py-3 border text-sm font-medium transition-all ${selectedSize === size
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
                            className="w-full bg-black text-white py-4 font-medium text-sm tracking-wide hover:bg-gray-900 transition-colors"
                        >
                            Add to Cart
                        </button>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Delivery</p>
                                    <p className="text-black">3-5 Business Days</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 mb-1">Returns</p>
                                    <p className="text-black">7 Days Easy Return</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
