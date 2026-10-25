import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import AddRoom from './pages/AddRoom';

function App() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav style={{ padding: '15px', backgroundColor: '#2c3e50', marginBottom: '20px' }}>
        <h2 style={{ color: 'white', display: 'inline', marginRight: '30px' }}>CampusStay</h2>
        <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Home</Link>
        
        {token ? (
          <>
            <Link to="/my-bookings" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>My Bookings</Link>
            <Link to="/add-room" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Add Room</Link>
            <button 
              onClick={handleLogout} 
              style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/add-room" element={<AddRoom />} />
      </Routes>
    </Router>
  );
}

export default App;