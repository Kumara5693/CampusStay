import React, { useState } from 'react';
import axios from 'axios';

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
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '25px', backgroundColor: '#1a1a1a', color: 'white', borderRadius: '8px', border: '1px solid #333' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Room</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Room Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#2c3e50', color: 'white' }} 
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#2c3e50', color: 'white', minHeight: '80px' }} 
        />
        <input 
          type="number" 
          placeholder="Monthly Price (Rs.)" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#2c3e50', color: 'white' }} 
        />
        <input 
          type="text" 
          placeholder="Location (e.g. Nugegoda)" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          required 
          style={{ padding: '10px', borderRadius: '4px', border: 'none', backgroundColor: '#2c3e50', color: 'white' }} 
        />
        <label style={{ fontSize: '14px', color: '#ccc' }}>Upload Room Image:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImage(e.target.files[0])} 
          required 
          style={{ padding: '10px', backgroundColor: '#2c3e50', borderRadius: '4px' }} 
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
          Add Room
        </button>
      </form>
    </div>
  );
}

export default AddRoom;