import { useState, useEffect, useRef } from 'react';
import axios from '../../../api/axios';
import { Link } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';

const URL = 'services/';

const Services = () => {
    const [services, setServices] = useState([]);
    const [map, setMap] = useState(null);
    const searchRef = useRef();

    const fetchData = async () => {
        // You can await here
        try {
            const response = await axios.get(URL);

            setServices(() => [...response.data]);
        } catch (error) {
            alert(error.response.statusText);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // eslint-disable-next-line no-undef
        const bounds = new google.maps.LatLngBounds();
        for (const service of services) {
            // eslint-disable-next-line no-undef
            const point = new google.maps.LatLng(service.business.lat, service.business.lng);
            bounds.extend(point);
        }
        map && map.fitBounds(bounds);
    }, [services]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`services/?search=${searchRef.current.value}`);
            setServices(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='row m-0'>
            <div className='col-3'>
                <ul className='list-group'>
                    {/* loop */}
                    {services.map(({ name, id, business }, index) => (
                        <Link to={`services/${id}`} className='list-group-item' id={id} key={index}>
                            <h5 className='mb-1'>{name}</h5>

                            <p className='mb-1'>{business.name}</p>
                            <p className='mb-1'>{business.address}</p>
                        </Link>
                    ))}
                </ul>
            </div>

            <div className='col-9'>
                <form className='row position-absolute ms-5 m-4' style={{ zIndex: '100', width: '25rem' }}>
                    <div className='col-9 p-0 px-1'>
                        <input
                            className='form-control border border-3 border-primary border-opacity-25 shadow-lg rounded-4 py-2'
                            id='search'
                            type='text'
                            placeholder='search services or business...'
                            ref={searchRef}
                        />
                    </div>
                    <div
                        className='col-3 d-flex p-0'
                        onClick={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                    >
                        <button className='btn btn-primary align-self-center py-2'> search </button>
                    </div>
                </form>

                <GoogleMap
                    center={{ lat: 0, lng: 0 }}
                    zoom={4}
                    mapContainerStyle={{ width: '100%', height: '100vh' }}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        maxZoom: 17,
                    }}
                    onLoad={(map) => setMap(map)}
                >
                    {map &&
                        services.map(({ business }, index) => {
                            return <Marker position={{ lat: business.lat, lng: business.lng }} key={index} />;
                        })}
                </GoogleMap>
            </div>
        </div>
    );
};

export default Services;
