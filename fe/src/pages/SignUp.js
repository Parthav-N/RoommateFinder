import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    userType: '',
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        role: formData.userType
      });
      navigate(formData.userType === 'user' ? '/onboarding' : '/lister-onboarding');
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20">
      <div className="container mx-auto px-4">
        <Link 
          to="/home" 
          className="inline-block mb-6 px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-white bg-white/10 hover:bg-white/20 border border-white/25"
        >
          ← Back to Home
        </Link>
        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 text-center text-lg">I want to be a:</label>
              <div className="flex gap-4">
                <label className="flex-1 p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-all duration-300 text-center">
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={formData.userType === 'user'}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="hidden"
                  />
                  <div className={`${formData.userType === 'user' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                    User
                  </div>
                </label>
                <label className="flex-1 p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-all duration-300 text-center">
                  <input
                    type="radio"
                    name="userType"
                    value="lister"
                    checked={formData.userType === 'lister'}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="hidden"
                  />
                  <div className={`${formData.userType === 'lister' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                    Lister
                  </div>
                </label>
              </div>
            </div>

            {formData.userType && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </button>
              </>
            )}
          </form>
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      {error && (
        <div className="mb-4 text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

export default SignUp;
