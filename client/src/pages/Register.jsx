import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus, User, Shield, Key } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState('user');

  const onSubmit = async (data) => {
    const registrationData = { ...data, role };
    const result = await registerUser(registrationData);
    if (result.success) {
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      alert(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <UserPlus size={32} className="text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us to register and manage your vehicles
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
              role === 'user' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setRole('user')}
          >
            <User size={16} /> User Account
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
              role === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setRole('admin')}
          >
            <Shield size={16} /> Admin Account
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          
          {role === 'admin' && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <label className="block text-sm font-bold text-orange-800 mb-1 flex items-center gap-2">
                <Key size={16} /> Admin Secret Key
              </label>
              <input
                {...register('secretKey', { required: false })}
                type="password"
                className="input-field border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Required if other admins exist (default: admin123)"
              />
              <p className="text-xs text-orange-600 mt-1">
                * If you are the <b>first</b> admin, you can leave this blank.
                <br/>* Otherwise, enter the secret key provided by your system owner.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              {...register('name', { required: true })}
              className="input-field"
              placeholder="John Doe"
            />
            {errors.name && <span className="text-red-500 text-xs mt-1">Name is required</span>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              {...register('email', { required: true })}
              type="email"
              className="input-field"
              placeholder="john@example.com"
            />
            {errors.email && <span className="text-red-500 text-xs mt-1">Email is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password', { required: true })}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && <span className="text-red-500 text-xs mt-1">Password is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              {...register('phone', { required: true })}
              className="input-field"
              placeholder="+1 234 567 8900"
            />
            {errors.phone && <span className="text-red-500 text-xs mt-1">Phone is required</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              {...register('address', { required: true })}
              className="input-field"
              rows="3"
              placeholder="123 Main St, City, Country"
            ></textarea>
            {errors.address && <span className="text-red-500 text-xs mt-1">Address is required</span>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login here</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
