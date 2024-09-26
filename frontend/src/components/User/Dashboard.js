import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import SideMenu from './SideMenu';
import Header from './Header';
import { getUserSession } from '../utils/authUtils'; // Import session handling function

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userSession = getUserSession(); // Get user session

    if (userSession && userSession.given_name) {
        // User is authenticated, perform necessary actions
        setIsLoading(false);
        setUserName(userSession.given_name);
    } else {
        // Redirect to login if no session
        window.location.href = "/";
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="dashboard">
      <SideMenu />

      <main className="dashboard__content">
        <Header />

        <section className="dashboard__main">
          
          <div className="content__section">
            <h2>Popular Shows</h2>
            <div className="content__row">
              {/* Replace the src attribute with actual image URLs */}
              <div className="content__item">
                <img src="https://via.placeholder.com/150x200" alt="Show 1" />
                <p>Show Title 1</p>
              </div>
              <div className="content__item">
                <img src="https://via.placeholder.com/150x200" alt="Show 2" />
                <p>Show Title 2</p>
              </div>
              <div className="content__item">
                <img src="https://via.placeholder.com/150x200" alt="Show 3" />
                <p>Show Title 3</p>
              </div>
              <div className="content__item">
                <img src="https://via.placeholder.com/150x200" alt="Show 4" />
                <p>Show Title 4</p>
              </div>
              <div className="content__item">
                <img src="https://via.placeholder.com/150x200" alt="Show 5" />
                <p>Show Title 5</p>
              </div>
            </div>
          </div>
          {/* Similar sections for Trending Now and My List */}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
