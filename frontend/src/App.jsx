import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import AddRoom from './pages/AddRoom';
import OwnerDashboard from './pages/OwnerDashboard';
import MyRooms from './pages/MyRooms';
import './App.css'; 

function App() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          Campus<span>Stay</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          
          {token ? (
            <>
              <Link to="/my-bookings" className="nav-link">My Bookings</Link>
              <Link to="/add-room" className="nav-link">Add Room</Link>
              <Link to="/my-rooms" className="nav-link">My Rooms</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/add-room" element={<AddRoom />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/my-rooms" element={<MyRooms />} />
      </Routes>
    </Router>
  );
}

export default App;