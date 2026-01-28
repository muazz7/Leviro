import { useState, useEffect } from 'react';
import { LogOut, Package, ShoppingBag, Settings, Check } from 'lucide-react';
import OrdersTable from '../components/admin/OrdersTable';
import ProductForm from '../components/admin/ProductForm';
import ProductList from '../components/admin/ProductList';

// Default credentials
const DEFAULT_CREDENTIALS = { username: 'admin', password: '1234' };

export default function Admin({ onLogout }) {
    // Load credentials from localStorage or use defaults
    const [credentials, setCredentials] = useState(() => {
        const saved = localStorage.getItem('leviro_admin_credentials');
        return saved ? JSON.parse(saved) : DEFAULT_CREDENTIALS;
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('orders');
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');

    // Settings form state
    const [settingsForm, setSettingsForm] = useState({
        currentUsername: '',
        currentPassword: '',
        newUsername: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [settingsError, setSettingsError] = useState('');
    const [settingsSuccess, setSettingsSuccess] = useState('');

    // Persist credentials to localStorage
    useEffect(() => {
        localStorage.setItem('leviro_admin_credentials', JSON.stringify(credentials));
    }, [credentials]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginForm.username === credentials.username && loginForm.password === credentials.password) {
            setIsLoggedIn(true);
            setLoginError('');
        } else {
            setLoginError('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoginForm({ username: '', password: '' });
        if (onLogout) onLogout();
    };

    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setSettingsForm(prev => ({ ...prev, [name]: value }));
        setSettingsError('');
        setSettingsSuccess('');
    };

    const handleCredentialsUpdate = (e) => {
        e.preventDefault();
        setSettingsError('');
        setSettingsSuccess('');

        // Validate current credentials
        if (settingsForm.currentUsername !== credentials.username ||
            settingsForm.currentPassword !== credentials.password) {
            setSettingsError('Current username or password is incorrect');
            return;
        }

        // Validate new credentials
        if (!settingsForm.newUsername.trim()) {
            setSettingsError('New username is required');
            return;
        }

        if (!settingsForm.newPassword.trim()) {
            setSettingsError('New password is required');
            return;
        }

        if (settingsForm.newPassword.length < 4) {
            setSettingsError('Password must be at least 4 characters');
            return;
        }

        if (settingsForm.newPassword !== settingsForm.confirmPassword) {
            setSettingsError('New passwords do not match');
            return;
        }

        // Update credentials
        setCredentials({
            username: settingsForm.newUsername.trim(),
            password: settingsForm.newPassword,
        });

        // Reset form
        setSettingsForm({
            currentUsername: '',
            currentPassword: '',
            newUsername: '',
            newPassword: '',
            confirmPassword: '',
        });

        setSettingsSuccess('Credentials updated successfully!');
    };

    // Login Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold text-center text-black mb-2">
                            LEVIRO
                        </h1>
                        <p className="text-center text-gray-500 text-sm mb-8">
                            Admin Dashboard
                        </p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={loginForm.username}
                                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                                    placeholder="Enter username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                                    placeholder="Enter password"
                                />
                            </div>

                            {loginError && (
                                <p className="text-red-500 text-sm">{loginError}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 font-medium text-sm hover:bg-gray-900 transition-colors"
                            >
                                Login
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        );
    }

    // Dashboard
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold text-black">LEVIRO</h1>
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">Admin</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href="/"
                                className="text-sm text-gray-500 hover:text-black transition-colors"
                            >
                                View Store
                            </a>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders'
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-500 hover:text-black'
                                }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'products'
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-500 hover:text-black'
                                }`}
                        >
                            <Package className="w-4 h-4" />
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'settings'
                                ? 'border-black text-black'
                                : 'border-transparent text-gray-500 hover:text-black'
                                }`}
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium text-black mb-6">Order Management</h2>
                        <OrdersTable />
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-medium text-black mb-6">Add New Product</h2>
                            <ProductForm />
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-medium text-black mb-6">Active Products</h2>
                            <ProductList />
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white rounded-lg shadow-sm p-6 max-w-lg">
                        <h2 className="text-lg font-medium text-black mb-6">Change Login Credentials</h2>

                        <form onSubmit={handleCredentialsUpdate} className="space-y-6">
                            {/* Current Credentials */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Verify Current Credentials
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Current Username *
                                    </label>
                                    <input
                                        type="text"
                                        name="currentUsername"
                                        value={settingsForm.currentUsername}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                                        placeholder="Enter current username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Current Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={settingsForm.currentPassword}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>

                            {/* New Credentials */}
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                    Set New Credentials
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        New Username *
                                    </label>
                                    <input
                                        type="text"
                                        name="newUsername"
                                        value={settingsForm.newUsername}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                                        placeholder="Enter new username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        New Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={settingsForm.newPassword}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                                        placeholder="Enter new password (min 4 characters)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Confirm New Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={settingsForm.confirmPassword}
                                        onChange={handleSettingsChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            {/* Error/Success Messages */}
                            {settingsError && (
                                <p className="text-red-500 text-sm">{settingsError}</p>
                            )}
                            {settingsSuccess && (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <Check className="w-4 h-4" />
                                    {settingsSuccess}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-3 font-medium text-sm hover:bg-gray-900 transition-colors"
                            >
                                Update Credentials
                            </button>
                        </form>

                        <p className="text-gray-400 text-xs mt-6">
                            Note: Credentials are stored locally in your browser.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
