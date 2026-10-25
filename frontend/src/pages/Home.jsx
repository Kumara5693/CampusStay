import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [rooms, setRooms] = useState([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const fetchRooms = (location = '') => {
    let url = 'http://localhost:8000/api/rooms';
    if (location) {
      url = `http://localhost:8000/api/rooms?location=${location}`;
    }
    
    axios.get(url)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(searchLocation);
  };

  const handleBook = async (roomId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login first to book a room!');
      return;
    }
    
    if (!checkIn || !checkOut) {
      alert('Please select both Check-In and Check-Out dates');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/api/bookings/add',
        {
          room: roomId,
          checkInDate: checkIn,
          checkOutDate: checkOut
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Booking successful!');
      
    } catch (error) {
      console.error("Booking error:", error);
      alert('Error booking the room. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'white' }}>Available Rooms</h2>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search by Location (e.g. Nugegoda)" 
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '10px', borderRadius: '4px', border: 'none' }}
        />
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Search
        </button>
      </form>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '8px', display: 'inline-block', border: '1px solid #333' }}>
        <label style={{ marginRight: '10px', color: 'white' }}>Check-In Date:</label>
        <input 
          type="date" 
          onChange={(e) => setCheckIn(e.target.value)} 
          style={{ marginRight: '20px', padding: '5px' }} 
        />
        
        <label style={{ marginRight: '10px', color: 'white' }}>Check-Out Date:</label>
        <input 
          type="date" 
          onChange={(e) => setCheckOut(e.target.value)} 
          style={{ padding: '5px' }} 
        />
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
        {rooms.length === 0 ? (
          <p style={{ color: 'white' }}>No rooms found for this location.</p>
        ) : (
          rooms.map((room) => (
            <div key={room._id} style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px', width: '300px', backgroundColor: '#1a1a1a' }}>
              {room.images && room.images.length > 0 && (
                <img 
                  src={room.images[0]} 
                  alt={room.title} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} 
                />
              )}
              <h3 style={{ marginTop: '15px', color: 'white' }}>{room.title}</h3>
              <p style={{ color: '#ccc' }}><strong>Location:</strong> {room.location}</p>
              <p style={{ color: '#ccc' }}><strong>Price:</strong> Rs. {room.price}</p>
              
              <button 
                onClick={() => handleBook(room._id)}
                style={{ backgroundColor: '#3498db', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', marginTop: '10px', fontWeight: 'bold' }}
              >
                Book Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;