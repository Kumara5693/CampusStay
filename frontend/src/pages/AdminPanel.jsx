import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

function AdminPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:8000/api/users/all-users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleApprove = async (userId) => {
    if (window.confirm("Are you sure you want to approve this boarding owner?")) {
      const token = localStorage.getItem('token');
      try {
        await axios.put(`http://localhost:8000/api/users/approve-owner/${userId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Owner approved successfully!");
        fetchUsers(); 
      } catch (error) {
        console.error("Error approving owner:", error);
        alert("Failed to approve owner.");
      }
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to remove this user from the system? This action cannot be undone.")) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:8000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("User removed successfully!");
        fetchUsers(); 
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to remove user.");
      }
    }
  };

  const pendingOwners = users.filter(user => user.role === 'Owner' && user.status === 'Pending');
  const approvedOwners = users.filter(user => user.role === 'Owner' && user.status === 'Approved');
  const students = users.filter(user => user.role === 'Student');

  return (
    <div className="admin-wrapper">
      <h2 className="admin-header">System Administration Panel</h2>

      <div className="admin-section">
        <h3>Pending Boarding Owners (Requires Approval)</h3>
        {pendingOwners.length === 0 ? (
          <p className="empty-message">No pending owners found.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOwners.map(owner => (
                <tr key={owner._id}>
                  <td>{owner.name}</td>
                  <td>{owner.email}</td>
                  <td>{owner.phone}</td>
                  <td><span className="status-badge status-pending">{owner.status}</span></td>
                  <td>
                    <button className="approve-btn" onClick={() => handleApprove(owner._id)} style={{marginRight: '10px'}}>
                      Approve
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(owner._id)}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-section">
        <h3>Approved Boarding Owners</h3>
        {approvedOwners.length === 0 ? (
          <p className="empty-message">No approved owners found.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {approvedOwners.map(owner => (
                <tr key={owner._id}>
                  <td>{owner.name}</td>
                  <td>{owner.email}</td>
                  <td>{owner.phone}</td>
                  <td><span className="status-badge status-approved">{owner.status}</span></td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(owner._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-section">
        <h3>Registered Students</h3>
        {students.length === 0 ? (
          <p className="empty-message">No students found.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.role}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(student._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;