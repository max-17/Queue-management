import { useState, useEffect, useRef } from 'react';

import axios from '../../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
const BUSINESSES_URL = 'businesses/';

const CreateService = () => {
    const { businessId } = useParams();
    const URL = `businesses/${businessId}/services/`;
    const nameRef = useRef();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const data = {
            name: nameRef.current.value,
            business: businessId,
        };
        try {
            const response = await axios.post(URL, data);
            console.log(response.data);
            alert('Service has been added');
            navigate(`/business/${businessId}`, { replace: true });
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

    return (
        <div className='row m-0'>
            <div className='col-3 p-1'>
                <form
                    className='form-group p-4 rounded-3 shadow-lg m-2'
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <h4>Add Service</h4>
                    <label htmlFor='businessName'>Service name: </label>
                    <input className='form-control' type='text' id='serviceName' ref={nameRef} required />
                </form>
                <button
                    className='btn btn-primary m-3 px-4'
                    type='button'
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default CreateService;
