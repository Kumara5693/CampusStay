import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [role, setRole] = useState('Student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, role };
      
      await axios.post('http://localhost:8000/api/users/register', payload);
      
      if (role === 'Owner') {
        alert("Registration successful! Please wait for Admin approval before logging in.");
      } else {
        alert("Registration successful! You can now log in.");
      }
      
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        
        <div className="role-toggle">
          <button 
            className={`role-btn ${role === 'Student' ? 'active' : ''}`}
            onClick={() => setRole('Student')}
            type="button"
          >
            Student
          </button>
          <button 
            className={`role-btn ${role === 'Owner' ? 'active' : ''}`}
            onClick={() => setRole('Owner')}
            type="button"
          >
            Boarding Owner
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-input" 
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder="Enter a valid email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-input" 
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          {role === 'Owner' && (
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                className="form-input" 
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>
          )}

          <button type="submit" className="register-btn">Register</button>
        </form>

        <div className="login-link-container">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;