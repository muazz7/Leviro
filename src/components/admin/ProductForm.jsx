import { useState } from 'react';
import { Upload, Link, Plus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductForm() {
    const { addProduct } = useStore();
    const [imageMode, setImageMode] = useState('url'); // 'url' or 'upload'
    const [imagePreview, setImagePreview] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        sizes: [],
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSizeToggle = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleImageUrl = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, image: url }));
        setImagePreview(url);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                setFormData(prev => ({ ...prev, image: result }));
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.image) newErrors.image = 'Product image is required';
        if (formData.sizes.length === 0) newErrors.sizes = 'Select at least one size';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        addProduct({
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            image: formData.image,
            sizes: formData.sizes.sort((a, b) => ALL_SIZES.indexOf(a) - ALL_SIZES.indexOf(b)),
        });

        // Reset form
        setFormData({
            name: '',
            price: '',
            description: '',
            image: '',
            sizes: [],
        });
        setImagePreview('');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            {/* Product Name */}
            <div>
                <label className="block text-sm font-medium text-black mb-1">
                    Product Name *
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 ${errors.name ? 'border-red-300' : 'border-gray-200'
                        }`}
                    placeholder="e.g., Premium White Cotton Panjabi"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-medium text-black mb-1">
                    Price (BDT) *
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 ${errors.price ? 'border-red-300' : 'border-gray-200'
                            }`}
                        placeholder="2850"
                        min="0"
                    />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-black mb-1">
                    Description *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 resize-none ${errors.description ? 'border-red-300' : 'border-gray-200'
                        }`}
                    placeholder="Describe the product, materials, occasion..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Size Availability */}
            <div>
                <label className="block text-sm font-medium text-black mb-2">
                    Available Sizes *
                </label>
                <div className="flex flex-wrap gap-2">
                    {ALL_SIZES.map((size) => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeToggle(size)}
                            className={`min-w-[48px] px-4 py-2 border text-sm font-medium transition-all rounded ${formData.sizes.includes(size)
                                    ? 'border-black bg-black text-white'
                                    : 'border-gray-200 hover:border-black'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                {errors.sizes && <p className="text-red-500 text-sm mt-1">{errors.sizes}</p>}
            </div>

            {/* Image Input */}
            <div>
                <label className="block text-sm font-medium text-black mb-2">
                    Product Image *
                </label>

                {/* Toggle Buttons */}
                <div className="flex gap-2 mb-3">
                    <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${imageMode === 'url'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Link className="w-4 h-4" />
                        Image URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${imageMode === 'upload'
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>

                {/* URL Input */}
                {imageMode === 'url' && (
                    <input
                        type="url"
                        value={formData.image}
                        onChange={handleImageUrl}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 ${errors.image ? 'border-red-300' : 'border-gray-200'
                            }`}
                        placeholder="https://example.com/image.jpg"
                    />
                )}

                {/* File Upload */}
                {imageMode === 'upload' && (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload image</p>
                        </label>
                    </div>
                )}

                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

                {/* Image Preview */}
                {imagePreview && (
                    <div className="mt-3">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            onError={() => setImagePreview('')}
                        />
                    </div>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                className="flex items-center gap-2 bg-black text-white px-6 py-3 font-medium text-sm hover:bg-gray-900 transition-colors"
            >
                <Plus className="w-4 h-4" />
                Add Product
            </button>
        </form>
    );
}
