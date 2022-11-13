import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
const SIGNUP_URL = '/auth/users/';

const Signup = () => {
    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setErrMsg('');
    }, [email, password1, password2]);

    useEffect(() => {
        if (success) {
            navigate('/profile');
        }
    }, [success, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password1 !== password2) {
            setErrMsg('passwords did not match!');
        } else {
            const password = password1;

            try {
                const response = await axios.post(SIGNUP_URL, {
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    password,
                });

                setEmail('');
                setFirstName('');
                setLastName('');
                setPassword1('');
                setPassword2('');
                console.log(response.data);
                setSuccess(true);
            } catch (err) {
                console.log(err);
                if (!err.response) {
                    setErrMsg('No Server Response');
                } else {
                    const errorMessage = Object.values(err.response.data)[0][0];
                    setErrMsg(errorMessage);
                }

                errRef.current.focus();
            }
        }
    };

    return (
        <section className='container'>
            <p
                ref={errRef}
                className={errMsg ? 'text-danger bg-white shadow-lg p-3 w-100' : 'd-none'}
                aria-live='assertive'
            >
                {errMsg}
            </p>
            <h1>Sign Up</h1>
            <form className='form-group' onSubmit={handleSubmit}>
                <label htmlFor='email'>Email address:</label>
                <input
                    className='form-control'
                    type='email'
                    id='email'
                    ref={userRef}
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />

                <label htmlFor='firstName'>First name:</label>
                <input
                    className='form-control'
                    type='text'
                    id='firstName'
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    required
                />
                <label htmlFor='lastName'>Last Name:</label>
                <input
                    className='form-control'
                    type='text'
                    id='lastName'
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    required
                />

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

                <button className='btn btn-primary m-2'>Sign In</button>
            </form>
            <p>
                Already have an Account?
                <br />
                <span className='line'>
                    {/*put router link here*/}
                    <Link to='/login'>Sign in</Link>
                </span>
            </p>
        </section>
    );
};

export default Signup;
