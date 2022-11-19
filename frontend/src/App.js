import { React, useContext, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useLoadScript } from '@react-google-maps/api';
import AuthContext from './context/AuthProvider';
import './App.css';
import Home from './components/home';
import Login from './components/user/login';
import BusinessAccount from './components/user/businessAccount';
import Signup from './components/user/signup';
import Manager from './components/manager/business/manager';

import jwt_decode from 'jwt-decode';
import ServiceList from './components/customer/service/serviceList';

const libraries = ['places'];

function App() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    const navigate = useNavigate();

    const { auth, setAuth } = useContext(AuthContext);

    useEffect(() => {
        // check if token is expired
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const decodedToken = jwt_decode(accessToken);

                decodedToken.exp * 1000 < Date.now() && localStorage.removeItem('accessToken');
            } catch (e) {
                console.log(e);
            }
        }
    }, []);

    if (!isLoaded) {
        return <h1>Loading ...</h1>;
    }

    return (
        <>
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <div className='container-fluid'>
                    <Link className='navbar-brand' to=''>
                        Navbar
                    </Link>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarSupportedContent'
                        aria-controls='navbarSupportedContent'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                            <li className='nav-item'>
                                <Link className='nav-link active' aria-current='page' to=''>
                                    Home
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link className='nav-link' to='business'>
                                    Manager
                                </Link>
                            </li>
                            <li className='nav-item dropdown'>
                                <Link
                                    className='nav-link dropdown-toggle'
                                    to=''
                                    id='navbarDropdown'
                                    role='button'
                                    data-bs-toggle='dropdown'
                                    aria-expanded='false'
                                >
                                    Dropdown
                                </Link>
                                <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                    <li>
                                        <Link className='dropdown-item' to=''>
                                            Action
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className='dropdown-item' to=''>
                                            Another action
                                        </Link>
                                    </li>
                                    <li>
                                        <hr className='dropdown-divider' />
                                    </li>
                                    <li>
                                        <Link className='dropdown-item' to=''>
                                            Something else here
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className='nav-item'>
                                <Link className='nav-link disabled' to='' tabIndex='-1' aria-disabled='true'>
                                    Disabled
                                </Link>
                            </li>
                        </ul>
                        {localStorage.getItem('accessToken') ? (
                            <div className='d-flex'>
                                <button
                                    className='btn btn-outline-primary'
                                    onClick={() => {
                                        localStorage.removeItem('accessToken');
                                        navigate('/');
                                    }}
                                    role='button'
                                >
                                    sign out
                                </button>
                            </div>
                        ) : (
                            <div className='d-flex'>
                                <Link className='btn btn-primary btn-sm mx-1' to='/login'>
                                    Login
                                </Link>
                                <Link className='btn btn-primary btn-sm mx-1' to='/signup'>
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='login' element={<Login />} />
                <Route path='business_account' element={<BusinessAccount />} />
                <Route path='signup' element={<Signup />} />
                <Route path='business/*' element={<Manager />} />
                <Route path='services' element={<ServiceList />} />

                <Route
                    path='*'
                    element={
                        <div style={{ padding: '1rem' }}>
                            <h1>There's nothing here!</h1>
                        </div>
                    }
                ></Route>
            </Routes>
        </>
    );
}

export default App;
