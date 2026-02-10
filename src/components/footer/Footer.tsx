import { Link } from 'react-router-dom'
const nirmaanLogo = `${import.meta.env.BASE_URL}assets/logos/Logo-2-White.png`
import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__brand">
                    <img src={nirmaanLogo} alt="Nirmaan '26" className="footer__logo" />
                    <p className="footer__tagline">
                        The official annual technical festival of Zeal College of Engineering & Research.
                    </p>
                </div>

                <div className="footer__links">
                    <div className="footer__column">
                        <h3 className="footer__heading">Quick Links</h3>
                        <nav className="footer__nav">
                            <Link to="/" className="footer__link">Home</Link>
                            <Link to="/events" className="footer__link">Events</Link>
                            <Link to="/competitions" className="footer__link">Competitions</Link>
                            <Link to="/sponsors" className="footer__link">Sponsors</Link>
                        </nav>
                    </div>

                    <div className="footer__column">
                        <h3 className="footer__heading">Get Involved</h3>
                        <nav className="footer__nav">
                            <Link to="/join" className="footer__link">Join the Team</Link>
                            <Link to="/members" className="footer__link">Nirmaan Team</Link>
                            <Link to="/contact" className="footer__link">Contact Us</Link>
                            <Link to="/login" className="footer__link">Login</Link>
                        </nav>
                    </div>

                    <div className="footer__column">
                        <h3 className="footer__heading">Connect</h3>
                        <nav className="footer__nav">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer__link">Instagram</a>
                            <a href="mailto:contact@nirmaan.in" className="footer__link">E-mail</a>
                        </nav>
                    </div>

                    <div className="footer__column">
                        <h3 className="footer__heading">Location</h3>
                        <address className="footer__address">
                            <a href="https://maps.app.goo.gl/zr4Yg3uhrYabnjH49" target="_blank" rel="noopener noreferrer" className="footer__link">Zeal College of Engineering and Research<br /></a>
                            Survey No-39, Dhayari Narhe Rd,<br />
                            Narhe, Pune, Maharashtra 411041
                        </address>
                    </div>
                </div>
            </div>

            <div className="footer__bottom">
                <div className="footer__bottom-left">
                    <p className="footer__copyright">© 2026 Nirmaan. All rights reserved.</p>
                    <div className="footer__legal">
                        <Link to="/privacy" className="footer__link">Privacy Policy</Link>
                        <span className="footer__separator">•</span>
                        <Link to="/terms" className="footer__link">Terms of Service</Link>
                    </div>
                </div>
                <p className="footer__credit">Crafted with innovation by the <Link to="/team" className="footer__link">Nirmaan Team</Link></p>
            </div>
        </footer>
    )
}

export default Footer
