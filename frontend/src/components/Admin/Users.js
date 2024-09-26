import React, { useState, useEffect } from 'react';
import './Users.css';
import Header from './Header';
import SideMenu from './SideMenu';
import { getUserSession } from '../utils/authUtils';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

const Users = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userSession = getUserSession();

    if (userSession && userSession.given_name) {
      setUserName(userSession.given_name);
    } else {
      console.warn("No valid session found, redirecting to login.");
      window.location.href = "/";
    }
  }, []);

  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Premium', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Standard', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', plan: 'Basic', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', plan: 'Premium', status: 'Active' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', plan: 'Standard', status: 'Active' },
  ]);

  return (
    <div className="dashboard">
      <SideMenu />
      <main className="dashboard__content">
        <Header userName={userName} />
        <div className="users">
          <h2>User Management</h2>
          <div className="users__search">
            <input type="text" placeholder="Search users..." />
            <button><FaSearch /></button>
          </div>
          <table className="users__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.plan}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className="users__action-btn edit"><FaEdit /></button>
                    <button className="users__action-btn delete"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Users;