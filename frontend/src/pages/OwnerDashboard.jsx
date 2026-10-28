import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OwnerDashboard.css'; 

function OwnerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

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

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this booking?`)) return;

    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/api/bookings/update-status/${bookingId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert(`Booking has been ${newStatus}!`);
      // Update UI without reloading
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));

    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update booking status.");
    }
  };

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
              
              <div className="booking-detail" style={{ marginTop: '15px' }}>
                <span className="detail-label">Status:</span>
                <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </div>

              {/* Show Accept/Reject buttons only if status is Pending */}
              {(booking.status === 'Pending' || booking.status === 'PENDING') && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleUpdateStatus(booking._id, 'Accepted')}
                    style={{ flex: 1, padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Accept
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(booking._id, 'Rejected')}
                    style={{ flex: 1, padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Reject
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;