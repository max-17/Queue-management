import React, { Component } from 'react';
import axios from '../../api/axios';
import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../common/input';
import { Autocomplete } from '@react-google-maps/api';

const USER_DETAILS_URL = '/auth/users/me';
const BUSINESS_INSTANCE_URL = '/businesses/instance/';

const BusinessAccount = () => {
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);
    const [services, setServices] = useState([]);
    const [editing, setEditing] = useState(false);
    const [addService, setAddService] = useState(false);

    const addressRef = useRef();
    const serviceRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            // You can await here
            try {
                const userResponse = await axios.get(USER_DETAILS_URL, {
                    headers: { Authorization: `JWT ${localStorage.getItem('accessToken')}` },
                });

                setEmail(userResponse.data.email);
                setEmail(userResponse.data.email);

                const businessResponse = await axios.get(BUSINESS_INSTANCE_URL, {
                    headers: { Authorization: `JWT ${localStorage.getItem('accessToken')}` },
                });
                setCity(businessResponse.data.city);
                setName(businessResponse.data.name);
                setAddress(businessResponse.data.address);
                setLat(businessResponse.data.lat);
                setLng(businessResponse.data.lng);
                setServices(businessResponse.data.services);
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

    const handleSubmit = async () => {
        try {
            const data = {
                name: name,
                address: addressRef.current.value,
                city: city,
                lat: lat,
                lng: lng,
            };
            console.log(data);
            const response = await axios({
                method: 'put',
                url: BUSINESS_INSTANCE_URL,
                data: data,
                headers: { Authorization: `JWT ${localStorage.getItem('accessToken')}` },
            });
        } catch (error) {
            // alert(error.response.statusText);
            console.log(error);
            if (error.response.statusText === 'Unauthorized') {
                localStorage.removeItem('accessToken');
                navigate('/login');
            }
        }
    };

    const getCoordinates = async (input) => {
        if (input.current.value === '') {
            return;
        }

        // eslint-disable-next-line no-undef
        const goecodingService = new google.maps.Geocoder();

        try {
            const { results } = await goecodingService.geocode({ address: input.current.value });
            const location = results[0].geometry.location;
            setLat(location.toJSON().lat);
            setLng(location.toJSON().lng);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    return (
        <React.Fragment>
            <div className='container-fluid'>
                <div className='row justify-content-center'>
                    <div className='col-3'>
                        <form
                            className='form-group p-4 rounded-3 shadow-lg m-2'
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <h4>Business Account</h4>
                            <Input
                                name='business-name'
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                label='Business Name:'
                                isDisabled={!editing}
                            />
                            <Input
                                name='city'
                                label='City:'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                isDisabled={!editing}
                            />
                            {editing && (
                                <Autocomplete
                                    onPlaceChanged={() => {
                                        getCoordinates(addressRef);
                                        setAddress(addressRef.current.value);
                                    }}
                                >
                                    <Input name='address' ref={addressRef} label='Address:' />
                                </Autocomplete>
                            )}
                            <p> Address: {address} </p>
                        </form>

                        {editing ? (
                            <button
                                className='btn btn-primary mt-3 px-4 ms-2'
                                type='button'
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                    setEditing(false);
                                }}
                            >
                                save
                            </button>
                        ) : (
                            <button
                                className='btn btn-primary mt-3 px-4 ms-2'
                                type='button'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditing(true);
                                }}
                            >
                                edit
                            </button>
                        )}
                    </div>
                    <div className='col-4 mt-2'>
                        <ul className='list-group shadow-lg p-4'>
                            <h4 className='mb-3'>Services</h4>
                            {services.length &&
                                services.map((service) => (
                                    <Link
                                        to={`services/${service.id}`}
                                        className='list-group-item d-flex justify-content-between align-items-center'
                                        key={service.id}
                                    >
                                        {service.name}

                                        <span className='badge bg-primary rounded-pill' name='num-of-queues'>
                                            queue count
                                        </span>
                                    </Link>
                                ))}
                        </ul>
                        {addService && (
                            <li className='list-group-item d-flex justify-content-between align-items-center'>
                                <Input placeholder='add service' ref={serviceRef} />
                                <button
                                    className='btn btn-primary'
                                    onClick={() => {
                                        try {
                                            const response = axios.post(
                                                BUSINESS_INSTANCE_URL + 'services/',
                                                {
                                                    name: serviceRef.current.value,
                                                },
                                                {
                                                    headers: {
                                                        Authorization: `JWT ${localStorage.getItem('accessToken')}`,
                                                    },
                                                }
                                            );
                                            window.location.reload();
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}
                                >
                                    save
                                </button>
                            </li>
                        )}
                        <button
                            className='btn btn-primary mt-3 px-4 ms-2'
                            onClick={() => {
                                setAddService(true);
                            }}
                        >
                            Add Service
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default BusinessAccount;
