// Import Hooks
import {useEffect, useState, useRef} from "react";
import { useNavigate } from 'react-router-dom';
// Import React Bootstrap Components
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// Import Components
import CenteredFormContainer from '../Components/CenteredFormContainer';
// Import React Router Components
import { Link } from 'react-router-dom';
import './RegisterLogin.css';

function Login() {
    const userRef = useRef();
    const errRef = useRef();

    // States for username
    const [username, setUser] = useState('');
    const [usernameFocus, setUsernameFocus] = useState(false)
    // States for pwd
    const [pwd, setPwd] = useState('');
    const [pwdFocus, setPwdFocus] = useState(false);
    // States for errMsg
    const [errMsg, setErrMsg] = useState('');

    // useEffect: When the component mounts, place the cursor in the userRef.current field 
    useEffect(() => {
        userRef.current.focus();
    }, [])

    const navigate = useNavigate();
    const handleSubmit= (e) => {
        e.preventDefault()
        console.log(username, pwd)
        navigate('/dashboard', { state: { username: username } });
    }

    return (
        <CenteredFormContainer>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
            <h1 className="txt-medium-purple">Login</h1>
            <Form onSubmit={handleSubmit}> {/* Since the form just has one button, we do not need to put a onClick event  on that button */}
                <Form.Group className="mb-3" controlId="loginUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="abc" 
                        ref = {userRef}
                        required
                        onChange = {e => setUser(e.target.value)}
                        onFocus = {() => setUsernameFocus(true)}
                        onBlur = {() => setUsernameFocus(false)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginPwd">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                </Form.Group>
               
                <Button  disabled={!username || !pwd  ? true : false} className='btn-primary-custom' type="submit">Login</Button>
            </Form>
            <br/>
            <p>
                Don't have an account?<br />
                <Link to="/register">Register</Link>
            </p>
        </CenteredFormContainer>
    )
}

export default Login;

