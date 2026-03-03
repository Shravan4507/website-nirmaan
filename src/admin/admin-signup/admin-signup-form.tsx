import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown'
import Calendar from '../../components/calendar/Calendar'
import ImageCropper from '../../components/image-cropper/ImageCropper'
import './admin-signup-form.css'

function AdminSignupForm() {
    const [searchParams] = useSearchParams()
    const userType = searchParams.get('type') || 'student'

    const [isDragging, setIsDragging] = useState(false)
    const [imageToCrop, setImageToCrop] = useState<string | null>(null)

    // Setup lists based on user type
    const designations = userType === 'faculty' ? [
        "LEAD",
        "STAGE TEAM",
        "DOCUMENTATION TEAM",
        "SOCIAL MEDIA TEAM",
        "DESIGN & CREATIVE TEAM",
        "CREATIVE TEAM",
        "HOSPITALITY TEAM",
        "MARKETING & PUBLIC RELATIONS TEAM",
        "TECHNICAL TEAM",
        "DECORATION TEAM",
        "SPONSORSHIP TEAM"
    ] : [
        "Event Lead",
        "Event Co-Lead",
        "Treasurer",
        "Stage Team",
        "Documentation Team",
        "Social Media Team",
        "Design & Creative Team",
        "Creative Team",
        "Hospitality Team",
        "Marketing & Public Relations Team",
        "Technical Team",
        "Decoration Team",
        "Sponsorship Team"
    ]

    const roles = userType === 'faculty' ? ["Faculty Coordinator"] : ["Team Lead", "Member"]

    // Simulating data fetched from Google social login for admins
    const [formData, setFormData] = useState({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@nirmaan.in',
        phone: '+91 ',
        dob: '',
        sex: '',
        designation: '',
        role: userType === 'faculty' ? 'Faculty Coordinator' : '',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const handleDropdownChange = (name: string, value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Student specific logic: lead/treasurer clears and disables role
            if (userType === 'student' && name === 'designation' && ["Event Lead", "Event Co-Lead", "Treasurer"].includes(value)) {
                newData.role = '';
            }

            return newData;
        });
    }

    const isRoleDisabled = userType === 'faculty' || (userType === 'student' && ["Event Lead", "Event Co-Lead", "Treasurer"].includes(formData.designation));

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle final admin registration logic
        console.log('Final Admin Profile Data:', formData)
    }

    return (
        <div className="signup-page admin-signup">
            <div className="signup-container">
                <div className="signup-card">
                    <header className="signup-header">
                        <h1>Admin Onboarding</h1>
                        <p>Complete your administrative profile to access the dashboard controls.</p>
                    </header>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        {/* Profile Picture Section */}
                        <div className="profile-upload-section">
                            <label>Profile Picture</label>
                            <div
                                className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${formData.avatar ? 'has-image' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('avatar-input')?.click()}
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
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="e.g. Admin"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="e.g. User"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Contact Section */}
                            <div className="form-group">
                                <label>Professional Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="admin@nirmaan.in"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Number</label>
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
                                <Calendar
                                    value={formData.dob}
                                    onChange={(val: string) => handleDropdownChange('dob', val)}
                                    label="Date of Birth"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <SearchableDropdown
                                    options={['Male', 'Female', 'Other']}
                                    value={formData.sex}
                                    onChange={(val) => handleDropdownChange('sex', val)}
                                    placeholder="Select Sex"
                                    label="Sex"
                                    required
                                    allowManual={false}
                                />
                            </div>

                            {/* Administrative Section */}
                            <div className="form-group">
                                <SearchableDropdown
                                    options={designations}
                                    value={formData.designation}
                                    onChange={(val) => handleDropdownChange('designation', val)}
                                    placeholder="Select Designation"
                                    label="Designation"
                                    required
                                    allowManual={false}
                                />
                            </div>
                            <div className="form-group">
                                <SearchableDropdown
                                    options={roles}
                                    value={formData.role}
                                    onChange={(val) => handleDropdownChange('role', val)}
                                    placeholder={isRoleDisabled ? "Not Applicable" : "Select Role"}
                                    label="Role"
                                    required={!isRoleDisabled}
                                    allowManual={false}
                                    readOnly={isRoleDisabled}
                                />
                            </div>
                        </div>

                        <div className="signup-footer">
                            <button type="submit" className="signup-btn admin-btn">Initialize Admin Profile</button>
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

export default AdminSignupForm
