import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; 
import MyBookings from './pages/MyBookings';
import AddRoom from './pages/AddRoom';
import OwnerDashboard from './pages/OwnerDashboard';
import MyRooms from './pages/MyRooms';
import AdminPanel from './pages/AdminPanel';
import EditRoom from './pages/EditRoom';
import './App.css'; 

function App() {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userEmail = localStorage.getItem('email');

  // Role and Email identify
  const isAdmin = userRole === 'Admin' || userEmail === 'kumara@gmail.com';
  const isOwner = userRole === 'Owner';
  const isStudent = userRole === 'Student';

  const handleLogout = () => {
    localStorage.clear(); // Token, Role, Email delete
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
              {/* Admin  */}
              {isAdmin && (
                <Link to="/admin" className="nav-link" style={{ color: '#f59e0b' }}>Admin Panel</Link>
              )}

              {/* Students */}
              {isStudent && (
                <Link to="/my-bookings" className="nav-link">My Bookings</Link>
              )}

              {/*Owners */}
              {isOwner && (
                <>
                  <Link to="/add-room" className="nav-link">Add Room</Link>
                  <Link to="/my-rooms" className="nav-link">My Rooms</Link>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </>
              )}

              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/edit-room/:id" element={<EditRoom />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/add-room" element={<AddRoom />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/my-rooms" element={<MyRooms />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;