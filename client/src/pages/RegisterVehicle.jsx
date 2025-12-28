import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  Truck, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  UploadCloud, 
  CreditCard,
  Hash,
  MapPin
} from 'lucide-react';

const RegisterVehicle = () => {
  const { register, handleSubmit, watch } = useForm();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  // Watch for file input changes to update custom UI
  const fileInput = watch('documents');
  if (fileInput && fileInput.length > 0 && fileInput[0].name !== fileName) {
      setFileName(fileInput[0].name + (fileInput.length > 1 ? ` + ${fileInput.length - 1} others` : ''));
  }

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('make', data.make);
    formData.append('model', data.model);
    formData.append('year', data.year);
    formData.append('vin', data.vin);
    formData.append('licensePlate', data.licensePlate);
    formData.append('ownerName', data.ownerName);
    formData.append('ownerContact', data.ownerContact);
    formData.append('expiryDate', data.expiryDate);

    if (data.documents.length > 0) {
      for (let i = 0; i < data.documents.length; i++) {
        formData.append('documents', data.documents[i]);
      }
    }

    try {
      await axios.post('http://localhost:5000/api/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Vehicle registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Register a New Vehicle
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Fill in the details below to submit your vehicle for registration approval.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <FileText size={20} /> Vehicle Information
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
                    placeholder="e.g. Toyota"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                  <input 
                    {...register('model', { required: true })} 
                    className="block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5 px-4"
                    placeholder="e.g. Camry"
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
                      placeholder="YYYY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN (Vehicle Identification Number)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash size={18} className="text-gray-400" />
                    </div>
                    <input 
                      {...register('vin', { required: true })} 
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5"
                      placeholder="17-character VIN"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Plate Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard size={18} className="text-gray-400" />
                    </div>
                    <input 
                      {...register('licensePlate', { required: true })} 
                      className="pl-10 block w-full border-gray-300 rounded-lg border focus:ring-blue-500 focus:border-blue-500 py-2.5 font-mono uppercase"
                      placeholder="ABC-1234"
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
                      placeholder="John Doe"
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
                      placeholder="+1 (555) 000-0000"
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

            {/* Documents Section */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 border-b pb-2">Documents</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Required Documents</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors bg-gray-50">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input id="file-upload" type="file" multiple {...register('documents')} className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                    {fileName && (
                        <p className="text-sm text-green-600 font-medium mt-2">
                            Selected: {fileName}
                        </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-all transform hover:scale-[1.01]"
              >
                {loading ? (
                   <span className="flex items-center gap-2">
                       <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                       Processing...
                   </span>
                ) : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterVehicle;
