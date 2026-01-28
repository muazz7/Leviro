import { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

// Initial sample products
const initialProducts = [
    {
        id: '1',
        name: 'Premium White Cotton Panjabi',
        price: 2850,
        description: 'Crafted from the finest Egyptian cotton, this premium white Panjabi features intricate embroidery on the collar and cuffs. Perfect for weddings, Eid, and special occasions.',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    {
        id: '2',
        name: 'Royal Navy Blue Silk Panjabi',
        price: 4250,
        description: 'A stunning navy blue Panjabi made from premium Indian silk. Features elegant gold thread work on the chest and collar. Ideal for formal events and celebrations.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
        sizes: ['S', 'M', 'L', 'XL'],
    },
    {
        id: '3',
        name: 'Classic Cream Linen Panjabi',
        price: 3150,
        description: 'A timeless cream-colored Panjabi crafted from breathable linen. Minimalist design with subtle texture, perfect for both casual and semi-formal occasions.',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
        sizes: ['M', 'L', 'XL', 'XXL'],
    },
];

export function StoreProvider({ children }) {
    // Initialize state from localStorage or defaults
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('leviro_products');
        return saved ? JSON.parse(saved) : initialProducts;
    });

    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('leviro_cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('leviro_orders');
        return saved ? JSON.parse(saved) : [];
    });

    const [toasts, setToasts] = useState([]);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('leviro_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('leviro_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('leviro_orders', JSON.stringify(orders));
    }, [orders]);

    // Toast functions
    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    // Cart functions
    const addToCart = (product, size) => {
        const existingIndex = cart.findIndex(
            item => item.productId === product.id && item.size === size
        );

        if (existingIndex > -1) {
            const newCart = [...cart];
            newCart[existingIndex].quantity += 1;
            setCart(newCart);
        } else {
            setCart([
                ...cart,
                {
                    id: Date.now().toString(),
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size,
                    quantity: 1,
                },
            ]);
        }
        showToast(`${product.name} (${size}) added to cart`);
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const updateCartQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(itemId);
            return;
        }
        setCart(cart.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    // Order functions
    const placeOrder = (customerInfo) => {
        const order = {
            id: `ORD-${Date.now().toString().slice(-6)}`,
            customer: customerInfo,
            items: [...cart],
            total: getCartTotal(),
            status: 'Pending',
            createdAt: new Date().toISOString(),
        };
        setOrders([order, ...orders]);
        clearCart();
        showToast('Order placed successfully! We will contact you shortly.');
        return order;
    };

    const updateOrderStatus = (orderId, status) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status } : order
        ));
    };

    // Product functions
    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Date.now().toString(),
        };
        setProducts([...products, newProduct]);
        showToast('Product added successfully');
    };

    const deleteProduct = (productId) => {
        setProducts(products.filter(p => p.id !== productId));
        showToast('Product deleted');
    };

    return (
        <StoreContext.Provider
            value={{
                products,
                cart,
                orders,
                toasts,
                showToast,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                placeOrder,
                updateOrderStatus,
                addProduct,
                deleteProduct,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
