import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';

function App() {
  return (
    <Router>
      <nav style={{ padding: '15px', backgroundColor: '#2c3e50', marginBottom: '20px' }}>
        <h2 style={{ color: 'white', display: 'inline', marginRight: '30px' }}>CampusStay</h2>
        <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Home</Link>
        <Link to="/my-bookings" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>My Bookings</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;