import { useStore } from '../context/StoreContext';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export default function Toast() {
    const { toasts } = useStore();

    if (toasts.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="toast-enter flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-100 max-w-sm"
                >
                    {getIcon(toast.type)}
                    <p className="text-sm font-medium text-gray-800">{toast.message}</p>
                </div>
            ))}
        </div>
    );
}
