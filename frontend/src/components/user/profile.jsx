import React, { Component } from 'react';
import axios from '../../api/axios';
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const USER_DETAILS_URL = '/auth/users/me';

const Profile = () => {
    const [last_name, setLastName] = useState('');
    const [first_name, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            // You can await here
            try {
                const response = await axios.get(USER_DETAILS_URL, {
                    headers: { Authorization: `JWT ${localStorage.getItem('accessToken')}` },
                });
                setEmail(response.data.email);
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
                setEmail(response.data.email);
            } catch (error) {
                // alert(error.response.statusText);
                console.log(error);
                if (error.response.statusText === 'Unauthorized') {
                    localStorage.removeItem('accessToken');
                }
                navigate('/login');
            }
        }
        fetchData();
    }, []);

    return (
        <React.Fragment>
            .
            <div className='container-fluid'>
                <div className='row justify-content-center'>
                    <div className='col'>
                        <h1>Profile</h1>
                        <p>{first_name}</p>
                        <p>{last_name}</p>
                        <p>{email}</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Profile;
