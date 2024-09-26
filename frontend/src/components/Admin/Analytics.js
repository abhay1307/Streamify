import React, { useState, useEffect } from 'react';
import './Analytics.css';
import Header from './Header';
import SideMenu from './SideMenu';
import { getUserSession } from '../utils/authUtils';
import { FaUsers, FaFilm, FaDollarSign, FaChartLine } from 'react-icons/fa';

const Analytics = () => {
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
            <div className="analytics">
            <h2>Analytics Dashboard</h2>
            <div className="analytics__cards">
                <div className="analytics__card">
                <FaUsers className="analytics__card-icon" />
                <div className="analytics__card-content">
                    <h3>Total Users</h3>
                    <p>1,234,567</p>
                    <span>+2.5% from last month</span>
                </div>
                </div>
                <div className="analytics__card">
                <FaFilm className="analytics__card-icon" />
                <div className="analytics__card-content">
                    <h3>Total Content</h3>
                    <p>15,234</p>
                    <span>+5% from last month</span>
                </div>
                </div>
                <div className="analytics__card">
                <FaDollarSign className="analytics__card-icon" />
                <div className="analytics__card-content">
                    <h3>Revenue</h3>
                    <p>$23,456,789</p>
                    <span>+8% from last month</span>
                </div>
                </div>
                <div className="analytics__card">
                <FaChartLine className="analytics__card-icon" />
                <div className="analytics__card-content">
                    <h3>Active Subscriptions</h3>
                    <p>1,000,234</p>
                    <span>+1.2% from last month</span>
                </div>
                </div>
            </div>
            <div className="analytics__charts">
                <div className="analytics__chart">
                <h3>User Growth</h3>
                {/* Add chart component here */}
                <div className="placeholder-chart">User Growth Chart Placeholder</div>
                </div>
                <div className="analytics__chart">
                <h3>Content Popularity</h3>
                {/* Add chart component here */}
                <div className="placeholder-chart">Content Popularity Chart Placeholder</div>
                </div>
            </div>
            </div>
        </main>
        </div>
    );
};

export default Analytics;