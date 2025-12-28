import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogIn, Mail, Lock, ArrowRight, User, Shield } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loginRole, setLoginRole] = useState(location.state?.role || 'user');

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      // Role validation
      if (loginRole === 'admin' && result.role !== 'admin') {
        alert('Access Denied: This account does not have administrator privileges.');
        logout(); // Logout immediately if role mismatch
        return;
      }

      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      alert(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:text-left">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="mt-8">
            {/* Role Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
              <button
                type="button"
                className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
                  loginRole === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setLoginRole('user')}
              >
                <User size={16} /> User Login
              </button>
              <button
                type="button"
                className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
                  loginRole === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setLoginRole('admin')}
              >
                <Shield size={16} /> Admin Login
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    {...register('email', { required: true })}
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition placeholder-gray-400"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && <span className="text-red-500 text-xs mt-1 ml-1">Email is required</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    {...register('password', { required: true })}
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <span className="text-red-500 text-xs mt-1 ml-1">Password is required</span>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Sign in <ArrowRight size={18} />
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <Link
                  to="/register"
                  className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Luxury Car"
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-40 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 p-20 text-white">
           <h1 className="text-4xl font-bold mb-4">Digital Vehicle Registration</h1>
           <p className="text-xl text-blue-100 max-w-md">Experience the future of vehicle management. Secure, fast, and completely paperless.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
