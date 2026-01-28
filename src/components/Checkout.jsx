import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const DISTRICTS = [
    'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna',
    'Barishal', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur',
    'Narayanganj', 'Cox\'s Bazar', 'Bogura', 'Jessore', 'Dinajpur'
];

export default function Checkout({ onBack, onSuccess }) {
    const { cart, getCartTotal, placeOrder } = useStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        district: '',
        thana: '',
        address: '',
        paymentMethod: 'cod',
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^(\+880|0)?1[3-9]\d{8}$/.test(formData.mobile.replace(/\s/g, ''))) {
            newErrors.mobile = 'Enter a valid Bangladeshi mobile number';
        }

        if (!formData.district) {
            newErrors.district = 'Please select a district';
        }

        if (!formData.thana.trim()) {
            newErrors.thana = 'Thana/Upazila is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Full address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        placeOrder(formData);
        setIsSubmitting(false);
        onSuccess();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-medium text-black">Checkout</h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Order Summary */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                        Order Summary
                    </h2>
                    <div className="space-y-3">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    {item.name} ({item.size}) x {item.quantity}
                                </span>
                                <span className="font-medium">
                                    ৳ {(item.price * item.quantity).toLocaleString('en-BD')}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-bold">
                            ৳ {getCartTotal().toLocaleString('en-BD')}
                        </span>
                    </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
                        Delivery Information
                    </h2>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 transition-all ${errors.name ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Mobile Number *
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 transition-all ${errors.mobile ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                placeholder="+880 1XXX-XXXXXX"
                            />
                            {errors.mobile && (
                                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                            )}
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                District *
                            </label>
                            <select
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 transition-all bg-white ${errors.district ? 'border-red-300' : 'border-gray-200'
                                    }`}
                            >
                                <option value="">Select District</option>
                                {DISTRICTS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            {errors.district && (
                                <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                            )}
                        </div>

                        {/* Thana */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Thana / Upazila *
                            </label>
                            <input
                                type="text"
                                name="thana"
                                value={formData.thana}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 transition-all ${errors.thana ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                placeholder="Enter thana/upazila"
                            />
                            {errors.thana && (
                                <p className="text-red-500 text-sm mt-1">{errors.thana}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Full Address *
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none ${errors.address ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                placeholder="House no, Road, Area, Landmark"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-3">
                                Payment Method
                            </label>
                            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                </div>
                                <div>
                                    <p className="font-medium text-black">Cash on Delivery</p>
                                    <p className="text-sm text-gray-500">Pay when you receive</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-8 bg-black text-white py-4 font-medium text-sm tracking-wide hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Place Order • ৳ {getCartTotal().toLocaleString('en-BD')}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
