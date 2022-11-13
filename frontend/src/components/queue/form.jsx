import React, { useRef, useState, useEffect, useContext, Component } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
const Form = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [additional_info, setAdditional_info] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [address, additional_info, address, phoneNumber, additional_info]);

    useEffect(() => {
        if (success) {
            navigate('/user');
        }
    }, [success]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // if (password1 !== password2) {
        //     setErrMsg('passwords did not match!');
        // } else {
        //     const password = password1;

        //     try {
        //         const response = await axios.post(SIGNUP_URL, {
        //             email,
        //             first_name: firstName,
        //             last_name: lastName,
        //             password,
        //         });
        //         //console.log(JSON.stringify(response));
        //         // const accessToken = response?.data?.access;
        //         // setAuth({ email, password, accessToken });
        //         setAddress('');
        //         setFirstName('');
        //         setLastName('');
        //         setPassword1('');
        //         setPassword2('');
        //         // localStorage.setItem('accessToken', accessToken);
        //         console.log(response.data);
        //         setSuccess(true);
        //     } catch (err) {
        //         console.log(err);
        //         if (!err.response) {
        //             setErrMsg('No Server Response');
        //         } else {
        //             const errorMessage = Object.values(err.response.data)[0][0];
        //             setErrMsg(errorMessage);
        //         }

        //         errRef.current.focus();
        //     }
        // }
    };

    return (
        <section className='container'>
            <div className='row'>
                <div className='col-sm-8 col-md-6 col-lg-4'>
                    <p
                        ref={errRef}
                        className={errMsg ? 'text-danger bg-white shadow-lg p-3 w-100' : 'd-none'}
                        aria-live='assertive'
                    >
                        {errMsg}
                    </p>
                    <h1>Take a Queue</h1>
                    <form className='form-group' onSubmit={handleSubmit}>
                        <label htmlFor='firstName'>First name:</label>
                        <input
                            className='form-control'
                            type='text'
                            id='firstName'
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            required
                        />
                        <label htmlFor='lastName'>Last Name:</label>
                        <input
                            className='form-control'
                            type='text'
                            id='lastName'
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            required
                        />

                        <label htmlFor='address'>Address: </label>
                        <input
                            className='form-control'
                            type='text'
                            id='address'
                            onChange={(e) => setAddress(e.target.value)}
                            value={address}
                            required
                        />
                        <label htmlFor='phoneNumber'>Phone number: </label>
                        <input
                            className='form-control'
                            type='text'
                            id='phoneNumber'
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                            required
                        />
                        <label htmlFor='additional_info'>Additional information:</label>
                        <input
                            className='form-control'
                            type='text'
                            id='additional_info'
                            onChange={(e) => setAdditional_info(e.target.value)}
                            value={additional_info}
                            required
                        />

                        <button className='btn btn-primary m-2'>Submit</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Form;
