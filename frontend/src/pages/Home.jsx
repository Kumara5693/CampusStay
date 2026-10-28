import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css'; 

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
    <div className="home-container">
      <h2>Available Rooms</h2>
      
      <form onSubmit={handleSearch} className="search-container">
        <input 
          type="text" 
          placeholder="Search by Location (e.g. Nugegoda)" 
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="date-container">
        <label>Check-In Date:</label>
        <input 
          type="date" 
          onChange={(e) => setCheckIn(e.target.value)} 
          className="date-input"
        />
        
        <label>Check-Out Date:</label>
        <input 
          type="date" 
          onChange={(e) => setCheckOut(e.target.value)} 
          className="date-input"
        />
      </div>
      
      <div className="rooms-grid">
        {rooms.length === 0 ? (
          <p>No rooms found for this location.</p>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className="room-card">
              {room.images && room.images.length > 0 && (
                <div className="image-container">
                  <img 
                    src={room.images[0]} 
                    alt={room.title} 
                    className="room-image"
                  />
                </div>
              )}
              <div className="room-details">
                <h3 className="room-title">{room.title}</h3>
                <p className="room-info"><strong>Location:</strong> {room.location}</p>
                <p className="room-info"><strong>Price:</strong> Rs. {room.price}</p>
                
                <button 
                  onClick={() => handleBook(room._id)}
                  className="book-button"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;