import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './EditRoom.css';

function EditRoom() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    facilities: ''
  });

  useEffect(() => {
    if (location.state && location.state.room) {
      const room = location.state.room;
      setFormData({
        title: room.title,
        description: room.description,
        price: room.price,
        location: room.location,
        facilities: room.facilities ? room.facilities.join(',') : ''
      });
    } else {
      navigate('/my-rooms');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const payload = {
        ...formData,
        facilities: formData.facilities.split(',').map(f => f.trim())
      };

      await axios.put(`http://localhost:8000/api/rooms/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("Room updated successfully!");
      navigate('/my-rooms');
    } catch (error) {
      console.error(error);
      alert("Failed to update room.");
    }
  };

  return (
    <div className="edit-room-wrapper">
      <div className="edit-room-card">
        <h2>Edit Room Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-input" value={formData.description} onChange={handleChange} required rows="4"></textarea>
          </div>

          <div className="form-group">
            <label>Price (Rs.)</label>
            <input type="number" name="price" className="form-input" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Facilities (Comma separated)</label>
            <input type="text" name="facilities" className="form-input" value={formData.facilities} onChange={handleChange} placeholder="e.g. WiFi, Attached Bathroom" />
          </div>

          <button type="submit" className="update-btn">Update Room</button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/my-rooms')}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default EditRoom;