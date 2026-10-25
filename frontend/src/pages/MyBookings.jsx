import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          {bookings.map((booking) => (
            <div key={booking._id} style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px', backgroundColor: '#1a1a1a', maxWidth: '500px' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#3498db' }}>{booking.room.title}</h3>
              <p style={{ margin: '5px 0' }}><strong>Status:</strong> <span style={{ color: '#f39c12' }}>{booking.status}</span></p>
              <p style={{ margin: '5px 0' }}><strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p style={{ margin: '5px 0' }}><strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;