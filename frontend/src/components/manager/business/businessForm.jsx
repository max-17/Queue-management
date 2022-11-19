import React, { Component } from 'react';
import { useRef, useEffect, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import Input from '../../common/input';

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
                <h4>Edit Business Account</h4>
                <Input
                    name='business-name'
                    // ref={businessRef}
                    label='Business Name:'
                />
                <Input
                    name='city'
                    // ref={cityRef}
                    label='City:'
                />
                <Autocomplete
                // onPlaceChanged={() => getCoordinates(addressRef)}
                >
                    <Input
                        name='address'
                        // ref={addressRef} label='Address:'
                    />
                </Autocomplete>
                <Input
                    name='email'
                    // ref={emailRef}
                    label='Email:'
                    type='email'
                />
                <Input
                    name='password1'
                    label='Password:'
                    type='password'
                    // value={password1}
                    // onChange={(e) => {
                    //     setPassword1(e.target.value);
                    // }}
                />
                <Input
                    name='password2'
                    label='Confirm Password:'
                    type='password'
                    // value={password2}
                    // onChange={(e) => {
                    //     setPassword2(e.target.value);
                    // }}
                />
            </form>

            <button
                className='btn btn-primary mt-3 px-4 ms-2'
                type='button'
                // onClick={(e) => {
                //     e.preventDefault();
                //     handleSubmit();
                // }}
            >
                save
            </button>
        </>
    );
};

BusinessForm.defaultProps = {
    formTitle: 'Create Business',
    data: {
        email: '',
        password: '',
        name: '',
        address: '',
        city: '',
        lat: null,
        lng: null,
    },
};

export default BusinessForm;
