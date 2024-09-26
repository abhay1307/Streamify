// src/components/utils/CallBack.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext'; // Import useAuth

const CallBack = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [error, setError] = useState(null);
    const { login } = useAuth(); // Get login function from context

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const txn_error = params.get('error');
        const app_key = process.env.REACT_APP_ONEACCESS_CLIENT_ID;
        const app_secret = process.env.REACT_APP_ONEACCESS_CLIENT_SECRET;

        if (txn_error === '0' && token) {
            const validateToken = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_STREAMIFY_BACKEND_URL}/verify_token`, {
                        method: 'POST',
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ app_key, app_secret, token })
                    });

                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                        const jwt_token = data.jwt_token;
                        const fetchDecodedUserData = async (jwt_token) => {
                            try {
                                const response = await fetch(`${process.env.REACT_APP_STREAMIFY_BACKEND_URL}/call_back`, {
                                    method: 'POST',
                                    headers: {
                                        'accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ token: jwt_token })
                                });

                                const decodedData = await response.json();
                                
                                if (response.ok && decodedData.success) {
                                    sessionStorage.setItem('user', JSON.stringify(decodedData.data));
                                    login(decodedData.data); // Update context state
                                    
                                    const userRole = decodedData.data.user_role;
                                    if (userRole === 'CL-ADMIN') {
                                        navigate('/admin');
                                    } else if (userRole === 'CL-USER') {
                                        navigate('/user');
                                    } else {
                                        setError("Unknown user role");
                                    }
                                } else {
                                    setError("Failed to fetch user data");
                                    console.error('Failed to fetch user data:', decodedData);
                                }
                            } catch (fetchError) {
                                setError("Error fetching user data");
                                console.error("Error fetching user data!", fetchError);
                            }
                        };
                        fetchDecodedUserData(jwt_token);
                    } else {
                        setError("Unexpected response format");
                        console.error('Failed to fetch service data:', data);
                    }
                } catch (error) {
                    setError("Error fetching services data");
                    console.error("There was an error fetching the services data!", error);
                }
            };
    
            validateToken();
        } else {
            setError('Transaction failed!');
        }
    }, [location.search, login, navigate]);

    return (
        <div>
            <div>CallBack</div>
            {error && <div>Error : {error}</div>}
        </div>
    );
};

export default CallBack;
