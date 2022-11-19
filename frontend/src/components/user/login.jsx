import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
const LOGIN_URL = '/auth/jwt/create';

const Login = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
        if (localStorage.getItem('accessToken')) {
            navigate('/profile');
        }
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL, { email, password });
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.access;
            setEmail('');
            setPassword('');
            localStorage.setItem('accessToken', accessToken);
            navigate('/profile');
        } catch (err) {
            console.log(err);
            if (!err.response) {
                setErrMsg('No Server Response');
            } else {
                const errorMessage = Object.values(err.response.data)[0];
                setErrMsg(errorMessage);
            }
            errRef.current.focus();
        }
    };

    return (
        <section className='container mt-3'>
            <div className='row'>
                <div className='col-sm-8 col-md-6 col-lg-4'>
                    <p
                        ref={errRef}
                        className={errMsg ? 'text-danger bg-white shadow-lg p-3 w-100' : 'd-none'}
                        aria-live='assertive'
                    >
                        {errMsg}
                    </p>
                    <h1>Sign In</h1>
                    <form className='form-group' onSubmit={handleSubmit}>
                        <label htmlFor='email'>Email address:</label>
                        <input
                            className='form-control'
                            type='email'
                            id='email'
                            ref={userRef}
                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                            value={email}
                            required
                        />

                        <label htmlFor='password'>Password:</label>
                        <input
                            className='form-control'
                            type='password'
                            id='password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />

                        <button className='btn btn-primary m-2'>Sign In</button>
                    </form>
                    <p>
                        Need an Account?
                        <br />
                        <span className='line'>
                            <Link to='/signup'>Sign Up</Link>
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;
