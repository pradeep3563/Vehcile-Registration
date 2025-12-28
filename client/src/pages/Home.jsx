import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, FileText, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-600 bg-opacity-30 border border-blue-400 text-blue-100 text-sm font-semibold tracking-wide uppercase">
            Official Government Portal
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            Vehicle Registration <br className="hidden md:block" />
            <span className="text-blue-300">Made Simple & Secure</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 font-light">
            Skip the lines. Register your vehicle, renew licenses, and manage documents from the comfort of your home.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link to="/register" className="bg-white text-blue-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Get Started Now <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-800 transition shadow-lg flex items-center justify-center">
              Login to Account
            </Link>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-10 shadow-sm relative z-20 -mt-10 mx-4 md:mx-auto max-w-5xl rounded-xl border border-gray-100 flex flex-col md:flex-row justify-around items-center text-center gap-8">
        <div>
            <h3 className="text-4xl font-bold text-blue-600">10k+</h3>
            <p className="text-gray-500 font-medium">Vehicles Registered</p>
        </div>
        <div className="w-full md:w-px h-px md:h-16 bg-gray-200"></div>
        <div>
            <h3 className="text-4xl font-bold text-blue-600">99%</h3>
            <p className="text-gray-500 font-medium">Approval Rate</p>
        </div>
        <div className="w-full md:w-px h-px md:h-16 bg-gray-200"></div>
        <div>
            <h3 className="text-4xl font-bold text-blue-600">24h</h3>
            <p className="text-gray-500 font-medium">Average Processing</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto py-24 px-6">
        <div className="text-center mb-16">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2">Features</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose Our Platform?</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 group">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition duration-300">
              <ShieldCheck size={32} className="text-blue-600 group-hover:text-white transition duration-300" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Secure & Reliable</h3>
            <p className="text-gray-600 leading-relaxed">
                Your data is protected with top-tier encryption and secure authentication protocols. We prioritize your privacy.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 group">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition duration-300">
              <Clock size={32} className="text-indigo-600 group-hover:text-white transition duration-300" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Fast Processing</h3>
            <p className="text-gray-600 leading-relaxed">
                Quick application reviews and status updates. No more long queues or waiting for weeks.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100 group">
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition duration-300">
              <FileText size={32} className="text-purple-600 group-hover:text-white transition duration-300" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Digital Records</h3>
            <p className="text-gray-600 leading-relaxed">
                Access your vehicle documents and registration history anytime, anywhere. 100% paperless.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-gray-50 py-24 px-6">
          <div className="container mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Get your vehicle registered in 3 simple steps.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="relative">
                    <div className="bg-white p-8 rounded-xl shadow-md z-10 relative">
                        <span className="text-6xl font-bold text-blue-100 absolute top-4 right-4">1</span>
                        <h3 className="text-xl font-bold mb-4 relative z-10">Create Account</h3>
                        <p className="text-gray-600 relative z-10">Sign up for a free account using your email and personal details.</p>
                    </div>
                </div>
                <div className="relative">
                     <div className="bg-white p-8 rounded-xl shadow-md z-10 relative">
                        <span className="text-6xl font-bold text-blue-100 absolute top-4 right-4">2</span>
                        <h3 className="text-xl font-bold mb-4 relative z-10">Submit Details</h3>
                        <p className="text-gray-600 relative z-10">Enter vehicle information and upload necessary documents securely.</p>
                    </div>
                </div>
                <div className="relative">
                     <div className="bg-white p-8 rounded-xl shadow-md z-10 relative">
                        <span className="text-6xl font-bold text-blue-100 absolute top-4 right-4">3</span>
                        <h3 className="text-xl font-bold mb-4 relative z-10">Get Approved</h3>
                        <p className="text-gray-600 relative z-10">Receive digital registration instantly after admin verification.</p>
                    </div>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Home;
