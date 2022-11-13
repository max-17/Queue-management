import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import axios from '../../../api/axios';
import ServiceList from '../service/list';

const BUSINESSES_URL = 'businesses/';

const BusinessEdit = () => {
    const [map, setMap] = useState(null);
    const { businessId } = useParams();
    const [businessLocation, setBusinessLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [data, setData] = useState(null);

    const nameRef = useRef(null);
    const cityRef = useRef(null);
    const addressRef = useRef(null);

    const locationRef = useRef(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        // You can await here
        try {
            const response = await axios.get(`${BUSINESSES_URL}${businessId}`);
            setData(() => ({ ...response.data }));
            const location = { lat: response.data.lat, lng: response.data.lng };
            setBusinessLocation(location);
            setMapCenter(location);
        } catch (error) {
            console.log(error);
            alert(error.response);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        const data = {
            name: nameRef.current.value,
            lng: businessLocation.lng,
            lat: businessLocation.lat,
            address: addressRef.current.value,
            city: cityRef.current.value,
        };
        try {
            const response = await axios.patch(BUSINESSES_URL + `${businessId}/`, data);
            console.log(data);
            alert('business has been updated');
            navigate('/businesses', { replace: true });
        } catch (err) {
            console.log(err);
            if (!err.response) {
                alert('No Server Response');
            } else {
                const errorMessage = JSON.stringify(err.response.data).replace(/[{"}[\]]/g, ' ');
                alert(errorMessage);
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
    if (!data) {
        return <h1>Loading ...</h1>;
    }

    return (
        <div className='row m-0'>
            <div className='col-3 p-1'>
                <form
                    className='form-group p-4 rounded-3 shadow-lg m-2'
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <h4>Update Business</h4>
                    <label htmlFor='businessName'>Business name: </label>
                    <input
                        className='form-control'
                        type='text'
                        id='businessName'
                        defaultValue={data.name}
                        ref={nameRef}
                        required
                    />

                    <label htmlFor='city'>City: </label>
                    <input
                        className='form-control'
                        type='text'
                        autoComplete='f-u-chrome'
                        defaultValue={data.city}
                        ref={cityRef}
                        required
                    />

                    <label htmlFor='adrress'>Address: </label>
                    <Autocomplete onPlaceChanged={() => getCoordinates(addressRef)}>
                        <input
                            className='form-control'
                            type='text'
                            autoComplete='f-u-chrome'
                            defaultValue={data.address}
                            ref={addressRef}
                        />
                    </Autocomplete>
                </form>
                <div className='col mx-3 d-flex justify-content-around'>
                    <button
                        className='btn btn-primary mt-3 px-4'
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        save
                    </button>

                    <button
                        className='btn btn-danger mt-3 px-4'
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            axios.delete(BUSINESSES_URL + `${businessId}`);
                            navigate('/business', { replace: true });
                        }}
                    >
                        delete
                    </button>
                </div>

                <ServiceList />
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
                    center={mapCenter}
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
                    <Marker
                        draggable={true}
                        onDragEnd={(e) => {
                            locationRef.current.value = '';
                            setBusinessLocation(e.latLng.toJSON());
                        }}
                        position={businessLocation}
                    />
                </GoogleMap>
            </div>
        </div>
    );
};

export default BusinessEdit;
