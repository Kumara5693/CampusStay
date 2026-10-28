import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBookings.css'; 

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:8000/api/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    
    fetchMyBookings();
  }, []);

  return (
    <div className="my-bookings-container">
      <h2 className="my-bookings-title">My Bookings</h2>
      
      {bookings.length === 0 ? (
        <p className="no-bookings-msg">No bookings found. Start exploring and book a room!</p>
      ) : (
        <div className="my-bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="my-booking-card">
              <h3 className="my-booking-room-title">{booking.room?.title}</h3>
              
              <div className="my-booking-detail">
                <span className="my-detail-label">Check-In:</span>
                <span className="my-detail-value">{new Date(booking.checkInDate).toLocaleDateString()}</span>
              </div>
              
              <div className="my-booking-detail">
                <span className="my-detail-label">Check-Out:</span>
                <span className="my-detail-value">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
              </div>
              
              <div className="my-booking-detail" style={{ marginTop: '20px' }}>
                <span className="my-detail-label">Status:</span>
                <span className="my-status-badge">{booking.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;