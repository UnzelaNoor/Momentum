// Import Hooks
import {useEffect, useState, useRef} from "react";
import { useNavigate } from 'react-router-dom';
// Import React Bootstrap Components
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
// Import Components
import CenteredFormContainer from '../Components/CenteredFormContainer';
// Import FontAwesome
import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// Import React Router Components
import { Link } from 'react-router-dom';
import './RegisterLogin.css';

// Regex
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Register() {
    const userRef = useRef();
    const errRef = useRef();

    // States for username
    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false)
    const [usernameFocus, setUsernameFocus] = useState(false)
    // States for email
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false)
    const [emailFocus, setEmailFocus] = useState(false)
    // States for pwd
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    // States for matchPwd
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    // States for errMsg
    const [errMsg, setErrMsg] = useState('');

    // useEffect: When the component mounts, place the cursor in the userRef.current field 
    useEffect(() => {
        userRef.current.focus();
    }, [])

    // useEffect: Validates
    useEffect(() => {
        const isValid = USER_REGEX.test(username)
        console.log(isValid)
        console.log(username)
        setValidUsername(isValid)
        // setValidUsername(USER_REGEX.test(username)); // Or in short
    }, [username])
    
    // useEffect: Validates
    useEffect(() => {
        const isValid = EMAIL_REGEX.test(email)
        console.log(isValid)
        console.log(email)
        setValidEmail(isValid)
        // setValidEmail(EMAIL_REGEX.test(email)); // Or in short
    }, [email])

    useEffect(() => {
        const isValid = PWD_REGEX.test(pwd)
        console.log(isValid)
        console.log(pwd)
        setValidPwd(isValid)
        const isMatching = pwd === matchPwd
        setValidMatch(isMatching)
        // setValidPwd(PWD_REGEX.test(pwd));
        // setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]) //Having both in the same useEffect allows the both fields to be in 'sync'

    useEffect(() => {
        setErrMsg(''); // Remove the shown error message once the user changes the concerned field
    }, [username, pwd, matchPwd])

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('http://localhost:5000/api/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, pwd })
            })
            const data = await response.json()
            if (!response.ok) {
                setErrMsg(data.message)
                errRef.current.focus()
                return
            }
            localStorage.setItem('token', data.token)
            setUsername('')
            setEmail('')
            setPwd('')
            setMatchPwd('')
            navigate('/dashboard')
        } catch (err) {
            setErrMsg('Registration failed. Try again.')
            errRef.current.focus()
        }
    }

    return (
        <CenteredFormContainer>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p>
            <h1 className="txt-medium-purple">Register</h1>
            <Form onSubmit={handleSubmit}> {/* Since the form just has one button, we do not need to put a onClick event  on that button */}
                <Form.Group className="mb-3" controlId="registerUsername">
                    <Form.Label>
                        Username
                        <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validUsername || !username ? "hide" : "invalid"} />
                    </Form.Label>
                    <Form.Control 
                        type="text" 
                        ref = {userRef}
                        value={username}
                        autoComplete="off" // No need to show previous inputs in registration's case
                        required
                        onChange = {e => setUsername(e.target.value)}
                        onFocus = {() => setUsernameFocus(true)}
                        onBlur = {() => setUsernameFocus(false)}
                    />
                </Form.Group>
                <p id="uidnote" className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 24 characters.<br />
                    Must begin with a letter.<br />
                    Letters, numbers, underscores, hyphens allowed.
                </p>

                <Form.Group className="mb-3" controlId="registerEmail">
                    <Form.Label>
                        Email
                        <FontAwesomeIcon icon={faCheck} className={validEmail && email ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                    </Form.Label>
                    <Form.Control 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        autoComplete="off"
                        required
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                    />
                </Form.Group>
                <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Invalid email address.
                </p>

                <Form.Group className="mb-3" controlId="registerPwd">
                    <Form.Label>
                        Password
                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                    </Form.Label>
                    <Form.Control 
                        type="password" 
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                </Form.Group>
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    8 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: <span>!</span> <span>@</span> <span>#</span> <span>$</span> <span>%</span>
                </p>

                <Form.Group className="mb-3" controlId="registerMatchPwd">
                    <Form.Label>
                        Comfirm Password
                        <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    </Form.Label>
                    <Form.Control 
                        type="password" 
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />
                </Form.Group>
                <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Must match the first password input field.
                </p>
                
                <Button disabled={!validUsername || !validPwd || !validMatch || !validEmail ? true : false} className='btn-primary-custom' type="submit">Register</Button>
            </Form>
            <br/>
            <p>
                Already registered?<br />
                <Link to="/login">Login</Link>
            </p>
        </CenteredFormContainer>
    )
}

export default Register;

// With help from:  https://www.youtube.com/watch?v=brcHK3P6ChQ&t=246s