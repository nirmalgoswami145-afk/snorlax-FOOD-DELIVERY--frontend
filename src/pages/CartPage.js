import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';

const CartPage = () => {
  const { cart, restaurantId, removeFromCart, clearCart, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const itemQuantities = {};
      cart.forEach(item => {
        itemQuantities[item.id] = item.quantity;
      });
      await orderService.placeOrder(restaurantId, itemQuantities);
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center">
      <p className="text-6xl mb-4">🛒</p>
      <p className="text-gray-500 text-lg">Your cart is empty</p>
      <button
        onClick={() => navigate('/')}
        className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600">
        Browse Restaurants
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-orange-500 cursor-pointer">
          😴 Snorlax 😴
        </h1>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center p-4 border-b last:border-0">
              <div>
                <h4 className="font-medium text-gray-800">{item.name}</h4>
                <p className="text-gray-500 text-sm">x{item.quantity}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-orange-500">₹{item.price * item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-600 text-sm">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800 text-lg">Total</span>
            <span className="font-bold text-orange-500 text-xl">₹{total}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50">
          {loading ? 'Placing Order...' : 'Place Order 🎉'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;