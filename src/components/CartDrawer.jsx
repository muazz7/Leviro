import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
    const { cart, removeFromCart, updateCartQuantity, getCartTotal } = useStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl drawer-enter flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-black">
                        Your Cart ({cart.length})
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <X className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-600 mb-2">Your cart is empty</p>
                            <p className="text-sm text-gray-400">
                                Add items to get started
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-gray-50 flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-black text-sm truncate">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Size: {item.size}
                                        </p>
                                        <p className="text-black font-semibold text-sm mt-1">
                                            ৳ {item.price.toLocaleString('en-BD')}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-gray-200">
                                                <button
                                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-50 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-4 text-sm font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-50 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-100 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-xl font-semibold text-black">
                                ৳ {getCartTotal().toLocaleString('en-BD')}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Shipping calculated at checkout
                        </p>
                        <button
                            onClick={onCheckout}
                            className="w-full bg-black text-white py-4 font-medium text-sm tracking-wide hover:bg-gray-900 transition-colors"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
