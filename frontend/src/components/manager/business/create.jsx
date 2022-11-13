import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { useState, useEffect, useRef } from 'react';

import axios from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import Input from './../../common/input';
const BUSINESSES_URL = 'businesses/';

const CreateBusiness = () => {
    const [map, setMap] = useState(/** @type google.maps.map */ (null));
    const [businessLocation, setBusinessLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    const businessRef = useRef(null);
    const cityRef = useRef(null);
    const addressRef = useRef(null);
    const locationRef = useRef(null);
    const emailRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    }, []);

    const handleSubmit = async () => {
        if (password1 !== password2) {
            alert('passwords did not match!');
        } else {
            const password = password1;
            const data = {
                name: businessRef.current.value,
                lng: businessLocation ? businessLocation.lng : null,
                lat: businessLocation ? businessLocation.lat : null,
                address: addressRef.current.value,
                city: cityRef.current.value,
                email: emailRef.current.value,
                password: password,
            };

            try {
                const response = await axios.post(BUSINESSES_URL, data);
                console.log(response.data);
                alert('business has been saved');
                navigate('/business', { replace: true });
            } catch (err) {
                console.log(err);
                if (!err.response) {
                    alert('No Server Response');
                } else {
                    const errorMessage = JSON.stringify(err.response.data).replace(/[{"}[\]]/g, ' ');
                    alert(errorMessage);
                }
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
            setBusinessLocation(location.toJSON());
            map.panTo(location);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    return (
        <div className='row m-0'>
            <div className='col-3 p-1'>
                <form
                    className='form-group p-4 rounded-3 shadow-lg m-2'
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <h4>Create Business Account</h4>
                    <Input name='business-name' ref={businessRef} label='Business Name:' />
                    <Input name='city' ref={cityRef} label='City:' />
                    <Autocomplete onPlaceChanged={() => getCoordinates(addressRef)}>
                        <Input name='address' ref={addressRef} label='Address:' />
                    </Autocomplete>
                    <Input name='email' ref={emailRef} label='Email:' type='email' />
                    <Input
                        name='password1'
                        label='Password:'
                        type='password'
                        value={password1}
                        onChange={(e) => {
                            setPassword1(e.target.value);
                        }}
                    />
                    <Input
                        name='password2'
                        label='Confirm Password:'
                        type='password'
                        value={password2}
                        onChange={(e) => {
                            setPassword2(e.target.value);
                        }}
                    />
                </form>
                <button
                    className='btn btn-primary mt-3 px-4 ms-2'
                    type='button'
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    save
                </button>
                {/*             
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
                </form>*/}
            </div>

            <div className='col-9 p-0 m-0'>
                <Autocomplete onPlaceChanged={() => getCoordinates(locationRef)}>
                    <input
                        className='form-control position-absolute border border-3 border-primary border-opacity-25 shadow-lg ms-5 m-4 py-2'
                        id='location'
                        type='text'
                        placeholder='search loacation'
                        style={{ zIndex: '100', width: '20rem' }}
                        ref={locationRef}
                    />
                </Autocomplete>
                <GoogleMap
                    center={userLocation}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100vh' }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    onLoad={(map) => setMap(map)}
                    onClick={(e) => {
                        setBusinessLocation(e.latLng.toJSON());
                    }}
                >
                    businessLocation && (
                    <Marker
                        draggable={true}
                        onDragEnd={(e) => {
                            locationRef.current.value = '';
                            setBusinessLocation(e.latLng.toJSON());
                        }}
                        position={businessLocation}
                    />
                    )
                </GoogleMap>
            </div>
        </div>
    );
};

export default CreateBusiness;
