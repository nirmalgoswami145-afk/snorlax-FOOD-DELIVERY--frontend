import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let response;
      if (isLogin) {
        response = await authService.login(formData.email, formData.password);
      } else {
        response = await authService.register(formData);
      }
      const { token, role } = response.data;
      login({ email: formData.email, role }, token);
      if (role === 'RESTAURANT_OWNER') {
        navigate('/owner-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500">😴 Snorlax</h1>
          <p className="text-gray-500 mt-2">Food delivery, the lazy way</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 rounded-lg font-medium transition ${isLogin ? 'bg-white shadow text-orange-500' : 'text-gray-500'}`}
            onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-medium transition ${!isLogin ? 'bg-white shadow text-orange-500' : 'text-gray-500'}`}
            onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          {!isLogin && (
            <select
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-400"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="CUSTOMER">Customer</option>
              <option value="RESTAURANT_OWNER">Restaurant Owner</option>
              <option value="DELIVERY_AGENT">Delivery Agent</option>
            </select>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50">
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;