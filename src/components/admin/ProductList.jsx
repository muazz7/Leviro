import { Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function ProductList() {
    const { products, deleteProduct } = useStore();

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No products added yet</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                >
                    <div className="aspect-square bg-gray-50">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-medium text-black text-sm truncate">
                            {product.name}
                        </h3>
                        <p className="text-gray-600 font-semibold text-sm mt-1">
                            ৳ {product.price.toLocaleString('en-BD')}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                            {product.sizes.map((size) => (
                                <span
                                    key={size}
                                    className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600"
                                >
                                    {size}
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={() => deleteProduct(product.id)}
                            className="mt-4 w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded transition-colors text-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
