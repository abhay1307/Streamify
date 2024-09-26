import React, { useState, useEffect } from 'react';
import './Content.css';
import Header from './Header';
import SideMenu from './SideMenu';
import { getUserSession } from '../utils/authUtils';
import { FaSearch, FaEdit, FaTrash, FaStar } from 'react-icons/fa';

const Content = () => {
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

    const [content] = useState([
        { id: 1, title: 'Stranger Things', type: 'TV Show', genre: 'Sci-Fi', rating: 4.5 },
        { id: 2, title: 'The Crown', type: 'TV Show', genre: 'Drama', rating: 4.3 },
        { id: 3, title: 'Extraction', type: 'Movie', genre: 'Action', rating: 3.8 },
        { id: 4, title: 'Black Mirror', type: 'TV Show', genre: 'Sci-Fi', rating: 4.2 },
        { id: 5, title: 'The Irishman', type: 'Movie', genre: 'Crime', rating: 4.0 },
    ]);

    return (
        <div className="dashboard">
        <SideMenu />
        <main className="dashboard__content">
            <Header userName={userName} />
            <div className="content">
            <h2>Content Management</h2>
            <div className="content__search">
                <input type="text" placeholder="Search content..." />
                <button><FaSearch /></button>
            </div>
            <table className="content__table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Genre</th>
                    <th>Rating</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {content.map(item => (
                    <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.type}</td>
                    <td>{item.genre}</td>
                    <td>
                        <span className="content__rating">
                        <FaStar /> {item.rating}
                        </span>
                    </td>
                    <td>
                        <button className="content__action-btn edit"><FaEdit /></button>
                        <button className="content__action-btn delete"><FaTrash /></button>
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

export default Content;