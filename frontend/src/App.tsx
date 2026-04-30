import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CollegeDetail from './pages/CollegeDetail';
import Compare from './pages/Compare';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CompareProvider>
        <Router>
          <div className="min-h-screen bg-background text-gray-900 font-sans flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/college/:id" element={<CollegeDetail />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
            <footer className="bg-white border-t border-gray-100 py-8 text-center text-gray-500 text-sm mt-auto">
              <p>&copy; {new Date().getFullYear()} CollegesHub. All rights reserved.</p>
            </footer>
          </div>
        </Router>
      </CompareProvider>
    </AuthProvider>
  );
};

export default App;
