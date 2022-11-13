import React, { useRef, useState, useEffect, useContext, Component } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios';
import ListGroup from './../common/listGroup';
import AuthContext from '../../context/AuthProvider';
import moment from 'moment/moment';
const LIST_QUEUE_URL = '/queue/';

const QueueList = (props) => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [queueList, setQueueList] = useState([]);
    const [lastName, setLastName] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function fetchData() {
            // You can await here
            try {
                const response = await axios.get(LIST_QUEUE_URL, {
                    headers: { Authorization: `JWT ${localStorage.getItem('accessToken')}` },
                });
                // console.log(response.data);

                setQueueList(response.data);

                // setEmail(response.data.email);
                // setFirstName(response.data.first_name);
                // setLastName(response.data.last_name);
            } catch (error) {
                alert(error.response.statusText);
                // navigate('/profile');
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (success) {
            navigate('/user');
        }
    }, [success]);

    return (
        <div className='container'>
            <div className='list-group' id='queueList'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Service</th>
                            <th scope='col'>status</th>
                            <th scope='col'>registered at</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queueList.map((item, index) => (
                            <tr onClick={() => console.log(item)} key={item.id}>
                                <th scope='row'> {index + 1} </th>
                                <td>{item.service.name}</td>
                                <td>
                                    {item.queue_status === 'W'
                                        ? 'Waiting'
                                        : item.queue_status === 'C'
                                        ? 'Complete'
                                        : 'Failed'}
                                </td>
                                <td>{item.placed_at}</td>
                                <td>{moment().format('YYY MM DD hh:mm', '2022-10-06T07:28:30')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* <ListGroup /> */}
        </div>
    );
};

export default QueueList;
