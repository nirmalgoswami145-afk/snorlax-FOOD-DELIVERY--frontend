import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService, menuService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [restForm, setRestForm] = useState({ name: '', address: '' });
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '' });
  const [loading, setLoading] = useState(false);
  const {  logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await restaurantService.getAll();
      if (res.data.length > 0) {
        setRestaurant(res.data[0]);
        const menuRes = await menuService.getMenu(res.data[0].id);
        setMenu(menuRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await restaurantService.create(restForm.name, restForm.address);
      setRestaurant(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await menuService.addItem(restaurant.id, menuForm.name, menuForm.description, parseFloat(menuForm.price));
      const menuRes = await menuService.getMenu(restaurant.id);
      setMenu(menuRes.data);
      setMenuForm({ name: '', description: '', price: '' });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 onClick={() => navigate('/')} className="text-2xl font-bold text-orange-500 cursor-pointer">
          😴 Snorlax 😴
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Owner Dashboard</span>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {!restaurant ? (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Your Restaurant</h2>
            <form onSubmit={handleCreateRestaurant} className="space-y-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
                value={restForm.name}
                onChange={e => setRestForm({...restForm, name: e.target.value})}
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
                value={restForm.address}
                onChange={e => setRestForm({...restForm, address: e.target.value})}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Restaurant'}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800">{restaurant.name}</h2>
              <p className="text-gray-500 mt-1">📍 {restaurant.address}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Add Menu Item</h3>
              <form onSubmit={handleAddMenuItem} className="space-y-3">
                <input
                  type="text"
                  placeholder="Item Name"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
                  value={menuForm.name}
                  onChange={e => setMenuForm({...menuForm, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
                  value={menuForm.description}
                  onChange={e => setMenuForm({...menuForm, description: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
                  value={menuForm.price}
                  onChange={e => setMenuForm({...menuForm, price: e.target.value})}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
                  {loading ? 'Adding...' : 'Add Item'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Your Menu ({menu.length} items)</h3>
              {menu.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No items yet — add your first dish!</p>
              ) : (
                <div className="space-y-3">
                  {menu.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-500 text-sm">{item.description}</p>
                      </div>
                      <p className="font-bold text-orange-500">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;