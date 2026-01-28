import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function ProductGrid() {
    const { products } = useStore();

    return (
        <section id="products" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-gray-500 text-sm tracking-[0.3em] uppercase mb-3">
                        Our Collection
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-light text-black">
                        Premium Panjabis
                    </h2>
                    <div className="mt-4 w-16 h-px bg-black mx-auto" />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="group block"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-4 rounded-lg">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                                {/* Quick View Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="block w-full bg-black text-white py-3 text-sm font-medium tracking-wide text-center">
                                        View Details
                                    </span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1">
                                <h3 className="font-medium text-black group-hover:text-gray-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-gray-600 font-semibold">
                                    ৳ {product.price.toLocaleString('en-BD')}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products available</p>
                    </div>
                )}
            </div>
        </section>
    );
}
