import React, { useState, useEffect } from 'react';
import './Media_upload.css';
import Header from './Header';
import SideMenu from './SideMenu';
import { getUserSession } from '../utils/authUtils';
import { FaUpload } from 'react-icons/fa';

const Upload = () => {
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

  const [banner, setBanner] = useState(null);

  const handleBannerChange = (e) => {
    setBanner(e.target.files[0]);
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle file upload logic here
    console.log('File uploaded:', file);
  };

  return (
    <div className="dashboard">
      <SideMenu />
      <main className="dashboard__content">
        <Header userName={userName} />
        <div className="upload">
          <h2>Upload Content</h2>
          <form onSubmit={handleSubmit} className="upload__form">
            <div className="upload__input-group">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" required />
            </div>
            <div className="upload__input-group">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" required></textarea>
            </div>
            <div className="upload__input-group">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" required>
                <option value="">Select Type</option>
                <option value="movie">Movie</option>
                <option value="tvshow">TV Show</option>
              </select>
            </div>
            <div className="upload__input-group">
              <label htmlFor="genre">Genre</label>
              <select id="genre" name="genre" required>
                <option value="">Select Genre</option>
                <option value="action">Action</option>
                <option value="comedy">Comedy</option>
                <option value="drama">Drama</option>
                <option value="scifi">Sci-Fi</option>
              </select>
            </div>
            <div className="upload__input-group">
              <label htmlFor="file">Banner</label>
              <input type="file" id="banner" name="banner" onChange={handleBannerChange} required />
            </div>
            <div className="upload__input-group">
              <label htmlFor="file">File</label>
              <input type="file" id="file" name="file" onChange={handleFileChange} required />
            </div>
            <button type="submit" className="upload__submit-btn">
              <FaUpload /> Upload Content
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Upload;