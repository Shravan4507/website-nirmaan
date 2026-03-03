import { useState } from 'react'
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown'
import Calendar from '../../components/calendar/Calendar'
import ImageCropper from '../../components/image-cropper/ImageCropper'
import colleges from '../../data/colleges.json'
import { majors } from '../../data/majors'
import './admin-dashboard.css'

function AdminDashboard() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAllWorkshopsModalOpen, setIsAllWorkshopsModalOpen] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [isWorkshopsClosing, setIsWorkshopsClosing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [imageToCrop, setImageToCrop] = useState<string | null>(null)

    // Placeholder data for the admin dashboard (mirrored from user dashboard)
    const [admin, setAdmin] = useState({
        firstName: "Admin",
        lastName: "User",
        nCode: "ADM-NIR-0001",
        email: "admin@nirmaan.in",
        phone: "+91 98765 43210",
        dob: "1990-01-01",
        sex: "Other",
        college: "Zeal College of Engineering and Research",
        major: "Administration",
        yearOfStudy: "Passed Out",
        completionYear: "2012",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        registeredWorkshops: [
            { id: 1, name: "Robo-Sumo", category: "Technical", status: "Active", date: "March 15, 2026" },
            { id: 2, name: "Code Sprint", category: "Technical", status: "Active", date: "March 16, 2026" },
            { id: 3, name: "Poster Making", category: "Creative", status: "Active", date: "March 17, 2026" },
            { id: 4, name: "Shark Tank", category: "Business", status: "Active", date: "March 18, 2026" },
            { id: 5, name: "Dance Faceoff", category: "Cultural", status: "Active", date: "March 20, 2026" }
        ]
    })

    const [editForm, setEditForm] = useState({ ...admin })

    const studyYears = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Passed Out"]
    const currentYear = new Date().getFullYear()
    const completionYears = Array.from({ length: 15 }, (_, i) => (currentYear - 10 + i).toString())

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

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setAdmin({ ...admin, ...editForm })
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
        <div className="admin-dashboard-page">
            <div className="admin-dashboard-container">
                {/* Header Section */}
                <header className="admin-dashboard-header">
                    <div className="admin-dashboard-profile">
                        <div className="admin-dashboard-avatar">
                            <img src={admin.avatar} alt={`${admin.firstName} ${admin.lastName}`} />
                        </div>
                        <div className="admin-dashboard-info">
                            <h1 className="admin-dashboard-name">Admin Portal: {admin.firstName} {admin.lastName}</h1>
                            <p className="admin-dashboard-id">N-Code: <span>{admin.nCode}</span></p>
                        </div>
                    </div>
                    <div className="admin-dashboard-header-actions">
                        <button className="admin-edit-profile-btn" onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
                    </div>
                </header>


                {/* Main Content Grid */}
                <div className="admin-dashboard-grid">
                    {/* Admin Actions Section */}
                    <section className="admin-dashboard-section admin-actions-section">
                        <div className="admin-section-header">
                            <h2>Admin Controls</h2>
                        </div>
                        <div className="admin-action-buttons">
                            <button className="admin-action-btn">Manage Registrations</button>
                            <button className="admin-action-btn">Workshop Analytics</button>
                            <button className="admin-action-btn">Broadcast Notice</button>
                            <button className="admin-action-btn admin-action-btn--secondary">Database Access</button>
                        </div>
                    </section>

                    {/* Active Monitoring Section */}
                    <section className="admin-dashboard-section admin-events-section">
                        <div className="admin-section-header">
                            <h2>Workshop Oversight</h2>
                            <button className="admin-view-all-btn" onClick={() => setIsAllWorkshopsModalOpen(true)}>Monitor All</button>
                        </div>
                        <div className="admin-workshops-list">
                            {admin.registeredWorkshops.slice(0, 3).map(workshop => (
                                <div key={workshop.id} className="admin-workshop-item">
                                    <div className="admin-workshop-info">
                                        <h3>{workshop.name}</h3>
                                        <p>{workshop.category} • {workshop.date}</p>
                                    </div>
                                    <div className={`admin-workshop-status admin-status-${workshop.status.toLowerCase().replace(' ', '-')}`}>
                                        {workshop.status}
                                    </div>
                                </div>
                            ))}
                            {admin.registeredWorkshops.length > 3 && (
                                <p className="admin-more-workshops-hint">Monitoring {admin.registeredWorkshops.length - 3} additional workshops</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className={`admin-modal-overlay ${isClosing ? 'admin-closing' : ''}`} onClick={handleClose}>
                    <div className="admin-modal-card admin-modal-card--large" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>Edit Admin Profile</h2>
                            <button className="admin-close-btn" onClick={handleClose}>&times;</button>
                        </div>
                        <form className="admin-edit-form" onSubmit={handleEditSubmit}>
                            {/* Profile Picture Upload Section */}
                            <div className="admin-profile-upload-section">
                                <label>Profile Picture</label>
                                <div
                                    className={`admin-upload-dropzone ${isDragging ? 'admin-dragging' : ''}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById('avatar-input')?.click()}
                                >
                                    <div className="admin-upload-preview">
                                        <img src={editForm.avatar} alt="Preview" />
                                    </div>
                                    <div className="admin-upload-text">
                                        <p><span>Click to upload</span> or drag and drop</p>
                                        <p className="admin-upload-hint">SVG, PNG, JPG (max. 1MB)</p>
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

                            <div className="admin-form-grid admin-form-grid--3-col">
                                <div className="admin-form-group">
                                    <label>First Name</label>
                                    <input type="text" value={editForm.firstName} readOnly className="admin-read-only-input" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Last Name</label>
                                    <input type="text" value={editForm.lastName} readOnly className="admin-read-only-input" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Email Address</label>
                                    <input type="email" value={editForm.email} readOnly className="admin-read-only-input" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Mobile Number</label>
                                    <input type="text" value={editForm.phone} readOnly className="admin-read-only-input" />
                                </div>
                                <div className="admin-form-group">
                                    <Calendar
                                        value={editForm.dob}
                                        onChange={(val: string) => handleDropdownChange('dob', val)}
                                        label="Date of Birth"
                                        readOnly
                                    />
                                </div>
                                <div className="admin-form-group">
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
                                <div className="admin-form-group admin-form-group--span-2">
                                    <SearchableDropdown
                                        options={[...colleges]}
                                        value={editForm.college}
                                        onChange={() => { }} // Read-only
                                        placeholder="College"
                                        label="College"
                                        readOnly
                                    />
                                </div>
                                <div className="admin-form-group">
                                    <label>Admin N-Code</label>
                                    <input type="text" value={editForm.nCode} readOnly className="admin-read-only-input" />
                                </div>
                                <div className="admin-form-group">
                                    <SearchableDropdown
                                        options={[...majors]}
                                        value={editForm.major}
                                        onChange={(val) => handleDropdownChange('major', val)}
                                        placeholder="Select or Search Major"
                                        label="Major / Branch"
                                        required
                                    />
                                </div>
                                <div className="admin-form-group">
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
                                <div className="admin-form-group">
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

                            <div className="admin-modal-footer">
                                <button type="button" className="admin-cancel-btn" onClick={handleClose}>Cancel</button>
                                <button type="submit" className="admin-save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* All Workshops Oversight Modal */}
            {isAllWorkshopsModalOpen && (
                <div className={`admin-modal-overlay ${isWorkshopsClosing ? 'admin-closing' : ''}`} onClick={handleWorkshopsClose}>
                    <div className="admin-modal-card admin-modal-card--large" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>All Workshop Overviews</h2>
                            <button className="admin-close-btn" onClick={handleWorkshopsClose}>&times;</button>
                        </div>
                        <div className="admin-all-workshops-grid">
                            {admin.registeredWorkshops.map(workshop => (
                                <div key={workshop.id} className="admin-workshop-card-premium">
                                    <div className="admin-workshop-card-header">
                                        <span className="admin-workshop-category-tag">{workshop.category}</span>
                                        <span className={`admin-workshop-status-tag admin-status-${workshop.status.toLowerCase().replace(' ', '-')}`}>
                                            {workshop.status}
                                        </span>
                                    </div>
                                    <div className="admin-workshop-card-content">
                                        <h3>{workshop.name}</h3>
                                        <p className="admin-workshop-date">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            {workshop.date}
                                        </p>
                                    </div>
                                    <div className="admin-workshop-card-footer">
                                        <button className="admin-workshop-action-btn">Manage Workshop</button>
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

export default AdminDashboard
