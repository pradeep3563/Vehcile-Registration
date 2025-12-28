import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { PlusCircle, Search, Calendar, Hash, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, Trash2, Edit, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  const fetchVehicles = async (query = '') => {
    try {
      setLoading(true);
      const url = query 
        ? `http://localhost:5000/api/vehicles/search?query=${query}`
        : 'http://localhost:5000/api/vehicles';
      
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setVehicles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVehicles(searchQuery);
  };

  const handleRenew = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to renew this registration for 1 year?')) return;
    
    try {
      await axios.put(`http://localhost:5000/api/vehicles/${vehicleId}/renew`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert('Registration renewed successfully!');
      fetchVehicles();
    } catch (error) {
      console.error(error);
      alert('Failed to renew registration');
    }
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;

    try {
        await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setVehicles(vehicles.filter(v => v._id !== vehicleId));
    } catch (error) {
        alert('Failed to delete registration');
    }
  };

  const generatePDF = (vehicle) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text("Vehicle Registration Certificate", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 105, 30, null, null, "center");
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Vehicle Details
    doc.autoTable({
        startY: 45,
        head: [['Field', 'Details']],
        body: [
            ['Owner Name', vehicle.ownerName],
            ['Owner Contact', vehicle.ownerContact],
            ['Make & Model', `${vehicle.make} ${vehicle.model}`],
            ['Vehicle Type', vehicle.type],
            ['Year', vehicle.year],
            ['VIN', vehicle.vin],
            ['License Plate', vehicle.licensePlate],
            ['Registration Date', new Date(vehicle.registrationDate).toLocaleDateString()],
            ['Expiry Date', new Date(vehicle.expiryDate).toLocaleDateString()],
            ['Status', vehicle.status]
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 12, cellPadding: 3 }
    });

    // Footer
    doc.setFontSize(10);
    doc.text("This is a computer-generated document and needs no signature.", 105, 280, null, null, "center");

    doc.save(`Vehicle_Reg_${vehicle.licensePlate}.pdf`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
           <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>
        <Link 
            to="/register-vehicle" 
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg transform hover:scale-105"
        >
            <PlusCircle size={20} /> Register New Vehicle
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">My Vehicles</h2>
            <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2 relative">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by VIN or Plate" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition">
                    Search
                </button>
            </form>
         </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
             const isExpired = new Date(vehicle.expiryDate) < new Date();
             return (
                <div key={vehicle._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
                  <div className={`h-2 w-full ${
                      vehicle.status === 'Approved' ? 'bg-green-500' :
                      vehicle.status === 'Rejected' ? 'bg-red-500' :
                      'bg-yellow-500'
                  }`}></div>
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-xl text-gray-800">{vehicle.make} {vehicle.model}</h3>
                            <p className="text-gray-500 text-sm">{vehicle.year} • {vehicle.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            vehicle.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            vehicle.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                            {vehicle.status === 'Approved' && <CheckCircle size={12} />}
                            {vehicle.status === 'Rejected' && <XCircle size={12} />}
                            {vehicle.status === 'Pending' && <AlertCircle size={12} />}
                            {vehicle.status}
                        </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                            <Hash size={16} className="text-gray-400" />
                            <span className="font-mono">{vehicle.licensePlate}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <FileText size={16} className="text-gray-400" />
                            <span className="font-mono text-xs">{vehicle.vin}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <span className={isExpired ? "text-red-500 font-bold" : ""}>
                                Expires: {new Date(vehicle.expiryDate).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                    {vehicle.status === 'Approved' && (
                        <button 
                            onClick={() => generatePDF(vehicle)}
                            className="col-span-2 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
                        >
                            <Download size={16} /> Certificate
                        </button>
                    )}
                    
                    <button 
                        onClick={() => navigate(`/edit-vehicle/${vehicle._id}`)}
                        className="flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
                    >
                        <Edit size={16} /> Edit
                    </button>
                    
                    <button 
                        onClick={() => handleDelete(vehicle._id)}
                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                        <Trash2 size={16} /> Delete
                    </button>

                    {isExpired && (
                       <button 
                         onClick={() => handleRenew(vehicle._id)}
                         className="col-span-2 mt-2 bg-orange-50 text-orange-600 border border-orange-200 py-2 rounded-lg font-bold hover:bg-orange-100 transition flex items-center justify-center gap-2"
                       >
                         <RefreshCw size={16} /> Renew Registration
                       </button>
                    )}
                  </div>
                </div>
             );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Vehicles Found</h3>
            <p className="text-gray-500 mb-6">You haven't registered any vehicles yet.</p>
            <Link 
                to="/register-vehicle" 
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition"
            >
                Register Your First Vehicle
            </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
