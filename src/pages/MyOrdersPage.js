import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';

const statusColors = {
  PLACED: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

 const fetchOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      const data = response.data;
      console.log('Orders data:', JSON.stringify(data));  // add this line
      setOrders(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-orange-500 cursor-pointer">
          😴 Snorlax 😴
        </h1>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-500">No orders yet</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600">
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <div key={order.id || index} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {order.restaurant?.name || 'Restaurant'}
                    </h4>
                    <p className="text-gray-500 text-sm mt-1">
                      Order #{order.id || index + 1}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status?.replace(/_/g, ' ') || 'PLACED'}
                  </span>
                </div>
                <div className="border-t pt-3">
                  {order.items?.map((item, i) => (
                    <div key={item.id || i} className="flex justify-between text-sm text-gray-600 py-1">
                      <span>{item.menuItem?.name || 'Item'} x{item.quantity}</span>
                      <span>₹{(item.priceAtOrderTime * item.quantity) || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;