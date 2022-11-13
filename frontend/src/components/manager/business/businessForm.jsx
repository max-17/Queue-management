import React, { Component } from 'react';
import { useRef, useEffect, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const BusinessForm = ({ formTitle, data, handleSubmit, businessLocation, getCoordinates }) => {
    const businessRef = useRef(null);
    const cityRef = useRef(null);
    const addressRef = useRef(null);
    const emailRef = useRef();

    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    useEffect(() => {
        businessRef.current.value = data.name;
        cityRef.current.value = data.city;
        addressRef.current.value = data.address;
    }, []);

    return (
        <>
            <form
                className='form-group p-4 rounded-3 shadow-lg m-2'
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <h4>{formTitle}</h4>
                <label htmlFor='businessName'>Business name: </label>
                <input className='form-control' type='text' id='businessName' ref={businessRef} required />

                <label htmlFor='city'>City: </label>
                <input className='form-control' type='text' autoComplete='f-u-chrome' ref={cityRef} required />

                <label htmlFor='adrress'>Address: </label>
                <Autocomplete onPlaceChanged={() => getCoordinates(addressRef)}>
                    <input className='form-control' type='text' autoComplete='f-u-chrome' ref={addressRef} />
                </Autocomplete>
                <label htmlFor='email'>Account Email:</label>
                <input className='form-control' type='email' id='email' ref={emailRef} required />

                <label htmlFor='password1'>Password:</label>
                <input
                    className='form-control'
                    type='password'
                    id='password1'
                    onChange={(e) => setPassword1(e.target.value)}
                    value={password1}
                    required
                />
                <label htmlFor='password2'>Password:</label>
                <input
                    className='form-control'
                    type='password'
                    id='password2'
                    onChange={(e) => setPassword2(e.target.value)}
                    value={password2}
                    required
                />
            </form>
            <button
                className='btn btn-primary mt-3 px-4'
                type='button'
                onClick={(e) => {
                    e.preventDefault();

                    const data = {
                        name: businessRef.current.value,
                        lng: businessLocation ? businessLocation.lng : null,
                        lat: businessLocation ? businessLocation.lat : null,
                        address: addressRef.current.value,
                        city: cityRef.current.value,
                    };
                    console.log(businessLocation.lat);

                    handleSubmit(data);
                }}
            >
                save
            </button>
        </>
    );
};

BusinessForm.defaultProps = {
    formTitle: 'Create Business',
    data: { name: '', address: '', city: '', lat: null, lng: null },
};

export default BusinessForm;
