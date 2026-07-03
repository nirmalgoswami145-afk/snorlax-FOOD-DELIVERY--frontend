import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantService.getAll();
      setRestaurants(response.data);
    } catch (err) {
      console.error('Failed to fetch restaurants', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-500">😴 Snorlax 😴</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-600 text-sm">Hi, {user.email.split('@')[0]}</span>
              <button
                onClick={() => navigate('/my-orders')}
                className="text-orange-500 font-medium hover:underline text-sm">
                My Orders
              </button>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600">
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-orange-500 text-white text-center py-16 px-6">
        <h2 className="text-4xl font-bold mb-3">Hungry? We got you. 😴</h2>
        <p className="text-orange-100 text-lg">Order from the best restaurants near you</p>
      </div>

      {/* Restaurants */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Restaurants</h3>
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading restaurants...</div>
        ) : restaurants.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="text-5xl mb-4">🍽️</p>
            <p>No restaurants yet. Be the first to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(restaurant => (
              <div
                key={restaurant.id}
                onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden">
                <div className="bg-orange-100 h-36 flex items-center justify-center text-6xl">
                  🍜
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-800 text-lg">{restaurant.name}</h4>
                  <p className="text-gray-500 text-sm mt-1">📍 {restaurant.address}</p>
                  <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;