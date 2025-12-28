import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  MoreVertical,
  Filter,
  Trash2,
  Edit,
  Download
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
    fetchStats();
  }, [user]);

  // Reset selection when filter changes
  useEffect(() => {
    setSelectedVehicles([]);
  }, [filterStatus, searchQuery]);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/vehicles/stats', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

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

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this vehicle as ${status}?`)) return;

    try {
      await axios.put(
        `http://localhost:5000/api/vehicles/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      fetchVehicles(searchQuery); // Refresh list
      fetchStats();
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    try {
        await axios.delete(`http://localhost:5000/api/vehicles/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchVehicles(searchQuery);
        fetchStats();
    } catch (error) {
        alert('Failed to delete registration');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVehicles(filteredVehicles.map(v => v._id));
    } else {
      setSelectedVehicles([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedVehicles.includes(id)) {
      setSelectedVehicles(selectedVehicles.filter(item => item !== id));
    } else {
      setSelectedVehicles([...selectedVehicles, id]);
    }
  };

  const generateReport = () => {
    if (selectedVehicles.length === 0) {
      alert("Please select at least one application to download the report.");
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(41, 128, 185); // Blue
      doc.rect(0, 0, 210, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('Vehicle Registration Report', 14, 25);
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 35);
      doc.text(`Total Records: ${selectedVehicles.length}`, 160, 35);

      // Data preparation
      const tableColumn = ["Owner", "Email", "Vehicle", "VIN", "License Plate", "Status"];
      const tableRows = [];

      const selectedData = vehicles.filter(v => selectedVehicles.includes(v._id));

      selectedData.forEach(vehicle => {
        const vehicleData = [
          vehicle.ownerName,
          vehicle.user?.email || 'N/A',
          `${vehicle.make} ${vehicle.model}`,
          vehicle.vin,
          vehicle.licensePlate,
          vehicle.status
        ];
        tableRows.push(vehicleData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        styles: { fontSize: 9 },
      });

      doc.save(`vehicle_report_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while generating the report. Please try again.");
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filterStatus === 'all') return true;
    return vehicle.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage vehicle registrations and review applications</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
              <Filter size={20} />
            </button>
            <button 
              onClick={generateReport}
              className={`px-4 py-2 rounded-lg font-medium transition shadow-lg flex items-center gap-2 ${
                selectedVehicles.length > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={selectedVehicles.length === 0}
            >
              <Download size={18} /> Download Report {selectedVehicles.length > 0 && `(${selectedVehicles.length})`}
            </button>
          </div>
        </header>
        
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <button onClick={() => setFilterStatus('all')} className={`text-left p-6 rounded-2xl shadow-sm border transition duration-300 ${filterStatus === 'all' ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500' : 'bg-white border-gray-100 hover:shadow-md'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <span className="bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">All</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">Total Registrations</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </button>
            
            <button onClick={() => setFilterStatus('Pending')} className={`text-left p-6 rounded-2xl shadow-sm border transition duration-300 ${filterStatus === 'Pending' ? 'bg-yellow-50 border-yellow-200 ring-2 ring-yellow-500' : 'bg-white border-gray-100 hover:shadow-md'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <span className="bg-yellow-200 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">Action Req.</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">Pending Review</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pending}</p>
            </button>

            <button onClick={() => setFilterStatus('Approved')} className={`text-left p-6 rounded-2xl shadow-sm border transition duration-300 ${filterStatus === 'Approved' ? 'bg-green-50 border-green-200 ring-2 ring-green-500' : 'bg-white border-gray-100 hover:shadow-md'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-full">Active</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">Approved</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.approved}</p>
            </button>

            <button onClick={() => setFilterStatus('Rejected')} className={`text-left p-6 rounded-2xl shadow-sm border transition duration-300 ${filterStatus === 'Rejected' ? 'bg-red-50 border-red-200 ring-2 ring-red-500' : 'bg-white border-gray-100 hover:shadow-md'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-100 p-3 rounded-xl">
                  <XCircle className="text-red-600" size={24} />
                </div>
                <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded-full">Rejected</span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">Rejected</h3>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.rejected}</p>
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-gray-800">
                {filterStatus === 'all' ? 'All Applications' : `${filterStatus} Applications`}
              </h2>
               <form onSubmit={handleSearch} className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                      type="text" 
                      placeholder="Search VIN, Plate..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 transition"
                  />
              </form>
           </div>
          
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading registrations...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={filteredVehicles.length > 0 && selectedVehicles.length === filteredVehicles.length}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner Details</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle Info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">License Plate</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle._id} className={`hover:bg-gray-50 transition duration-150 ${selectedVehicles.includes(vehicle._id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedVehicles.includes(vehicle._id)}
                          onChange={() => handleSelectOne(vehicle._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {vehicle.ownerName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{vehicle.ownerName}</div>
                            <div className="text-sm text-gray-500">{vehicle.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{vehicle.make} {vehicle.model}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">VIN: {vehicle.vin}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono bg-gray-900 text-white px-3 py-1 rounded text-sm tracking-wider">
                          {vehicle.licensePlate}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          vehicle.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          vehicle.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {vehicle.status === 'Approved' && <CheckCircle size={12} />}
                          {vehicle.status === 'Rejected' && <XCircle size={12} />}
                          {vehicle.status === 'Pending' && <Clock size={12} />}
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            {vehicle.status === 'Pending' && (
                                <div className="flex gap-2 mr-2">
                                    <button
                                        onClick={() => handleStatusUpdate(vehicle._id, 'Approved')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition shadow-sm flex items-center gap-1"
                                        title="Approve Registration"
                                    >
                                        <CheckCircle size={14} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(vehicle._id, 'Rejected')}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition shadow-sm flex items-center gap-1"
                                        title="Reject Registration"
                                    >
                                        <XCircle size={14} /> Reject
                                    </button>
                                </div>
                            )}
                             <button 
                                onClick={() => navigate(`/edit-vehicle/${vehicle._id}`)}
                                className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition"
                                title="Edit"
                             >
                                <Edit size={18} />
                             </button>
                             <button 
                                onClick={() => handleDelete(vehicle._id)}
                                className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition"
                                title="Delete"
                             >
                                <Trash2 size={18} />
                             </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vehicles.length === 0 && (
                 <div className="p-10 text-center">
                    <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Search size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No registrations found</h3>
                    <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
