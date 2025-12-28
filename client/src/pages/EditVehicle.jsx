import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  Truck, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  CreditCard,
  Hash,
  ArrowLeft
} from 'lucide-react';

const EditVehicle = () => {
  const { id } = useParams();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        
        // Populate form
        setValue('type', data.type);
        setValue('make', data.make);
        setValue('model', data.model);
        setValue('year', data.year);
        setValue('vin', data.vin);
        setValue('licensePlate', data.licensePlate);
        setValue('ownerName', data.ownerName);
        setValue('ownerContact', data.ownerContact);
        // Format date to YYYY-MM-DD for input
        setValue('expiryDate', data.expiryDate.split('T')[0]);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load vehicle details');
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, user, setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');

    try {
      await axios.put(`http://localhost:5000/api/vehicles/${id}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Vehicle update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Edit Vehicle Registration
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Update the details of your vehicle registration.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <FileText size={20} /> Edit Information
            </h3>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Vehicle Details Section */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 border-b pb-2">Vehicle Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Truck size={18} className="text-gray-400" />
                    </div>
                    <select 
                      {...register('type', { required: true })} 
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5"
                    >
                      <option value="">Select Type</option>
                      <option value="Car">Car</option>
                      <option value="Truck">Truck</option>
                      <option value="Bike">Motorcycle</option>
                      <option value="Bus">Bus</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                  <input 
                    {...register('make', { required: true })} 
                    className="block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5 px-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input 
                    {...register('model', { required: true })} 
                    className="block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5 px-4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="number" 
                      {...register('year', { required: true })} 
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash size={18} className="text-gray-400" />
                    </div>
                    <input 
                      {...register('vin', { required: true })} 
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard size={18} className="text-gray-400" />
                    </div>
                    <input 
                      {...register('licensePlate', { required: true })} 
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5 font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Details Section */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 border-b pb-2">Owner Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input 
                      {...register('ownerName', { required: true })} 
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input 
                      {...register('ownerContact', { required: true })} 
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5"
                    />
                  </div>
                </div>
                
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Expiry Date</label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="date" 
                      {...register('expiryDate', { required: true })} 
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-all transform hover:scale-[1.01]"
              >
                {submitting ? 'Updating...' : 'Update Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditVehicle;