import React, { Component } from 'react';
import Services from './customer/service/services';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className='container-fluid'>
            <div className='text-center bg-secondary bg-opacity-25'>
                <p className=''>
                    Do you have a business? Add your business and services to QMS!
                    <Link to='/business/new' className='m-3'>
                        Create Business Account
                    </Link>
                </p>
            </div>
            <Services />
        </div>
    );
};

export default Home;
