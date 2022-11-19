import { useState, useEffect } from 'react';
import axios from '../../../api/axios';
import { Link, useParams } from 'react-router-dom';

const ServiceList = () => {
    const [listOfServices, setListOfServices] = useState([]);
    const { businessId } = useParams();

    const fetchData = async () => {
        // You can await here
        try {
            const response = await axios.get(`/services`);

            setListOfServices(() => [...response.data]);
        } catch (error) {
            alert(error.response.statusText);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='row m-0'>
            <div className='col-3 m-2'>
                <ul className='list-group'>
                    {/* loop */}
                    {listOfServices.map((servcie) => (
                        <Link to={`${servcie.id}`} className='list-group-item' id={servcie.id} key={servcie.id}>
                            <h5 className='mb-1'>{servcie.name}</h5>

                            <p className='mb-1'>{servcie.business_address}</p>
                        </Link>
                    ))}
                    <li className='list-group-item d-flex justify-content-between align-items-center p-0'>
                        <Link to='new' className='btn btn-primary w-100 m-0'>
                            <h2 className='p-0 m-0'>+</h2> Add new business
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ServiceList;
