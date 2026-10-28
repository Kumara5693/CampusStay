import React, { useState } from 'react';
import axios from 'axios';
import './AddRoom.css'; 
function AddRoom() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login first!');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('location', location);
    
    if (image) {
      formData.append('images', image);
    }

    try {
      await axios.post('http://localhost:8000/api/rooms', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Room added successfully!');
      
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setImage(null);
      
    } catch (error) {
      console.error("Error adding room:", error);
      alert('Failed to add room. Please try again.');
    }
  };

  return (
    <div className="add-room-wrapper">
      <div className="add-room-card">
        <h2 className="add-room-title">Add New Room</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Room Title</label>
            <input 
              type="text" 
              placeholder="e.g. Spacious Single Room" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input 
              type="text" 
              placeholder="e.g. Nugegoda" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              required 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Monthly Price (Rs.)</label>
            <input 
              type="number" 
              placeholder="e.g. 15000" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              placeholder="Describe the facilities (e.g. Attached bathroom, free WiFi...)" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Room Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files[0])} 
              required 
              className="file-input"
            />
          </div>

          <button type="submit" className="submit-btn">
            Add Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddRoom;