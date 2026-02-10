import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown'
import colleges from '../../data/colleges.json'
import { majors } from '../../data/majors'
import { COMPETITIONS_DATA } from '../../data/competitions'
import { useToast } from '../../components/toast/Toast'
import './register.css'

const STEPS = [
    { id: 1, title: 'Bio & Contact' },
    { id: 2, title: 'Academic Intel' },
    { id: 3, title: 'Squad Details' }
]

function Register() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const compName = searchParams.get('comp') || 'General'
    const queryImg = searchParams.get('img')
    const competition = COMPETITIONS_DATA.find(c => c.title === compName)
    const compImage = queryImg || competition?.image || 'https://images.unsplash.com/photo-1517245385169-d20230a4704f?q=80&w=1200'

    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '+91 ',
        college: '',
        department: '',
        year: '',
        teamName: '',
        teamMembers: ''
    })

    const isTeamBased = ['Codex ’26', 'Robotics Arena ’26', 'UI/UX Challenge'].includes(compName)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [currentStep, isSubmitted])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (!value.startsWith('+91 ')) {
            setFormData(prev => ({ ...prev, phone: '+91 ' }));
            return;
        }
        const digits = value.slice(4).replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, phone: `+91 ${digits}` }));
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!formData.fullName || !formData.email || formData.phone.length < 14) {
                showToast('Registration Error', 'Please fill all contact details correctly.', 'error')
                return
            }
        }
        if (currentStep === 2) {
            if (!formData.college || !formData.department || !formData.year) {
                showToast('Entry Blocked', 'Academic details are essential for eligibility.', 'error')
                return
            }
            if (!isTeamBased) {
                handleSubmit()
                return
            }
        }
        setCurrentStep(prev => prev + 1)
    }

    const prevStep = () => setCurrentStep(prev => prev - 1)

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault()

        // Simulating API call
        console.log('Registering for:', compName, formData)

        setIsSubmitted(true)
        showToast('Success!', 'Registration successful! Check your email.', 'success')
    }

    if (isSubmitted) {
        return (
            <div className="register-page">
                <div className="register-container success-container">
                    <div className="register-hero-image">
                        <img src={compImage} alt={compName} />
                        <div className="hero-overlay"></div>
                        <span className="comp-badge">{compName}</span>
                    </div>
                    <div className="success-content" style={{ padding: '0 40px 40px' }}>
                        <div className="success-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h2>Registration Locked.</h2>
                        <p>
                            You have successfully registered for <strong>{compName}</strong>. <br />
                            A confirmation packet with rulebooks and schedule has been sent to <strong>{formData.email}</strong>.
                        </p>
                        <button className="btn-next" onClick={() => navigate('/competitions')}>
                            Back to Arena
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-hero-image">
                    <img src={compImage} alt={compName} />
                    <div className="hero-overlay"></div>
                    <span className="comp-badge">{compName}</span>
                </div>

                <header className="register-header">
                    <h1>Competition Entry</h1>
                    <p>Secure your slot in the grand technical battlefield of Nirmaan ’26.</p>
                </header>

                <div className="register-steps">
                    {STEPS.map(step => {
                        if (step.id === 3 && !isTeamBased) return null
                        return (
                            <div key={step.id} className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                                <div className="step-number">{currentStep > step.id ? '✓' : step.id}</div>
                                <span className="step-text">{step.title}</span>
                            </div>
                        )
                    })}
                </div>

                <div className="register-form">
                    {currentStep === 1 && (
                        <div className="form-step-content anim-fade-in">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="form-step-content anim-fade-in">
                            <div className="form-grid">
                                <SearchableDropdown
                                    label="College / Institute"
                                    options={colleges}
                                    value={formData.college}
                                    onChange={(val) => setFormData(prev => ({ ...prev, college: val }))}
                                    placeholder="Search your college..."
                                    required
                                />
                                <SearchableDropdown
                                    label="Department / Major"
                                    options={[...majors]}
                                    value={formData.department}
                                    onChange={(val) => setFormData(prev => ({ ...prev, department: val }))}
                                    placeholder="Enter your major"
                                    required
                                />
                                <SearchableDropdown
                                    label="Year of Study"
                                    options={['1st Year', '2nd Year', '3rd Year', '4th Year']}
                                    value={formData.year}
                                    onChange={(val) => setFormData(prev => ({ ...prev, year: val }))}
                                    placeholder="Select Year"
                                    required
                                    allowManual={false}
                                />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && isTeamBased && (
                        <div className="form-step-content anim-fade-in">
                            <div className="form-group">
                                <label>Team Name</label>
                                <input
                                    type="text"
                                    name="teamName"
                                    placeholder="Enter your team name"
                                    value={formData.teamName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>Team Members (Emails or Names)</label>
                                <textarea
                                    name="teamMembers"
                                    placeholder="Enter details of your comrades..."
                                    rows={4}
                                    value={formData.teamMembers}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <footer className="form-actions">
                        {currentStep > 1 && (
                            <button className="btn-prev" onClick={prevStep}>Previous</button>
                        )}
                        <div style={{ marginLeft: 'auto' }}>
                            {currentStep === (isTeamBased ? 3 : 2) ? (
                                <button className="btn-submit" onClick={handleSubmit}>Finish Entry</button>
                            ) : (
                                <button className="btn-next" onClick={nextStep}>Continue</button>
                            )}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default Register
