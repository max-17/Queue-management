import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Link } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const BUSINESSES_URL = 'businesses/';

const BusinessList = () => {
    const [listOfBusinesses, setListOfBusinesses] = useState([]);
    const [map, setMap] = useState(null);

    const [markerBounds, setMarkerBounds] = useState(null);

    const fetchData = async () => {
        // You can await here
        try {
            const response = await axios.get(BUSINESSES_URL);

            setListOfBusinesses(() => [...response.data]);
        } catch (error) {
            alert(error.response.statusText);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        map && map.fitBounds(markerBounds);
    }, [markerBounds]);

    useEffect(() => {
        if (map) {
            // eslint-disable-next-line no-undef
            const bounds = new google.maps.LatLngBounds();
            for (const { lng, lat } of listOfBusinesses) {
                // eslint-disable-next-line no-undef
                const point = new google.maps.LatLng(lat, lng);
                bounds.extend(point);
            }
            setMarkerBounds(bounds);
        }
    }, [map]);

    return (
        <div className='row m-0'>
            <div className='col-3'>
                <ul className='list-group'>
                    {/* loop */}
                    {listOfBusinesses.map((business) => (
                        <Link to={`${business.id}`} className='list-group-item' id={business.id} key={business.id}>
                            <h5 className='mb-1'>{business.name}</h5>

                            <p className='mb-1'>{business.address}</p>
                        </Link>
                    ))}
                    <li className='list-group-item d-flex justify-content-between align-items-center p-0'>
                        <Link to='new' className='btn btn-primary w-100 m-0'>
                            <h2 className='p-0 m-0'>+</h2> Add new business
                        </Link>
                    </li>
                </ul>
            </div>

            <div className='col-9'>
                {listOfBusinesses.length && (
                    <GoogleMap
                        center={{ lat: 0, lng: 0 }}
                        zoom={5}
                        mapContainerStyle={{ width: '100%', height: '100vh' }}
                        options={{
                            zoomControl: false,
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                        }}
                        onLoad={(map) => setMap(map)}
                    >
                        {map &&
                            listOfBusinesses.map(({ lat, lng, id }) => {
                                return <Marker position={{ lat: lat, lng: lng }} key={id} />;
                            })}
                    </GoogleMap>
                )}
            </div>
        </div>
    );
};

export default BusinessList;
