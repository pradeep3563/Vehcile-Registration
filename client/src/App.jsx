import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RegisterVehicle from './pages/RegisterVehicle';
import EditVehicle from './pages/EditVehicle';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/register-vehicle" 
                element={
                  <PrivateRoute>
                    <RegisterVehicle />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/edit-vehicle/:id" 
                element={
                  <PrivateRoute>
                    <EditVehicle />
                  </PrivateRoute>
                } 
              />
               <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
          
          {/* Footer */}
          <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0">
                  <span className="text-2xl font-bold text-white flex items-center gap-2">
                    VehicleReg
                  </span>
                  <p className="mt-2 text-sm">Secure. Fast. Reliable.</p>
                </div>
                <div className="flex gap-6 text-sm">
                  <a href="#" className="hover:text-white transition">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition">Terms of Service</a>
                  <a href="#" className="hover:text-white transition">Contact Support</a>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                 <p>&copy; {new Date().getFullYear()} Vehicle Registration System. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
