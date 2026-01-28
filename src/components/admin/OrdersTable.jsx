import { useStore } from '../../context/StoreContext';

export default function OrdersTable() {
    const { orders, updateOrderStatus } = useStore();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-50 text-green-700';
            case 'Pending':
                return 'bg-yellow-50 text-yellow-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No orders yet</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Mobile</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Products</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                                <span className="font-mono text-sm text-black">{order.id}</span>
                            </td>
                            <td className="py-4 px-4">
                                <p className="text-sm font-medium text-black">{order.customer.name}</p>
                                <p className="text-xs text-gray-500">
                                    {order.customer.district}, {order.customer.thana}
                                </p>
                            </td>
                            <td className="py-4 px-4">
                                <span className="text-sm text-gray-600">{order.customer.mobile}</span>
                            </td>
                            <td className="py-4 px-4">
                                <div className="space-y-1">
                                    {order.items.map((item, idx) => (
                                        <p key={idx} className="text-sm text-gray-600">
                                            {item.name} ({item.size}) × {item.quantity}
                                        </p>
                                    ))}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <span className="font-semibold text-black">
                                    ৳ {order.total.toLocaleString('en-BD')}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    className={`text-sm font-medium px-3 py-1.5 rounded-full cursor-pointer ${getStatusColor(order.status)}`}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
