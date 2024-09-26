import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import SideMenu from './SideMenu';
import Header from './Header';
import { getUserSession } from '../utils/authUtils';
import { FaUsers, FaFilm, FaDollarSign, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
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

  return (
    <div className="dashboard">
      <SideMenu />

      <main className="dashboard__content">
        <Header userName={userName} />

        <section className="dashboard__main">
          <div className="dashboard__cards">
            <div className="dashboard__card">
              <FaUsers className="dashboard__card-icon" />
              <div className="dashboard__card-content">
                <h3>Total Users</h3>
                <p>1,234,567</p>
                <span>+2.5% from last month</span>
              </div>
            </div>
            <div className="dashboard__card">
              <FaFilm className="dashboard__card-icon" />
              <div className="dashboard__card-content">
                <h3>Total Content</h3>
                <p>15,234</p>
                <span>+5% from last month</span>
              </div>
            </div>
            <div className="dashboard__card">
              <FaDollarSign className="dashboard__card-icon" />
              <div className="dashboard__card-content">
                <h3>Revenue</h3>
                <p>$23,456,789</p>
                <span>+8% from last month</span>
              </div>
            </div>
            <div className="dashboard__card">
              <FaChartLine className="dashboard__card-icon" />
              <div className="dashboard__card-content">
                <h3>Active Subscriptions</h3>
                <p>1,000,234</p>
                <span>+1.2% from last month</span>
              </div>
            </div>
          </div>
          <div className="dashboard__recent-uploads">
            <h2>Recent Uploads</h2>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Stranger Things S4</td>
                  <td>TV Show</td>
                  <td>2023-05-15</td>
                  <td>1.2M</td>
                </tr>
                <tr>
                  <td>The Gray Man</td>
                  <td>Movie</td>
                  <td>2023-05-10</td>
                  <td>890K</td>
                </tr>
                <tr>
                  <td>Bridgerton S2</td>
                  <td>TV Show</td>
                  <td>2023-05-05</td>
                  <td>1.5M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;