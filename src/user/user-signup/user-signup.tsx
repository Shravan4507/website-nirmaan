import { useNavigate, useLocation } from 'react-router-dom'
import { auth, db, storage } from '../../config/firebase'
import { doc, runTransaction, serverTimestamp, query, collection, where, getDocs, increment } from 'firebase/firestore'
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
    const [isSuccess, setIsSuccess] = useState(false)
    const [submitStep, setSubmitStep] = useState(0)
    const [referralStatus, setReferralStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle')
    const [referralOwner, setReferralOwner] = useState<string | null>(null)

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
        referralCode: '',
        avatar: photoURL || null as string | null
    })

    const studyYears = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Passed Out"]
    const currentYear = new Date().getFullYear()
    const completionYears = Array.from({ length: 10 }, (_, i) => (currentYear - 2 + i).toString())

    // DOB Restrictions (Age 12 to 27)
    const today = new Date()
    const maxDob = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate()).toISOString().split('T')[0]
    const minDob = new Date(today.getFullYear() - 27, today.getMonth(), today.getDate()).toISOString().split('T')[0]

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

    useEffect(() => {
        const verifyReferral = async () => {
            if (formData.referralCode.length === 12) {
                setReferralStatus('verifying')
                try {
                    const q = query(collection(db, 'users'), where('ncode', '==', formData.referralCode))
                    const querySnapshot = await getDocs(q)
                    
                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data()
                        setReferralOwner(userData.firstName)
                        setReferralStatus('valid')
                    } else {
                        setReferralStatus('invalid')
                        setReferralOwner(null)
                    }
                } catch (error) {
                    console.error('Error verifying referral:', error)
                    setReferralStatus('invalid')
                }
            } else {
                setReferralStatus('idle')
                setReferralOwner(null)
            }
        }

        const timer = setTimeout(verifyReferral, 500)
        return () => clearTimeout(timer)
    }, [formData.referralCode])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        
        // Name validation: No numbers or special characters
        if (name === 'firstName' || name === 'lastName') {
            const cleanValue = value.replace(/[^a-zA-Z\s]/g, '')
            setFormData(prev => ({ ...prev, [name]: cleanValue }))
            return
        }

        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleReferralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase();
        
        // Remove all non-alphanumeric
        const raw = value.replace(/[^A-Z0-9]/g, '');
        
        let formatted = 'NRM-';
        
        // Fixed prefix NRM-
        if (raw.startsWith('NRM')) {
            const afterPrefix = raw.slice(3);
            
            // Part 1: Three letters (no numbers)
            const lettersMatch = afterPrefix.match(/^[A-Z]*/);
            const letters = (lettersMatch ? lettersMatch[0] : '').slice(0, 3);
            
            formatted += letters;
            
            // Part 2: Number (if we have letters)
            if (letters.length === 3) {
                formatted += '-';
                const numbersMatch = afterPrefix.slice(letters.length).match(/^[0-9]*/);
                const numbers = (numbersMatch ? numbersMatch[0] : '').slice(0, 4);
                formatted += numbers;
            }
        }
        
        setFormData(prev => ({ ...prev, referralCode: formatted }));
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
            let googleAvatarUrl = photoURL || null
            let avatarType = 'custom' // default to custom if they uploaded one

            // Helper to fetch external image and convert to blob
            const fetchAndUpload = async (url: string, path: string) => {
                try {
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const storageRef = ref(storage, path);
                    await uploadString(storageRef, await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(blob);
                    }), 'data_url');
                    return await getDownloadURL(storageRef);
                } catch (e) {
                    console.error("Fetch/Upload Error:", e);
                    return url;
                }
            };

            // 1. If custom image was uploaded/cropped
            if (formData.avatar && formData.avatar.startsWith('data:image')) {
                const customRef = ref(storage, `avatars/${user.uid}/custom`)
                await uploadString(customRef, formData.avatar, 'data_url')
                customAvatarUrl = await getDownloadURL(customRef)
                avatarUrl = customAvatarUrl
                avatarType = 'custom'
            } else if (photoURL) {
                // They are using Google photo initially
                avatarType = 'google'
            }

            // 2. Cache Google Photo to Storage ALWAYS (to avoid CORS later)
            if (photoURL) {
                googleAvatarUrl = await fetchAndUpload(photoURL, `avatars/${user.uid}/google`);
                if (avatarType === 'google') avatarUrl = googleAvatarUrl;
            }

            // Step 3: N-Code Generation
            setSubmitStep(3)
            const nCode = await generateNCode(formData.firstName)

            // Step 4: Finalize Profile & Handle Referral
            setSubmitStep(4)
            
            await runTransaction(db, async (transaction) => {
                let userPoints = 0;
                let referredByUid = null;

                // Handle Referral Points if code provided
                if (formData.referralCode) {
                    const referralCodeUpper = formData.referralCode.toUpperCase().trim();
                    const q = query(collection(db, 'users'), where('nCode', '==', referralCodeUpper));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const referrerDoc = querySnapshot.docs[0];
                        const referrerData = referrerDoc.data();
                        const referrerRef = doc(db, 'users', referrerDoc.id);

                        referredByUid = referrerDoc.id;
                        userPoints = 100; // New user gets 100 for using a code

                        // Referrer gets 150 (same college) or 200 (diff college)
                        const referrerBonus = referrerData.college === formData.college ? 150 : 200;
                        
                        transaction.update(referrerRef, {
                            points: increment(referrerBonus),
                            referralCount: increment(1)
                        });
                    }
                }

                // Create the user document
                const userRef = doc(db, 'users', user.uid);
                transaction.set(userRef, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    whatsapp: formData.whatsapp,
                    dob: formData.dob,
                    sex: formData.sex,
                    college: formData.college,
                    major: formData.major,
                    yearOfStudy: formData.yearOfStudy,
                    completionYear: formData.completionYear,
                    referralCode: formData.referralCode.toUpperCase().trim(),
                    referredBy: referredByUid,
                    points: userPoints,
                    referralCount: 0,
                    avatar: avatarUrl,
                    googleAvatar: googleAvatarUrl,
                    customAvatar: customAvatarUrl,
                    avatarType: avatarType,
                    nCode: nCode,
                    uid: user.uid,
                    role: 'user',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            });

            // Step 5: Almost there
            setSubmitStep(5)
            await new Promise(resolve => setTimeout(resolve, 1000))

            setIsSuccess(true)
            setIsSubmitting(false)
            
            setTimeout(() => {
                navigate('/user-dashboard')
            }, 3000)

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
        
        // Age validation (extra layer for manual entry)
        if (formData.dob < minDob || formData.dob > maxDob) {
            return `Nirmaan '26 is open for participants aged 12 to 27 only. (Born between ${minDob.split('-')[2]}/${minDob.split('-')[1]}/${minDob.split('-')[0]} and ${maxDob.split('-')[2]}/${maxDob.split('-')[1]}/${maxDob.split('-')[0]})`
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

                    <form className={`signup-form ${isSubmitting || isSuccess ? 'is-locked' : ''}`} onSubmit={handleSubmit}>
                        {/* Profile Picture Section */}
                        <div className="profile-upload-section">
                            <label>Profile Picture</label>
                            <div
                                className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${formData.avatar ? 'has-image' : ''} ${isSubmitting || isSuccess ? 'disabled' : ''}`}
                                onDragOver={!isSubmitting && !isSuccess ? handleDragOver : undefined}
                                onDragLeave={!isSubmitting && !isSuccess ? handleDragLeave : undefined}
                                onDrop={!isSubmitting && !isSuccess ? handleDrop : undefined}
                                onClick={() => !isSubmitting && !isSuccess && document.getElementById('avatar-input')?.click()}
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
                                    disabled={isSubmitting || isSuccess}
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
                                    disabled={isSubmitting || isSuccess}
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
                                    disabled={isSubmitting || isSuccess}
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
                                    disabled={isSubmitting || isSuccess}
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
                                    disabled={isSubmitting || isSuccess}
                                />
                            </div>

                            <div className="form-group">
                                <label>Date of Birth*</label>
                                <Calendar
                                    value={formData.dob}
                                    onChange={(val: string) => handleDropdownChange('dob', val)}
                                    minDate={minDob}
                                    maxDate={maxDob}
                                    readOnly={isSubmitting || isSuccess}
                                />
                            </div>

                            <div className="form-group">
                                <label>Sex*</label>
                                <SearchableDropdown
                                    options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
                                    value={formData.sex}
                                    onChange={(val) => handleDropdownChange('sex', val)}
                                    placeholder="Select Sex"
                                    allowManual={false}
                                    disabled={isSubmitting || isSuccess}
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
                                    disabled={isSubmitting || isSuccess}
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
                                    disabled={isSubmitting || isSuccess}
                                />
                            </div>

                            <div className="form-group">
                                <label>Current Year*</label>
                                <SearchableDropdown
                                    options={studyYears}
                                    value={formData.yearOfStudy}
                                    onChange={(val) => handleDropdownChange('yearOfStudy', val)}
                                    placeholder="Select Year"
                                    disabled={isSubmitting || isSuccess}
                                />
                            </div>

                            <div className="form-group">
                                <label>Graduation Year*</label>
                                <SearchableDropdown
                                    options={completionYears}
                                    value={formData.completionYear}
                                    onChange={(val) => handleDropdownChange('completionYear', val)}
                                    placeholder="Select Year"
                                    disabled={isSubmitting || isSuccess}
                                />
                            </div>

                            <div className="form-group form-group--full">
                                <label>Referral Code (Optional) - Get 100 bonus points!</label>
                                <div className="referral-input-wrapper">
                                    <input
                                        type="text"
                                        name="referralCode"
                                        placeholder="NRM-ABC-0000"
                                        value={formData.referralCode}
                                        onChange={handleReferralChange}
                                        className={`referral-input ${referralStatus}`}
                                        maxLength={12}
                                        disabled={isSubmitting || isSuccess}
                                    />
                                    <div className="referral-status-icon">
                                        {referralStatus === 'verifying' && <div className="referral-spinner"></div>}
                                        {referralStatus === 'valid' && <span className="status-valid">✓</span>}
                                        {referralStatus === 'invalid' && <span className="status-invalid">×</span>}
                                    </div>
                                </div>
                                {referralStatus === 'valid' && referralOwner && (
                                    <p className="referral-hint success">✓ Valid code! Referred by {referralOwner}</p>
                                )}
                                {referralStatus === 'invalid' && (
                                    <p className="referral-hint error">× Invalid referral code. No user found with this N-Code.</p>
                                )}
                            </div>
                        </div>

                        <div className="signup-footer">
                            <button 
                                type="submit" 
                                className={`signup-btn ${isSubmitting ? 'submitting' : ''} ${isSuccess ? 'success' : ''}`}
                                disabled={isSubmitting || isSuccess}
                            >
                                {isSuccess ? (
                                    <div className="btn-success-content">
                                        <span className="btn-check">✓</span>
                                        <span>Registration Complete!</span>
                                    </div>
                                ) : isSubmitting ? (
                                    <div className="btn-progress-content">
                                        <div className="btn-progress-top">
                                            <div className="btn-mini-spinner"></div>
                                            <span>{submissionSteps[submitStep]}</span>
                                        </div>
                                        <div className="btn-progress-bar-container">
                                            <div 
                                                className="btn-progress-bar-fill" 
                                                style={{ width: `${((submitStep + 1) / submissionSteps.length) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : 'Complete Registration'}
                            </button>
                        </div>
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
