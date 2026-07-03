import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantService, menuService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [restRes, menuRes] = await Promise.all([
        restaurantService.getById(id),
        menuService.getMenu(id)
      ]);
      setRestaurant(restRes.data);
      setMenu(menuRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
    setLoading(false);
  };

  const getItemQuantity = (itemId) => {
    const item = cart.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  if (loading) return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <p className="text-gray-500">Loading menu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1
          onClick={() => navigate('/')}
          className="text-2xl font-bold text-orange-500 cursor-pointer">
          😴 Snorlax 😴
        </h1>
        {cart.length > 0 && (
          <button
            onClick={() => navigate('/cart')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
            🛒 Cart ({cart.length}) · ₹{total}
          </button>
        )}
      </nav>

      {/* Restaurant Header */}
      <div className="bg-orange-500 text-white px-6 py-10">
        <button
          onClick={() => navigate('/')}
          className="text-orange-200 text-sm mb-3 hover:text-white">
          ← Back
        </button>
        <h2 className="text-3xl font-bold">{restaurant?.name}</h2>
        <p className="text-orange-100 mt-1">📍 {restaurant?.address}</p>
      </div>

      {/* Menu */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Menu</h3>
        {menu.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <p>No menu items yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {menu.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-800">{item.name}</h4>
                  <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                  <p className="text-orange-500 font-bold mt-2">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getItemQuantity(item.id) > 0 ? (
                    <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-1">
                      <button
                        onClick={() => addToCart(item, parseInt(id))}
                        className="bg-orange-500 text-white w-8 h-8 rounded-lg font-bold hover:bg-orange-600">
                        +
                      </button>
                      <span className="font-bold text-gray-800 w-4 text-center">
                        {getItemQuantity(item.id)}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!user) { navigate('/login'); return; }
                        addToCart(item, parseInt(id));
                      }}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;