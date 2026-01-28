import { useState } from 'react';
import { Trash2, Edit2, X, Save, Link, Upload } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductList() {
    const { products, deleteProduct, updateProduct } = useStore();
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [imageMode, setImageMode] = useState('url');
    const [isUpdating, setIsUpdating] = useState(false);

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No products added yet</p>
            </div>
        );
    }

    const handleEditClick = (product) => {
        setEditingProduct(product.id);
        setEditForm({
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
            image: product.image,
            sizes: [...product.sizes],
        });
        setImageMode('url');
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setEditForm({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeToggle = (size) => {
        setEditForm(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setEditForm(prev => ({ ...prev, image: event.target?.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveEdit = async () => {
        if (!editForm.name.trim() || !editForm.price || editForm.sizes.length === 0) {
            return;
        }

        setIsUpdating(true);
        const success = await updateProduct(editingProduct, {
            name: editForm.name,
            price: parseFloat(editForm.price),
            description: editForm.description,
            image: editForm.image,
            sizes: editForm.sizes.sort((a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b)),
        });

        if (success) {
            setEditingProduct(null);
            setEditForm({});
        }
        setIsUpdating(false);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-lg overflow-hidden"
                >
                    {editingProduct === product.id ? (
                        // Edit Mode
                        <div className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-black text-sm">Edit Product</h3>
                                <button
                                    onClick={handleCancelEdit}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Image Preview */}
                            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                                <img
                                    src={editForm.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Image Input */}
                            <div>
                                <div className="flex gap-2 mb-2">
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('url')}
                                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${imageMode === 'url' ? 'bg-black text-white' : 'bg-gray-100'}`}
                                    >
                                        <Link className="w-3 h-3" />
                                        URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageMode('upload')}
                                        className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${imageMode === 'upload' ? 'bg-black text-white' : 'bg-gray-100'}`}
                                    >
                                        <Upload className="w-3 h-3" />
                                        Upload
                                    </button>
                                </div>
                                {imageMode === 'url' ? (
                                    <input
                                        type="url"
                                        name="image"
                                        value={editForm.image}
                                        onChange={handleEditChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                        placeholder="Image URL"
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full text-sm"
                                    />
                                )}
                            </div>

                            {/* Name */}
                            <input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                placeholder="Product name"
                            />

                            {/* Price */}
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">৳</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={editForm.price}
                                    onChange={handleEditChange}
                                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                                    placeholder="Price"
                                />
                            </div>

                            {/* Description */}
                            <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                rows={2}
                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black resize-none"
                                placeholder="Description"
                            />

                            {/* Sizes */}
                            <div>
                                <p className="text-xs text-gray-500 mb-2">Sizes</p>
                                <div className="flex flex-wrap gap-1">
                                    {ALL_SIZES.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => handleSizeToggle(size)}
                                            className={`px-2 py-1 text-xs border rounded ${editForm.sizes.includes(size)
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-200 hover:border-black'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSaveEdit}
                                disabled={isUpdating}
                                className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded text-sm hover:bg-gray-900 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    ) : (
                        // View Mode
                        <>
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
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleEditClick(product)}
                                        className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 py-2 rounded transition-colors text-sm"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        className="flex-1 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded transition-colors text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
