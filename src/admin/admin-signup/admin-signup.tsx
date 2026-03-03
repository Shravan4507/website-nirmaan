import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './admin-signup.css'

const nirmaanLogo = `${import.meta.env.BASE_URL}assets/logos/Logo-2-White.png`

function AdminSignup() {
    const navigate = useNavigate()
    const [showSelection, setShowSelection] = useState(false)

    const handleGoogleSignup = () => {
        // In the future, this will handle Google Auth
        // For now, we show the selection pop-up directly
        setShowSelection(true)
    }

    const handleChoice = (type: 'student' | 'faculty') => {
        navigate(`/admin-signup-form?type=${type}`)
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-card__header">
                    <img src={nirmaanLogo} alt="Nirmaan '26" className="login-card__logo" />
                    <h2 className="login-card__title">Admin Signup</h2>
                    <p className="login-card__subtitle">Join the technical revolution at Nirmaan '26</p>
                </div>

                <div className="login-card__content">
                    <button className="google-btn" onClick={handleGoogleSignup}>
                        <div className="google-btn__icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </div>
                        <span className="google-btn__text">Sign up Using Google</span>
                    </button>
                </div>

                <div className="login-card__footer">
                    <p className="login-card__disclaimer">
                        By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
                    </p>
                </div>
            </div>

            {showSelection && (
                <div className="selection-overlay" onClick={() => window.location.reload()}>
                    <div className="selection-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Identify Yourself</h2>
                        <p>Tell us more about your primary role at Nirmaan '26</p>

                        <div className="selection-grid">
                            <div className="selection-card student" onClick={() => handleChoice('student')}>
                                <div className="selection-card__icon">
                                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <h3>Student</h3>
                                <span>Organizing Member</span>
                            </div>

                            <div className="selection-card faculty" onClick={() => handleChoice('faculty')}>
                                <div className="selection-card__icon">
                                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <h3>Faculty</h3>
                                <span>Department Coordinator</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminSignup
