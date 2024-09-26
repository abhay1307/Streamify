import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './Upload.css';
import SideMenu from './SideMenu';
import Header from './Header';

// Set up the modal root element
Modal.setAppElement('#root');

const Upload = () => {
  const navigate = useNavigate();
  const [folderName, setFolderName] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const [redirectId, setRedirectId] = useState(''); // State to store ID for redirection

  const handleUpload = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    const backendUrl = `${process.env.REACT_APP_STREAMIFY_BACKEND_URL}/upload_media`;

    const formData = new FormData();
    formData.append('folder_name', folderName);
    if (bannerFile) formData.append('banner_file', bannerFile);
    if (videoFile) formData.append('video_file', videoFile);

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      const result = await response.json();
      const videoId = result.data.v_id;;
      setUploadStatus(`Upload Successful: ${JSON.stringify(result)}`);
      setModalIsOpen(true); // Open the modal on successful upload
      // Store the ID for redirection
      setRedirectId(videoId);
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus(`Error: ${error.message}`);
      setModalIsOpen(true); // Open the modal to show error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    if (uploadStatus.startsWith('Upload Successful')) {
      navigate(`/process?v=${redirectId}`);
    }
  };

  return (
    <div className="dashboard">
      <SideMenu />
      <div className="dashboard__content">
        <Header />
        <div className="upload-container">
          <h2>Upload Video Page</h2>
          {loading ? (
            <div className="loader">
              <div className="loader-circle"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <form className="upload-form" onSubmit={handleUpload}>
              <label htmlFor="folderName">Folder Name:</label>
              <input
                type="text"
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                required
              />
              <label htmlFor="bannerFile">Upload Banner:</label>
              <input
                type="file"
                id="bannerFile"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files[0])}
                required
              />
              <label htmlFor="videoFile">Upload Video:</label>
              <input
                type="file"
                id="videoFile"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files[0])}
                required
              />
              <button type="submit">Next</button>
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
          <h2>{uploadStatus.startsWith('Error') ? 'Upload Failed!' : 'Upload Successful!'}</h2>
          <button onClick={closeModal} className="modal-button">OK</button>
        </Modal>
      </div>
    </div>
  );
};

export default Upload;
