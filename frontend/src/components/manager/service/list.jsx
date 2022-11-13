import React, { Component, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../../api/axios';

const ServiceList = () => {
    const [listOfServices, setListOfServices] = useState([]);
    const { businessId } = useParams();

    const fetchData = async () => {
        // You can await here
        try {
            const response = await axios.get(`businesses/${businessId}/services`);

            setListOfServices(() => [...response.data]);
        } catch (error) {
            alert(error.response.statusText);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (serviceId, index) => {
        try {
            const response = await axios.delete(`businesses/${businessId}/services/${serviceId}`);
            let list = [...listOfServices];
            list.splice(index, 1);
            setListOfServices(list);
            console.log(listOfServices);
        } catch (error) {
            alert(error.response.statusText);
        }
    };

    return (
        <div id='services'>
            <ul className='list-group p-2 rounded-3 shadow-lg m-2'>
                <h3 className=''>Services</h3>
                {listOfServices.map((service, index) => (
                    <Link to={`${service.id}`} className='list-group-item' id={service.id} key={index}>
                        <div className='row'>
                            <h5 className='col mb-1'>{service.name}</h5>
                            <button
                                className='col-2 btn btn-danger btn-sm'
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(`${service.id}`, index);
                                }}
                            >
                                <i className='fa fa-trash' aria-hidden='true'></i>
                            </button>
                        </div>
                    </Link>
                ))}
                <li className='d-flex justify-content-between align-items-center p-0'>
                    <Link to='services/new' className='btn btn-primary w-100 m-0 mt-1'>
                        <h2 className='p-0 m-0'>+</h2> Add new service
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default ServiceList;
