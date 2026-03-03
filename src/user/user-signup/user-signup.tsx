import { useNavigate, useLocation } from 'react-router-dom'
import { auth, db, storage } from '../../config/firebase'
import { doc, setDoc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown'
import Calendar from '../../components/calendar/Calendar'
import ImageCropper from '../../components/image-cropper/ImageCropper'
import colleges from '../../data/colleges.json'
import { majors } from '../../data/majors'
import { useToast } from '../../components/toast/Toast'
import './user-signup.css'
import { useState, useEffect } from 'react'

function UserSignup() {
    const navigate = useNavigate()
    const location = useLocation()
    const { email: initialEmail, displayName, photoURL } = location.state || {}
    
    const { showToast } = useToast()
    const [isDragging, setIsDragging] = useState(false)
    const [imageToCrop, setImageToCrop] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStep, setSubmitStep] = useState(0)

    const submissionSteps = [
        "Verifying your details...",
        "Securing your profile...",
        "Uploading avatar...",
        "Generating your unique N-Code...",
        "Setting up your dashboard...",
        "Almost there..."
    ]

    // Parse Google display name
    const [firstName, ...lastNameParts] = (displayName || "").split(" ")
    const lastName = lastNameParts.join(" ")

    const [formData, setFormData] = useState({
        firstName: firstName || '',
        lastName: lastName || '',
        email: initialEmail || '',
        phone: '',
        whatsapp: '',
        dob: '',
        sex: '',
        college: '',
        major: '',
        yearOfStudy: '',
        completionYear: '',
        avatar: photoURL || null as string | null
    })

    const studyYears = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Passed Out"]
    const currentYear = new Date().getFullYear()
    const completionYears = Array.from({ length: 10 }, (_, i) => (currentYear - 2 + i).toString())

    useEffect(() => {
        if (isSubmitting) {
            const handleBeforeUnload = (e: BeforeUnloadEvent) => {
                e.preventDefault()
                e.returnValue = ''
            }
            window.addEventListener('beforeunload', handleBeforeUnload)
            window.history.pushState(null, '', window.location.href)
            const handlePopState = () => {
                window.history.pushState(null, '', window.location.href)
                showToast('Action Blocked', 'Please wait until registration is complete.', 'warning')
            }
            window.addEventListener('popstate', handlePopState)
            
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload)
                window.removeEventListener('popstate', handlePopState)
            }
        }
    }, [isSubmitting, showToast])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!value.startsWith('+91 ')) {
            setFormData(prev => ({ ...prev, [name]: '+91 ' }));
            return;
        }
        const digits = value.slice(4).replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, [name]: `+91 ${digits}` }));
    };

    const handleDropdownChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setImageToCrop(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onCropComplete = (croppedImage: string) => {
        setFormData(prev => ({ ...prev, avatar: croppedImage }))
        setImageToCrop(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        handleImageUpload(file)
    }

    const generateNCode = async (fname: string) => {
        // Use first 3 letters of First Name (uppercase)
        let namePart = fname.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 3);
        
        // Fill gaps with random letters if less than 3 chars
        if (namePart.length < 3) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            while (namePart.length < 3) {
                namePart += chars.charAt(Math.floor(Math.random() * chars.length));
            }
        }
        
        const counterRef = doc(db, 'metadata', 'userCounter')
        
        const newNCode = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef)
            let currentCount = 1
            
            if (counterDoc.exists()) {
                currentCount = counterDoc.data().count + 1
            }
            
            transaction.set(counterRef, { count: currentCount }, { merge: true })
            
            const numberPart = currentCount.toString().padStart(4, '0')
            return `NRM-${namePart}-${numberPart}`
        })
        
        return newNCode
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const error = validateForm()
        if (error) {
            showToast('Validation Error', error, 'error')
            return
        }

        const user = auth.currentUser
        if (!user) {
            showToast('Auth Error', 'You must be logged in with Google.', 'error')
            return
        }

        setIsSubmitting(true)
        
        try {
            // Step 0: Verify
            setSubmitStep(0)
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Step 1: Secure
            setSubmitStep(1)
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Step 2: Avatar Upload
            setSubmitStep(2)
            let avatarUrl = formData.avatar
            let customAvatarUrl = null
            let avatarType = 'google'

            if (formData.avatar && formData.avatar.startsWith('data:image')) {
                const avatarRef = ref(storage, `avatars/${user.uid}`)
                await uploadString(avatarRef, formData.avatar, 'data_url')
                avatarUrl = await getDownloadURL(avatarRef)
                customAvatarUrl = avatarUrl
                avatarType = 'custom'
            }

            // Step 3: N-Code Generation
            setSubmitStep(3)
            const nCode = await generateNCode(formData.firstName)

            // Step 4: Finalize Profile
            setSubmitStep(4)
            await setDoc(doc(db, 'users', user.uid), {
                ...formData,
                avatar: avatarUrl,
                googleAvatar: photoURL || null,
                customAvatar: customAvatarUrl,
                avatarType: avatarType,
                nCode: nCode,
                uid: user.uid,
                role: 'user',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })

            // Step 5: Almost there
            setSubmitStep(5)
            await new Promise(resolve => setTimeout(resolve, 1000))

            showToast('Success!', `Welcome to Nirmaan '26, ${formData.firstName}!`, 'success')
            
            setTimeout(() => {
                navigate('/user-dashboard')
            }, 1000)

        } catch (err: any) {
            console.error('Registration error:', err)
            setIsSubmitting(false)
            showToast('Registration Failed', err.message || 'An error occurred during registration', 'error')
        }
    }

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.whatsapp || !formData.dob || !formData.sex || !formData.college || !formData.major || !formData.yearOfStudy || !formData.completionYear) {
            return 'Please fill in all required fields.'
        }
        if (formData.phone.length < 14) {
            return 'Please enter a valid 10-digit Cell Phone number.'
        }
        if (formData.whatsapp.length < 14) {
            return 'Please enter a valid 10-digit WhatsApp number.'
        }
        return null
    }

    return (
        <div className="signup-page">
            <div className="signup-container">
                <div className="signup-card">
                    <header className="signup-header">
                        <h1>Complete Your Profile</h1>
                        <p>We've fetched your basic details from Google. Just a few more steps!</p>
                    </header>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        {/* Profile Picture Section */}
                        <div className="profile-upload-section">
                            <label>Profile Picture</label>
                            <div
                                className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${formData.avatar ? 'has-image' : ''} ${isSubmitting ? 'disabled' : ''}`}
                                onDragOver={!isSubmitting ? handleDragOver : undefined}
                                onDragLeave={!isSubmitting ? handleDragLeave : undefined}
                                onDrop={!isSubmitting ? handleDrop : undefined}
                                onClick={() => !isSubmitting && document.getElementById('avatar-input')?.click()}
                            >
                                {formData.avatar ? (
                                    <div className="upload-preview">
                                        <img src={formData.avatar} alt="Preview" />
                                    </div>
                                ) : (
                                    <div className="upload-icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                    </div>
                                )}
                                <div className="upload-text">
                                    <p><span>{formData.avatar ? 'Change photo' : 'Upload photo'}</span> or drag and drop</p>
                                    <p className="upload-hint">SVG, PNG, JPG (max. 1MB)</p>
                                </div>
                                <input
                                    type="file"
                                    id="avatar-input"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleImageUpload(e.target.files[0])
                                            e.target.value = ''
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            {/* Identity Section */}
                            <div className="form-group">
                                <label>First Name*</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Your first name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name*</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Your last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Contact Section */}
                            <div className="form-group form-group--full">
                                <label>Email Address*</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    readOnly={!!initialEmail}
                                />
                            </div>
                            <div className="form-group">
                                <label>Cell Phone*</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+91 00000 00000"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>WhatsApp Number*</label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    placeholder="+91 00000 00000"
                                    value={formData.whatsapp}
                                    onChange={handlePhoneChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Date of Birth*</label>
                                <Calendar
                                    value={formData.dob}
                                    onChange={(val: string) => handleDropdownChange('dob', val)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Sex*</label>
                                <SearchableDropdown
                                    options={['Male', 'Female', 'Other']}
                                    value={formData.sex}
                                    onChange={(val) => handleDropdownChange('sex', val)}
                                    placeholder="Select Sex"
                                />
                            </div>

                            {/* Academic Section */}
                            <div className="form-group form-group--full">
                                <label>College Name*</label>
                                <SearchableDropdown
                                    options={colleges}
                                    value={formData.college}
                                    onChange={(val) => handleDropdownChange('college', val)}
                                    placeholder="Search or select your college"
                                    allowManual
                                />
                            </div>

                            <div className="form-group form-group--full">
                                <label>Major / Stream*</label>
                                <SearchableDropdown
                                    options={[...majors]}
                                    value={formData.major}
                                    onChange={(val) => handleDropdownChange('major', val)}
                                    placeholder="Search or select your major"
                                    allowManual
                                />
                            </div>

                            <div className="form-group">
                                <label>Current Year*</label>
                                <SearchableDropdown
                                    options={studyYears}
                                    value={formData.yearOfStudy}
                                    onChange={(val) => handleDropdownChange('yearOfStudy', val)}
                                    placeholder="Select Year"
                                />
                            </div>

                            <div className="form-group">
                                <label>Graduation Year*</label>
                                <SearchableDropdown
                                    options={completionYears}
                                    value={formData.completionYear}
                                    onChange={(val) => handleDropdownChange('completionYear', val)}
                                    placeholder="Select Year"
                                />
                            </div>
                        </div>

                        <div className="signup-footer">
                            <button 
                                type="submit" 
                                className={`signup-btn ${isSubmitting ? 'submitting' : ''}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="loading-container">
                                        <div className="spinner"></div>
                                        <span>Saving Profile...</span>
                                    </div>
                                ) : 'Complete Registration'}
                            </button>
                        </div>

                        {isSubmitting && (
                            <div className="submission-overlay">
                                <div className="loader-box">
                                    <div className="main-spinner"></div>
                                    <div className="progress-text">
                                        <p className="step-label">Step {submitStep + 1} of {submissionSteps.length}</p>
                                        <h3>{submissionSteps[submitStep]}</h3>
                                        <div className="progress-bar-bg">
                                            <div 
                                                className="progress-bar-fill"
                                                style={{ width: `${((submitStep + 1) / submissionSteps.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="locking-notice">Locking your vault. Do not refresh or exit.</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {imageToCrop && (
                <ImageCropper
                    imageSrc={imageToCrop}
                    onCropComplete={onCropComplete}
                    onCancel={() => setImageToCrop(null)}
                />
            )}
        </div>
    )
}

export default UserSignup
