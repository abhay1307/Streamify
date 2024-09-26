import React, { useEffect, useState } from 'react';
import Header from './Header';
import SideMenu from './SideMenu';
import './Media.css'; 
import { getUserSession } from '../utils/authUtils';

const Media = () => {
  const [userName, setUserName] = useState('');
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userSession = getUserSession(); // Get user session

    if (userSession && userSession.given_name) {
        setUserName(userSession.given_name);
    } else {
        // Redirect to login if no session
        console.warn("No valid session found, redirecting to login.");
        window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    // Fetch media list from the API
    const fetchMediaList = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_STREAMIFY_BACKEND_URL}/media_list`);
        const data = await response.json();
        console.log("media list:", data)
        if (response.ok) {
          setMediaList(data); // Update state with fetched data
        } else {
          setError(data.message || 'Error fetching media list');
        }
      } catch (err) {
        setError('Failed to fetch media list');
      } finally {
        setLoading(false);
      }
    };

    fetchMediaList();
  }, []);

  return (
    <div className="dashboard">
      <SideMenu />
      <div className="dashboard__content">
        <Header />
        <div className="media-page">
          <h2>Media List</h2>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="media-list">
              {mediaList.map((media) => (
                <div key={media.id} className="media-item">
                  <img src={media.banner_url} alt={'Media Banner'} className="media-banner"/>
                  <div className="media-details">
                    <h3>{media.folder_name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Media;
