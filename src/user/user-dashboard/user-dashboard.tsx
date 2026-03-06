import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db, storage } from '../../config/firebase'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'
import { onAuthStateChanged } from 'firebase/auth'
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown'
import Calendar from '../../components/calendar/Calendar'
import ImageCropper from '../../components/image-cropper/ImageCropper'
import colleges from '../../data/colleges.json'
import { majors } from '../../data/majors'
import { useToast } from '../../components/toast/Toast'
import VirtualPass from './VirtualPass'
import './user-dashboard.css'

function UserDashboard() {
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isPassModalOpen, setIsPassModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAllWorkshopsModalOpen, setIsAllWorkshopsModalOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [isWorkshopsClosing, setIsWorkshopsClosing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [imageToCrop, setImageToCrop] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // Placeholder data for the dashboard
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        nCode: "",
        email: "",
        phone: "",
        whatsapp: "",
        dob: "",
        sex: "",
        college: "",
        major: "",
        yearOfStudy: "",
        completionYear: "",
        avatar: "",
        googleAvatar: "",
        customAvatar: "" as string | null,
        avatarType: "google" as "google" | "custom",
        registeredWorkshops: [] as any[]
    })

    const [editForm, setEditForm] = useState({ ...user })

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
                    if (userDoc.exists()) {
                        const data = userDoc.data()
                        const userData = {
                            firstName: data.firstName || "",
                            lastName: data.lastName || "",
                            nCode: data.nCode || "",
                            email: data.email || "",
                            phone: data.phone || "",
                            whatsapp: data.whatsapp || "",
                            dob: data.dob || "",
                            sex: data.sex || "",
                            college: data.college || "",
                            major: data.major || "",
                            yearOfStudy: data.yearOfStudy || "",
                            completionYear: data.completionYear || "",
                            avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
                            googleAvatar: data.googleAvatar || data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
                            customAvatar: data.customAvatar || null,
                            avatarType: data.avatarType || "google",
                            registeredWorkshops: data.registeredWorkshops || []
                        }
                        setUser(userData)
                        setEditForm(userData)
                    } else {
                        showToast('Profile Not Found', 'Please complete your registration.', 'warning')
                        navigate('/user-signup')
                    }
                } catch (err) {
                    console.error('Error fetching user data:', err)
                    showToast('Error', 'Failed to load profile data.', 'error')
                } finally {
                    setLoading(false)
                }
            } else {
                navigate('/login')
            }
        })

        return () => unsubscribe()
    }, [navigate, showToast])

    const studyYears = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Passed Out"]
    const currentYear = new Date().getFullYear()
    const completionYears = Array.from({ length: 10 }, (_, i) => (currentYear - 2 + i).toString())

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsEditModalOpen(false)
            setIsClosing(false)
        }, 300)
    }

    const handleWorkshopsClose = () => {
        setIsWorkshopsClosing(true)
        setTimeout(() => {
            setIsAllWorkshopsModalOpen(false)
            setIsWorkshopsClosing(false)
        }, 300)
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const firebaseUser = auth.currentUser
        if (!firebaseUser) return

        setIsSubmitting(true)
        try {
            let finalAvatar = editForm.avatar
            let customAvatarUrl = editForm.customAvatar
            let avatarType = editForm.avatarType

            // If a new custom image was uploaded/cropped (it's a data URL)
            if (editForm.avatar.startsWith('data:image')) {
                const avatarRef = ref(storage, `avatars/${firebaseUser.uid}`)
                await uploadString(avatarRef, editForm.avatar, 'data_url')
                finalAvatar = await getDownloadURL(avatarRef)
                customAvatarUrl = finalAvatar
                avatarType = 'custom'
            }

            const updateData = {
                major: editForm.major,
                yearOfStudy: editForm.yearOfStudy,
                completionYear: editForm.completionYear,
                avatar: finalAvatar,
                customAvatar: customAvatarUrl,
                avatarType: avatarType,
                updatedAt: serverTimestamp()
            }

            await updateDoc(doc(db, 'users', firebaseUser.uid), updateData)
            
            const updatedUser = { ...user, ...editForm, avatar: finalAvatar, customAvatar: customAvatarUrl, avatarType }
            setUser(updatedUser)
            setEditForm(updatedUser)
            showToast('Success', 'Profile updated successfully!', 'success')
            handleClose()
        } catch (err) {
            console.error('Update error:', err)
            showToast('Update Failed', 'Could not save your changes.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleAvatarType = (type: 'google' | 'custom') => {
        if (type === 'custom' && !editForm.customAvatar && !editForm.avatar.startsWith('data:')) {
            showToast('No Custom Photo', 'Please upload a photo first to use the custom option.', 'info')
            return
        }
        
        setEditForm(prev => ({
            ...prev,
            avatarType: type,
            avatar: type === 'google' ? prev.googleAvatar : (prev.customAvatar || prev.avatar)
        }))
    }

    const handleDropdownChange = (name: string, value: string) => {
        setEditForm(prev => ({ ...prev, [name]: value }))
    }

    const handleLogout = async () => {
        try {
            await auth.signOut()
            showToast('Logged Out', 'Successfully logged out.', 'info')
            navigate('/login')
        } catch (err) {
            console.error('Logout error:', err)
            showToast('Error', 'Failed to log out.', 'error')
        }
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
        setEditForm(prev => ({ 
            ...prev, 
            avatar: croppedImage,
            avatarType: 'custom'
        }))
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

    if (loading) {
        return (
            <div className="user-dashboard-loading">
                <div className="user-loader"></div>
                <p>Loading your profile...</p>
            </div>
        )
    }

    return (
        <div className="user-dashboard-page">
            <div className="user-dashboard-container">
                {/* Header Section */}
                <header className="user-dashboard-header">
                    <div className="user-dashboard-profile">
                        <div className="user-dashboard-avatar">
                            <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        </div>
                        <div className="user-dashboard-info">
                            <h1 className="user-dashboard-name">Welcome, {user.firstName} {user.lastName}</h1>
                            <p className="user-dashboard-id">N-Code: <span>{user.nCode}</span></p>
                        </div>
                    </div>
                    <div className="user-dashboard-header-actions">
                        <button className="user-edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
                        <button className="user-logout-btn" onClick={handleLogout}>Log Out</button>
                    </div>
                </header>


                {/* Main Content Grid */}
                <div className="user-dashboard-grid">
                    {/* Quick Actions / Notifications */}
                    <section className="user-dashboard-section user-actions-section">
                        <div className="user-section-header">
                            <h2>Quick Actions</h2>
                        </div>
                        <div className="user-action-buttons">
                            <button className="user-action-btn" onClick={() => setIsPassModalOpen(true)}>Show Pass</button>
                            <button className="user-action-btn">Download Ticket</button>
                            <button className="user-action-btn">View Schedule</button>
                            <button className="user-action-btn">Find Team</button>
                            <button className="user-action-btn user-action-btn--secondary">Join Discord</button>
                        </div>
                    </section>

                    {/* Registered Events Section */}
                    <section className="user-dashboard-section user-workshops-section">
                        <div className="user-section-header">
                            <h2>My Workshops</h2>
                            <button className="user-view-all-btn" onClick={() => setIsAllWorkshopsModalOpen(true)}>View All</button>
                        </div>
                        <div className="user-workshops-list">
                            {user.registeredWorkshops.slice(0, 3).map(workshop => (
                                <div key={workshop.id} className="user-workshop-item">
                                    <div className="user-workshop-info">
                                        <h3>{workshop.name}</h3>
                                        <p>{workshop.category} • {workshop.date}</p>
                                    </div>
                                    <div className={`user-workshop-status user-status-${workshop.status.toLowerCase().replace(' ', '-')}`}>
                                        {workshop.status}
                                    </div>
                                </div>
                            ))}
                            {user.registeredWorkshops.length > 3 && (
                                <p className="user-more-workshops-hint">+{user.registeredWorkshops.length - 3} more workshops registered</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Virtual Pass Modal */}
            <VirtualPass 
                isOpen={isPassModalOpen} 
                onClose={() => setIsPassModalOpen(false)} 
                user={user} 
            />

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className={`user-modal-overlay ${isClosing ? 'user-closing' : ''}`} onClick={handleClose}>
                    <div className="user-modal-card user-modal-card--large" onClick={e => e.stopPropagation()}>
                        <div className="user-modal-header">
                            <h2>Edit Profile</h2>
                            <button className="user-close-btn" onClick={handleClose}>&times;</button>
                        </div>
                        <form className="user-edit-form" onSubmit={handleEditSubmit}>
                            {/* Profile Picture Upload Section */}
                            <div className="user-profile-upload-section">
                                <div className="user-avatar-source-toggle">
                                    <label>Profile Picture Source</label>
                                    <div className="user-toggle-buttons">
                                        <button 
                                            type="button"
                                            className={`user-toggle-btn ${editForm.avatarType === 'google' ? 'active' : ''}`}
                                            onClick={() => toggleAvatarType('google')}
                                        >
                                            Google
                                        </button>
                                        <button 
                                            type="button"
                                            className={`user-toggle-btn ${editForm.avatarType === 'custom' ? 'active' : ''}`}
                                            onClick={() => toggleAvatarType('custom')}
                                        >
                                            Custom
                                        </button>
                                    </div>
                                </div>

                                <div
                                    className={`user-upload-dropzone ${isDragging ? 'user-dragging' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('avatar-input')?.click()}
                                >
                                    <div className="user-upload-preview">
                                        <img src={editForm.avatar} alt="Preview" />
                                    </div>
                                    <div className="user-upload-text">
                                        <p><span>Upload new custom photo</span> or drag and drop</p>
                                        <p className="user-upload-hint">SVG, PNG, JPG (max. 1MB)</p>
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

                            <div className="user-form-grid user-form-grid--3-col">
                                <div className="user-form-group">
                                    <label>First Name</label>
                                    <input type="text" value={editForm.firstName} readOnly className="user-read-only-input" />
                                </div>
                                <div className="user-form-group">
                                    <label>Last Name</label>
                                    <input type="text" value={editForm.lastName} readOnly className="user-read-only-input" />
                                </div>
                                <div className="user-form-group">
                                    <label>Email Address</label>
                                    <input type="email" value={editForm.email} readOnly className="user-read-only-input" />
                                </div>
                                <div className="user-form-group">
                                    <label>Cell Phone</label>
                                    <input type="text" value={editForm.phone} readOnly className="user-read-only-input" />
                                </div>
                                <div className="user-form-group">
                                    <label>WhatsApp Number</label>
                                    <input type="text" value={editForm.whatsapp} readOnly className="user-read-only-input" />
                                </div>
                                <div className="user-form-group">
                                    <Calendar
                                        value={editForm.dob}
                                        onChange={(val: string) => handleDropdownChange('dob', val)}
                                        label="Date of Birth"
                                        readOnly
                                    />
                                </div>
                                <div className="user-form-group">
                                    <SearchableDropdown
                                        options={['Male', 'Female', 'Other']}
                                        value={editForm.sex}
                                        onChange={() => { }} // Read-only
                                        placeholder="Sex"
                                        label="Sex"
                                        readOnly
                                        allowManual={false}
                                    />
                                </div>
                                <div className="user-form-group user-form-group--span-2">
                                    <SearchableDropdown
                                        options={[...colleges]}
                                        value={editForm.college}
                                        onChange={() => { }} // Read-only
                                        placeholder="College"
                                        label="College"
                                        readOnly
                                    />
                                </div>
                                <div className="user-form-group">
                                    <label>N-Code</label>
                                    <input type="text" value={editForm.nCode} readOnly className="user-read-only-input" />
                                </div>
                                <div className="user-form-group user-form-group--span-2">
                                    <SearchableDropdown
                                        options={[...majors]}
                                        value={editForm.major}
                                        onChange={(val) => handleDropdownChange('major', val)}
                                        placeholder="Select or Search Major"
                                        label="Major / Branch"
                                        required
                                    />
                                </div>
                                <div className="user-form-group">
                                    <SearchableDropdown
                                        options={studyYears}
                                        value={editForm.yearOfStudy}
                                        onChange={(val) => handleDropdownChange('yearOfStudy', val)}
                                        placeholder="Select Year"
                                        label="Year of Study"
                                        required
                                        allowManual={false}
                                    />
                                </div>
                                <div className="user-form-group">
                                    <SearchableDropdown
                                        options={completionYears}
                                        value={editForm.completionYear}
                                        onChange={(val) => handleDropdownChange('completionYear', val)}
                                        placeholder="Select Year"
                                        label="Completion Year"
                                        required
                                        allowManual={false}
                                    />
                                </div>
                            </div>

                            <div className="user-modal-footer">
                                <button type="button" className="user-cancel-btn" onClick={handleClose} disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className="user-save-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* All Workshops Modal */}
            {isAllWorkshopsModalOpen && (
                <div className={`user-modal-overlay ${isWorkshopsClosing ? 'user-closing' : ''}`} onClick={handleWorkshopsClose}>
                    <div className="user-modal-card user-modal-card--large" onClick={e => e.stopPropagation()}>
                        <div className="user-modal-header">
                            <h2>All Registered Workshops</h2>
                            <button className="user-close-btn" onClick={handleWorkshopsClose}>&times;</button>
                        </div>
                        <div className="user-all-workshops-grid">
                            {user.registeredWorkshops.map(workshop => (
                                <div key={workshop.id} className="user-workshop-card-premium">
                                    <div className="user-workshop-card-header">
                                        <span className="user-workshop-category-tag">{workshop.category}</span>
                                        <span className={`user-workshop-status-tag user-status-${workshop.status.toLowerCase().replace(' ', '-')}`}>
                                            {workshop.status}
                                        </span>
                                    </div>
                                    <div className="user-workshop-card-content">
                                        <h3>{workshop.name}</h3>
                                        <p className="user-workshop-date">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            {workshop.date}
                                        </p>
                                    </div>
                                    <div className="user-workshop-card-footer">
                                        <button className="user-workshop-action-btn">Workshop Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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

export default UserDashboard
