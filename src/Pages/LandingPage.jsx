import { Link } from 'react-router-dom';
import CenteredFormContainer from '../Components/CenteredFormContainer';
import './LandingPage.css';


function LandingPage(){
    return (
        <div className='bg'>
            <CenteredFormContainer>
                <h1 landing-logo>Momentum</h1>
                <div className="landing-links">
                    <Link to="/login" className="landing-link">Login</Link>
                    <span className="landing-divider">|</span>
                    <Link to="/register" className="landing-link">Register</Link>
                </div>
            </CenteredFormContainer>
        </div>
    )
}

export default LandingPage