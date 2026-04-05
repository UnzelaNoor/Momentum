import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
    return (
        <div className="landing-page">
            <div className="landing-content">
                <h1 className="landing-title">Momentum</h1>
                <div className="landing-links">
                    <Link to="/login" className="landing-link">Login</Link>
                    <span className="landing-divider">|</span>
                    <Link to="/register" className="landing-link">Register</Link>
                </div>
            </div>
            <p className="landing-tagline">THE DIGITAL SANCTUARY</p>
        </div>
    );
}

export default LandingPage;