import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const StoreContext = createContext();

// Fallback products if Supabase is not configured
const fallbackProducts = [];

export function StoreProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState(() => {
        // Cart still uses localStorage for user session
        const saved = localStorage.getItem('leviro_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

    // Fetch products from Supabase
    const fetchProducts = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Connection successful - set this BEFORE checking data length
            setIsSupabaseConnected(true);

            if (data && data.length > 0) {
                setProducts(data);
            } else {
                // Empty database, start with empty products array
                setProducts([]);
            }
        } catch (error) {
            console.warn('Supabase not configured, using fallback products:', error.message);
            setProducts(fallbackProducts);
            setIsSupabaseConnected(false);
        }
    }, []);

    // Fetch orders from Supabase
    const fetchOrders = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                // Transform data to match expected format
                const transformedOrders = data.map(order => ({
                    id: order.id,
                    customer: {
                        name: order.customer_name,
                        mobile: order.customer_mobile,
                        district: order.customer_district,
                        thana: order.customer_thana,
                        address: order.customer_address,
                        paymentMethod: order.payment_method,
                    },
                    items: order.items,
                    total: order.total,
                    status: order.status,
                    createdAt: order.created_at,
                }));
                setOrders(transformedOrders);
                setIsSupabaseConnected(true);
            }
        } catch (error) {
            console.warn('Could not fetch orders:', error.message);
            // Use localStorage fallback for orders
            const saved = localStorage.getItem('leviro_orders');
            if (saved) setOrders(JSON.parse(saved));
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchOrders()]);
            setLoading(false);
        };
        loadData();
    }, [fetchProducts, fetchOrders]);

    // Persist cart to localStorage
    useEffect(() => {
        localStorage.setItem('leviro_cart', JSON.stringify(cart));
    }, [cart]);

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
    const placeOrder = async (customerInfo) => {
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;

        const orderData = {
            id: orderId,
            customer_name: customerInfo.name,
            customer_mobile: customerInfo.mobile,
            customer_district: customerInfo.district,
            customer_thana: customerInfo.thana,
            customer_address: customerInfo.address,
            payment_method: customerInfo.paymentMethod || 'cod',
            items: cart,
            total: getCartTotal(),
            status: 'Pending',
        };

        try {
            if (isSupabaseConnected) {
                const { error } = await supabase.from('orders').insert([orderData]);
                if (error) throw error;
            } else {
                // Fallback to localStorage
                const saved = localStorage.getItem('leviro_orders');
                const localOrders = saved ? JSON.parse(saved) : [];
                localOrders.unshift({
                    id: orderId,
                    customer: customerInfo,
                    items: [...cart],
                    total: getCartTotal(),
                    status: 'Pending',
                    createdAt: new Date().toISOString(),
                });
                localStorage.setItem('leviro_orders', JSON.stringify(localOrders));
            }

            // Refresh orders
            await fetchOrders();
            clearCart();
            showToast('Order placed successfully! We will contact you shortly.');
            return { id: orderId };
        } catch (error) {
            console.error('Error placing order:', error);
            showToast('Error placing order. Please try again.', 'error');
            return null;
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            if (isSupabaseConnected) {
                const { error } = await supabase
                    .from('orders')
                    .update({ status })
                    .eq('id', orderId);
                if (error) throw error;
            }

            // Update local state
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status } : order
            ));
        } catch (error) {
            console.error('Error updating order status:', error);
            showToast('Error updating order status', 'error');
        }
    };

    // Product functions
    const addProduct = async (product) => {
        const newProduct = {
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image,
            sizes: product.sizes,
        };

        try {
            if (isSupabaseConnected) {
                const { data, error } = await supabase
                    .from('products')
                    .insert([newProduct])
                    .select()
                    .single();
                if (error) throw error;
                setProducts([...products, data]);
            } else {
                // Fallback
                const localProduct = { ...newProduct, id: Date.now().toString() };
                setProducts([...products, localProduct]);
            }
            showToast('Product added successfully');
        } catch (error) {
            console.error('Error adding product:', error);
            // Show the actual error message for debugging
            const errorMsg = error?.message || 'Unknown error';
            showToast(`Error adding product: ${errorMsg}`, 'error');
        }
    };

    const deleteProduct = async (productId) => {
        try {
            if (isSupabaseConnected) {
                // Call Supabase DELETE and wait for confirmation
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', productId);

                if (error) throw error;

                // Only update local state AFTER Supabase confirms deletion
                setProducts(products.filter(p => p.id !== productId));
                showToast('Product deleted');
            } else {
                // Fallback for local-only mode
                setProducts(products.filter(p => p.id !== productId));
                showToast('Product deleted (local only)');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('Error deleting product', 'error');
            // Product remains in UI since deletion failed
        }
    };

    // Update existing product
    const updateProduct = async (productId, updatedData) => {
        try {
            if (isSupabaseConnected) {
                const { data, error } = await supabase
                    .from('products')
                    .update({
                        name: updatedData.name,
                        price: updatedData.price,
                        description: updatedData.description,
                        image: updatedData.image,
                        sizes: updatedData.sizes,
                    })
                    .eq('id', productId)
                    .select()
                    .single();

                if (error) throw error;

                // Update local state with the returned data
                setProducts(products.map(p => p.id === productId ? data : p));
                showToast('Product updated successfully');
                return true;
            } else {
                // Fallback for local-only mode
                setProducts(products.map(p =>
                    p.id === productId ? { ...p, ...updatedData } : p
                ));
                showToast('Product updated (local only)');
                return true;
            }
        } catch (error) {
            console.error('Error updating product:', error);
            const errorMsg = error?.message || 'Unknown error';
            showToast(`Error updating product: ${errorMsg}`, 'error');
            return false;
        }
    };

    // Refresh data function for admin
    const refreshData = async () => {
        await Promise.all([fetchProducts(), fetchOrders()]);
    };

    return (
        <StoreContext.Provider
            value={{
                products,
                cart,
                orders,
                toasts,
                loading,
                isSupabaseConnected,
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
                updateProduct,
                deleteProduct,
                refreshData,
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
