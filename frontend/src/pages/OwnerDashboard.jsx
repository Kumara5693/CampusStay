import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OwnerDashboard.css'; // අලුත් CSS ෆයිල් එක ලින්ක් කිරීම

function OwnerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchOwnerBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:8000/api/bookings/owner-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching owner bookings:", error);
      }
    };
    
    fetchOwnerBookings();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Owner Dashboard - Room Bookings</h2>
      
      {bookings.length === 0 ? (
        <p className="empty-message">No bookings found for your rooms yet.</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <h3 className="booking-room-title">Room: {booking.room?.title}</h3>
              
              <div className="booking-detail">
                <span className="detail-label">Student Name:</span>
                <span className="detail-value">{booking.user?.name || 'N/A'}</span>
              </div>
              
              <div className="booking-detail">
                <span className="detail-label">Student Email:</span>
                <span className="detail-value">{booking.user?.email || 'N/A'}</span>
              </div>
              
              <div className="booking-detail">
                <span className="detail-label">Check-In:</span>
                <span className="detail-value">{new Date(booking.checkInDate).toLocaleDateString()}</span>
              </div>
              
              <div className="booking-detail">
                <span className="detail-label">Check-Out:</span>
                <span className="detail-value">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
              </div>
              
              <div className="booking-detail" style={{ marginTop: '20px' }}>
                <span className="detail-label">Status:</span>
                <span className="status-badge">{booking.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;