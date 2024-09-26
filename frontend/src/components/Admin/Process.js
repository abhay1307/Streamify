import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import './Process.css';
import SideMenu from './SideMenu';
import Header from './Header';

// Set up the modal root element
Modal.setAppElement('#root');

const Process = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fetchTriggeredRef = useRef(false);  
  const [videoInfo, setVideoInfo] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [v_id, setV_ID] = useState('');
  const [genre, setGenre] = useState('');
  const [cast, setCast] = useState('');
  const [description, setDescription] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Extract video ID from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const videoId = searchParams.get('v');

  useEffect(() => {
    if (!fetchTriggeredRef.current) {
      fetchTriggeredRef.current = true;
      // Fetch video information from the backend using the ID
      const fetchVideoInfo = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_STREAMIFY_BACKEND_URL}/get_video_info`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ videoId })
          });

          const data = await response.json();
            
          if (response.ok && data.success) {
            setVideoInfo(data.data);
          } else {
            setError("Unexpected response format");
            console.error('Failed to fetch service data:', data);
          }
        } catch (error) {
          setError("Error fetching services data");
          console.error("There was an error fetching the services data!", error);
        }
      };

      fetchVideoInfo();
    }
  }, [videoId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const v_id = videoId
    
    try {
      const response = await fetch(`${process.env.REACT_APP_STREAMIFY_BACKEND_URL}/update_video_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ v_id, genre, cast, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update video information');
      }

      const result = await response.json();
      setUploadStatus(`Upload Successful: ${JSON.stringify(result)}`);
      setModalIsOpen(true); // Open the modal on successful upload
    } catch (error) {
      console.error('Error updating video information:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

 
  const closeModal = () => {
  console.log("Closing modal with status:", uploadStatus); // Log the current status
  setModalIsOpen(false);
  
  if (uploadStatus.startsWith('Upload Successful')) {
    navigate('/media');
  }
};


  if (!videoInfo) {
    return <div>Loading video information...</div>;
  }

  return (
    <div className="dashboard">
      <SideMenu />
      <div className="dashboard__content">
        <Header />
        <div className="process-container">
          <h2>Edit Video Information</h2>
          <div className="video-info">
            <p><strong>Title:</strong> {videoInfo.folder_name}</p>
          </div>
          {loading ? (
            <div className="loader">
              <div className="loader-circle"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <form className="upload-form" onSubmit={handleSubmit}>
              <input type="hidden" id="v_id" value={videoInfo.v_id} onChange={(e) => setV_ID(e.target.value)} required readOnly />

              <label htmlFor="genre">Genre:</label>
              <input type="text" id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} required />

              <label htmlFor="cast">Cast:</label>
              <input type="text" id="cast" value={cast} onChange={(e) => setCast(e.target.value)} required/>

              <label htmlFor="description">Description:</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>

              <button type="submit">Submit</button>
            </form>
          )}
        </div>
        {/* Modal for showing status message */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Upload Status"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <h2>{uploadStatus.startsWith('Error') ? 'Update Failed!' : 'Update Successful!'}</h2>
          <button onClick={closeModal} className="modal-button">OK</button>
        </Modal>
      </div>
    </div>
  );
};

export default Process;
