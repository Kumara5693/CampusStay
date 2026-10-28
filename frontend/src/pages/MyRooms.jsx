import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyRooms.css';

function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRooms();
  }, []);

  const fetchMyRooms = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:8000/api/rooms/owner-rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room? ")) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:8000/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Room deleted successfully!');
        fetchMyRooms(); 
      } catch (error) {
        console.error("Error deleting room:", error);
        alert('Failed to delete room.');
      }
    }
  };

  const handleEdit = (room) => {
    // Navigate to edit page and pass the room data
    navigate(`/edit-room/${room._id}`, { state: { room } });
  };

  return (
    <div className="my-rooms-wrapper">
      <h2 className="my-rooms-header">My Managed Rooms</h2>
      
      {rooms.length === 0 ? (
        <p>You haven't added any rooms yet.</p>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room._id} className="room-card">
              {room.images && room.images.length > 0 && (
                <div className="room-img-container">
                  <img src={room.images[0]} alt={room.title} className="room-img" />
                </div>
              )}
              <div className="room-info">
                <h3>{room.title}</h3>
                <p style={{ color: '#ccc', margin: '5px 0' }}><strong>Location:</strong> {room.location}</p>
                <p style={{ color: '#ccc', margin: '5px 0' }}><strong>Price:</strong> Rs. {room.price}</p>
                
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(room)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(room._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRooms;