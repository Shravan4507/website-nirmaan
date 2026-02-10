import { useState } from 'react'
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown'
import Calendar from '../../components/calendar/Calendar'
import ImageCropper from '../../components/image-cropper/ImageCropper'
import colleges from '../../data/colleges.json'
import { majors } from '../../data/majors'
import './user-dashboard.css'

function UserDashboard() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAllEventsModalOpen, setIsAllEventsModalOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [isEventsClosing, setIsEventsClosing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [imageToCrop, setImageToCrop] = useState<string | null>(null)

    // Placeholder data for the dashboard
    const [user, setUser] = useState({
        firstName: "Alex",
        lastName: "Johnson",
        zKey: "NRM-ALE-0001",
        email: "alex.johnson@example.com",
        phone: "+91 98765 43210",
        dob: "2004-05-15",
        sex: "Male",
        college: "Zeal College of Engineering and Research",
        major: "Computer Engineering",
        yearOfStudy: "3rd Year",
        completionYear: "2027",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        registeredEvents: [
            { id: 1, name: "Robo-Sumo", category: "Technical", status: "Confirmed", date: "March 15, 2026" },
            { id: 2, name: "Code Sprint", category: "Technical", status: "Pending Payment", date: "March 16, 2026" },
            { id: 3, name: "Poster Making", category: "Creative", status: "Confirmed", date: "March 17, 2026" },
            { id: 4, name: "Shark Tank", category: "Business", status: "Confirmed", date: "March 18, 2026" },
            { id: 5, name: "Dance Faceoff", category: "Cultural", status: "Verified", date: "March 20, 2026" }
        ]
    })

    const [editForm, setEditForm] = useState({ ...user })

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

    const handleEventsClose = () => {
        setIsEventsClosing(true)
        setTimeout(() => {
            setIsAllEventsModalOpen(false)
            setIsEventsClosing(false)
        }, 300)
    }

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setUser({ ...user, ...editForm })
        handleClose()
    }

    const handleDropdownChange = (name: string, value: string) => {
        setEditForm(prev => ({ ...prev, [name]: value }))
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
        setEditForm(prev => ({ ...prev, avatar: croppedImage }))
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

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                {/* Header Section */}
                <header className="dashboard-header">
                    <div className="user-profile">
                        <div className="user-avatar">
                            <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                        </div>
                        <div className="user-info">
                            <h1 className="user-name">Welcome, {user.firstName} {user.lastName}</h1>
                            <p className="user-id">Z-Key: <span>{user.zKey}</span></p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
                    </div>
                </header>


                {/* Main Content Grid */}
                <div className="dashboard-grid">
                    {/* Quick Actions / Notifications */}
                    <section className="dashboard-section actions-section">
                        <div className="section-header">
                            <h2>Quick Actions</h2>
                        </div>
                        <div className="action-buttons">
                            <button className="action-btn">Download Ticket</button>
                            <button className="action-btn">View Schedule</button>
                            <button className="action-btn">Find Team</button>
                            <button className="action-btn action-btn--secondary">Join Discord</button>
                        </div>
                    </section>

                    {/* Registered Events Section */}
                    <section className="dashboard-section events-section">
                        <div className="section-header">
                            <h2>My Events</h2>
                            <button className="view-all-btn" onClick={() => setIsAllEventsModalOpen(true)}>View All</button>
                        </div>
                        <div className="events-list">
                            {user.registeredEvents.slice(0, 3).map(event => (
                                <div key={event.id} className="event-item">
                                    <div className="event-info">
                                        <h3>{event.name}</h3>
                                        <p>{event.category} • {event.date}</p>
                                    </div>
                                    <div className={`event-status status-${event.status.toLowerCase().replace(' ', '-')}`}>
                                        {event.status}
                                    </div>
                                </div>
                            ))}
                            {user.registeredEvents.length > 3 && (
                                <p className="more-events-hint">+{user.registeredEvents.length - 3} more events registered</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
                    <div className="modal-card modal-card--large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit Profile</h2>
                            <button className="close-btn" onClick={handleClose}>&times;</button>
                        </div>
                        <form className="edit-form" onSubmit={handleEditSubmit}>
                            {/* Profile Picture Upload Section */}
                            <div className="profile-upload-section">
                                <label>Profile Picture</label>
                                <div
                                    className={`upload-dropzone ${isDragging ? 'dragging' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('avatar-input')?.click()}
                                >
                                    <div className="upload-preview">
                                        <img src={editForm.avatar} alt="Preview" />
                                    </div>
                                    <div className="upload-text">
                                        <p><span>Click to upload</span> or drag and drop</p>
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

                            <div className="form-grid form-grid--3-col">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" value={editForm.firstName} readOnly className="read-only-input" />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" value={editForm.lastName} readOnly className="read-only-input" />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" value={editForm.email} readOnly className="read-only-input" />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input type="text" value={editForm.phone} readOnly className="read-only-input" />
                                </div>
                                <div className="form-group">
                                    <Calendar
                                        value={editForm.dob}
                                        onChange={(val: string) => handleDropdownChange('dob', val)}
                                        label="Date of Birth"
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
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
                                <div className="form-group form-group--span-2">
                                    <SearchableDropdown
                                        options={[...colleges]}
                                        value={editForm.college}
                                        onChange={() => { }} // Read-only
                                        placeholder="College"
                                        label="College"
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Z-Key</label>
                                    <input type="text" value={editForm.zKey} readOnly className="read-only-input" />
                                </div>
                                <div className="form-group">
                                    <SearchableDropdown
                                        options={[...majors]}
                                        value={editForm.major}
                                        onChange={(val) => handleDropdownChange('major', val)}
                                        placeholder="Select or Search Major"
                                        label="Major / Branch"
                                        required
                                    />
                                </div>
                                <div className="form-group">
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
                                <div className="form-group">
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

                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={handleClose}>Cancel</button>
                                <button type="submit" className="save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* All Events Modal */}
            {isAllEventsModalOpen && (
                <div className={`modal-overlay ${isEventsClosing ? 'closing' : ''}`} onClick={handleEventsClose}>
                    <div className="modal-card modal-card--large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>All Registered Events</h2>
                            <button className="close-btn" onClick={handleEventsClose}>&times;</button>
                        </div>
                        <div className="all-events-grid">
                            {user.registeredEvents.map(event => (
                                <div key={event.id} className="event-card-premium">
                                    <div className="event-card-header">
                                        <span className="event-category-tag">{event.category}</span>
                                        <span className={`event-status-tag status-${event.status.toLowerCase().replace(' ', '-')}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <div className="event-card-content">
                                        <h3>{event.name}</h3>
                                        <p className="event-date">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            {event.date}
                                        </p>
                                    </div>
                                    <div className="event-card-footer">
                                        <button className="event-action-btn">Event Details</button>
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
