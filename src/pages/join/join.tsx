import { useState } from 'react'
import StarBorder from '../../components/star-border/StarBorder'
import SearchableDropdown from '../../components/searchable-dropdown/SearchableDropdown'
import colleges from '../../data/colleges.json'
import { useToast } from '../../components/toast/Toast'
import './join.css'

const ROLES = [
    {
        id: 'stage',
        tag: 'Events',
        title: 'STAGE',
        desc: 'Manage the heart of the festival. Handle stage coordination, performances, and live event flow.',
        duration: '5s'
    },
    {
        id: 'documentation',
        tag: 'Media',
        title: 'DOCUMENTATION',
        desc: 'Capture the history of Nirmaan. Record events through photography, videography, and reporting.',
        duration: '6s'
    },
    {
        id: 'social-media',
        tag: 'Digital',
        title: 'SOCIAL MEDIA',
        desc: 'Build the buzz online. Manage our official channels and engage with the digital audience.',
        duration: '7s'
    },
    {
        id: 'design',
        tag: 'Creative',
        title: 'DESIGN',
        desc: 'Create the visual identity of the festival. Focus on digital and print graphics.',
        duration: '8s'
    },
    {
        id: 'creative',
        tag: 'Arts',
        title: 'CREATIVE',
        desc: 'Curate unique experiences and artistic elements that make Nirmaan stand out.',
        duration: '5.5s'
    },
    {
        id: 'hospitality',
        tag: 'Service',
        title: 'HOSPITALITY',
        desc: 'The face of our welcome. Manage guest reception, food arrangements, and attendee comfort.',
        duration: '6.5s'
    },
    {
        id: 'marketing-pr',
        tag: 'Growth',
        title: 'MARKETING & PUBLIC RELATIONS',
        desc: 'Spread the word far and wide. Handle brand strategy and official communications.',
        duration: '7.5s'
    },
    {
        id: 'technical',
        tag: 'Development',
        title: 'TECHNICAL',
        desc: 'Build the digital foundation. Manage systems, websites, and technical integrations.',
        duration: '8.5s'
    },
    {
        id: 'decoration',
        tag: 'Aesthetics',
        title: 'DECORATION',
        desc: 'Transform the venue. Design and execute the physical atmosphere of the festival.',
        duration: '9s'
    },
    {
        id: 'sponsorship',
        tag: 'Finance',
        title: 'SPONSORSHIP',
        desc: 'Power the festival. Pitch to brands/partners and managed corporate relationships.',
        duration: '9.5s'
    }
]

const BENEFITS = [
    {
        title: 'Real-world Experience',
        desc: 'Manage large-scale projects and challenges that textbooks can\'t teach you.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
    },
    {
        title: 'Elite Networking',
        desc: 'Work closely with industry leaders, faculty, and top-tier student talent.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    },
    {
        title: 'Official Certification',
        desc: 'Receive prestigious certificates and recognition from Zeal College.',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-2 5L9 9l11 4-5 2zm0 0l4 4"></path></svg>
    }
]

function Join() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { showToast } = useToast();

    // Simulated logged in user data (similar to dashboard)
    const isLoggedIn = true; // Set to true to simulate a logged-in state
    const loggedInUser = {
        firstName: "Alex",
        lastName: "Johnson",
        zprn: "",
        email: "alex.johnson@example.com",
        phone: "+91 98765 43210",
        zKey: "ZCN-26-XXXX",
        college: "Zeal College of Engineering and Research",
        major: "Computer Engineering",
        yearOfStudy: "3rd Year",
    };

    const [formData, setFormData] = useState({
        firstName: isLoggedIn ? loggedInUser.firstName : '',
        lastName: isLoggedIn ? loggedInUser.lastName : '',
        zKey: isLoggedIn ? loggedInUser.zKey : '',
        zprn: '',
        college: isLoggedIn ? loggedInUser.college : '',
        major: isLoggedIn ? loggedInUser.major : '',
        yearOfStudy: isLoggedIn ? loggedInUser.yearOfStudy : '',
        division: '',
        mobileNumber: isLoggedIn ? loggedInUser.phone : '+91 ',
        email: isLoggedIn ? loggedInUser.email : '',
        whatsappNumber: isLoggedIn ? loggedInUser.phone : '+91 ', // Default to mobile
        preferredTeam: '',
        volunteeredBefore: '',
        eventName: '',
        relevantSkills: '',
        tshirtSize: '',
        jacketSize: '',
        ownLaptop: '',
        photographedConsent: '',
        confirmRules: false
    });

    const isFieldReadOnly = (fieldName: string) => {
        if (!isLoggedIn) return false;
        const autoFilledFields = ['firstName', 'lastName', 'zKey', 'email', 'mobileNumber', 'college', 'major', 'yearOfStudy'];
        return autoFilledFields.includes(fieldName);
    };

    const handleApply = (roleTitle: string) => {
        setFormData(prev => ({ ...prev, preferredTeam: roleTitle }));
        setIsModalOpen(true);
    };

    const handlePhoneChange = (name: string, value: string) => {
        if (!value.startsWith('+91 ')) {
            setFormData(prev => ({ ...prev, [name]: '+91 ' }));
            return;
        }
        const digits = value.slice(4).replace(/\D/g, '').slice(0, 10);
        setFormData(prev => ({ ...prev, [name]: `+91 ${digits}` }));
    };

    const handleZPRNChange = (value: string) => {
        // Enforce alphanumeric and max 10 chars
        const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
        setFormData(prev => ({ ...prev, zprn: cleaned }));
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: ZPRN must be 9-10 chars
        if (formData.zprn.length < 9 || formData.zprn.length > 10) {
            showToast(
                'Invalid ZPRN',
                'ZPRN number must be between 9 and 10 characters (letters and numbers).',
                'error'
            );
            return;
        }

        console.log('Application submitted:', { ...formData });
        // Add success feedback or API call here
        handleClose();
        showToast(
            'Application Submitted!',
            `Your request for the ${formData.preferredTeam} has been received. Our team will review it and get back to you soon.`,
            'success'
        );
    };

    return (
        <div className="join-page">
            <header className="join-hero">
                <h1 className="join-title">Shape the Future of Innovation</h1>
                <p className="join-subtitle">
                    Nirmaan isn't just an event; it's a legacy built by the most driven minds on campus.
                    Join the team that turns vision into reality.
                </p>
                <a href="#roles" className="join-hero-btn">
                    View Open Roles
                </a>
            </header>

            <section className="join-benefits">
                {BENEFITS.map((benefit, index) => (
                    <div className="benefit-card" key={index}>
                        <div className="benefit-icon">{benefit.icon}</div>
                        <h3>{benefit.title}</h3>
                        <p>{benefit.desc}</p>
                    </div>
                ))}
            </section>

            <section className="roles-section" id="roles">
                <div className="roles-header">
                    <h2>Choose Your Domain</h2>
                    <p className="join-subtitle">Every role is vital. Every contribution matters.</p>
                </div>

                <div className="roles-grid">
                    {ROLES.map((role) => (
                        <StarBorder
                            key={role.id}
                            as="div"
                            color="magenta"
                            speed={role.duration}
                            thickness={2}
                            borderRadius={32}
                        >
                            <div className="role-card-inner">
                                <div className="role-meta">
                                    <span className="role-tag">{role.tag}</span>
                                    <h3 className="role-title">{role.title}</h3>
                                    <p className="role-desc">{role.desc}</p>
                                </div>
                                <button
                                    onClick={() => handleApply(role.title)}
                                    className="apply-link"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    Apply Now
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                </button>
                            </div>
                        </StarBorder>
                    ))}
                </div>
            </section>

            {isModalOpen && (
                <div className={`join-modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
                    <div className="join-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="join-modal-header">
                            <div>
                                <h2>Festival Volunteer Application</h2>
                                <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Be a part of Nirmaan '26</p>
                            </div>
                            <button className="join-modal-close" onClick={handleClose}>&times;</button>
                        </div>

                        <form className="join-modal-form" onSubmit={handleSubmit}>
                            <div className="join-form-grid">
                                <div className="join-form-group">
                                    <label className={isFieldReadOnly('firstName') ? 'read-only-label' : ''}>First Name*</label>
                                    <input
                                        type="text"
                                        required
                                        readOnly={isFieldReadOnly('firstName')}
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="join-form-group">
                                    <label className={isFieldReadOnly('lastName') ? 'read-only-label' : ''}>Last Name*</label>
                                    <input
                                        type="text"
                                        required
                                        readOnly={isFieldReadOnly('lastName')}
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="join-form-group">
                                    <label>ZPRN Number*</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter 9-10 digit ZPRN"
                                        value={formData.zprn}
                                        onChange={e => handleZPRNChange(e.target.value)}
                                    />
                                </div>
                                <div className="join-form-group">
                                    <label className={isFieldReadOnly('zKey') ? 'read-only-label' : ''}>Z-Key (Read Only)</label>
                                    <input
                                        type="text"
                                        readOnly={isFieldReadOnly('zKey')}
                                        placeholder="Z-Key"
                                        value={formData.zKey}
                                        style={isFieldReadOnly('zKey') ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <SearchableDropdown
                                        label="College*"
                                        options={[...colleges]}
                                        value={formData.college}
                                        onChange={(val) => setFormData({ ...formData, college: val })}
                                        readOnly={isFieldReadOnly('college')}
                                        required
                                        allowManual={false}
                                    />
                                </div>
                                <SearchableDropdown
                                    label="Major / Branch*"
                                    options={[
                                        "Computer Engineering",
                                        "IT Engineering",
                                        "Al & DS",
                                        "Mechanical Engineering",
                                        "Civil Engineering",
                                        "Electrical Engineering",
                                        "E&TC Engineering"
                                    ]}
                                    value={formData.major}
                                    onChange={(val) => setFormData({ ...formData, major: val })}
                                    readOnly={isFieldReadOnly('major')}
                                    required
                                    allowManual={false}
                                />
                                <SearchableDropdown
                                    label="Year of Study*"
                                    options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
                                    value={formData.yearOfStudy}
                                    onChange={(val) => setFormData({ ...formData, yearOfStudy: val })}
                                    readOnly={isFieldReadOnly('yearOfStudy')}
                                    required
                                    allowManual={false}
                                />
                                <SearchableDropdown
                                    label="Division (Optional)"
                                    options={["A", "B", "C", "D", "E", "F", "G"]}
                                    value={formData.division}
                                    onChange={(val) => setFormData({ ...formData, division: val })}
                                    placeholder="Select Division"
                                    allowManual={false}
                                />
                                <div className="join-form-group">
                                    <label className={isFieldReadOnly('mobileNumber') ? 'read-only-label' : ''}>Mobile Number*</label>
                                    <input
                                        type="tel"
                                        required
                                        readOnly={isFieldReadOnly('mobileNumber')}
                                        placeholder="+91 00000 00000"
                                        value={formData.mobileNumber}
                                        onChange={e => handlePhoneChange('mobileNumber', e.target.value)}
                                    />
                                </div>
                                <div className="join-form-group">
                                    <label>WhatsApp Number*</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+91 00000 00000"
                                        value={formData.whatsappNumber}
                                        onChange={e => handlePhoneChange('whatsappNumber', e.target.value)}
                                    />
                                </div>
                                <div className="join-form-group">
                                    <label className={isFieldReadOnly('email') ? 'read-only-label' : ''}>Email Address*</label>
                                    <input
                                        type="email"
                                        required
                                        readOnly={isFieldReadOnly('email')}
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <SearchableDropdown
                                    label="Preferred Team / Domain*"
                                    options={ROLES.map(role => role.title)}
                                    value={formData.preferredTeam}
                                    onChange={(val) => setFormData({ ...formData, preferredTeam: val })}
                                    required
                                    allowManual={false}
                                />
                                <SearchableDropdown
                                    label="T-shirt Size*"
                                    options={["XS", "S", "M", "L", "XL", "XXL", "XXXL"]}
                                    value={formData.tshirtSize}
                                    onChange={(val) => setFormData({ ...formData, tshirtSize: val })}
                                    required
                                    allowManual={false}
                                />
                                <SearchableDropdown
                                    label="Jacket Size*"
                                    options={["XS", "S", "M", "L", "XL", "XXL", "XXXL"]}
                                    value={formData.jacketSize}
                                    onChange={(val) => setFormData({ ...formData, jacketSize: val })}
                                    required
                                    allowManual={false}
                                />
                            </div>

                            <div className="join-form-group">
                                <label>Have you volunteered in any fest/event before?*</label>
                                <div className="join-radio-group">
                                    <label className="join-radio">
                                        <input type="radio" name="volunteered" value="Yes" onChange={e => setFormData({ ...formData, volunteeredBefore: e.target.value })} required /> Yes
                                    </label>
                                    <label className="join-radio">
                                        <input type="radio" name="volunteered" value="No" onChange={e => setFormData({ ...formData, volunteeredBefore: e.target.value })} /> No
                                    </label>
                                </div>
                            </div>

                            {formData.volunteeredBefore === 'Yes' && (
                                <div className="join-form-group">
                                    <label>If Yes, mention the event name (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Event names"
                                        value={formData.eventName}
                                        onChange={e => setFormData({ ...formData, eventName: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="join-form-group">
                                <label>Any relevant skills? (Optional)</label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g. Photoshop, React, Event Management"
                                    value={formData.relevantSkills}
                                    onChange={e => setFormData({ ...formData, relevantSkills: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="join-form-group">
                                <label>Do you have your own laptop?</label>
                                <div className="join-radio-group">
                                    <label className="join-radio">
                                        <input type="radio" name="laptop" value="Yes" onChange={e => setFormData({ ...formData, ownLaptop: e.target.value })} required /> Yes
                                    </label>
                                    <label className="join-radio">
                                        <input type="radio" name="laptop" value="No" onChange={e => setFormData({ ...formData, ownLaptop: e.target.value })} /> No
                                    </label>
                                </div>
                            </div>

                            <div className="join-form-group">
                                <label>Are you okay with being photographed or recorded during the fest for social media?*</label>
                                <div className="join-radio-group">
                                    <label className="join-radio">
                                        <input type="radio" name="photo" value="Yes" onChange={e => setFormData({ ...formData, photographedConsent: e.target.value })} required /> Yes
                                    </label>
                                    <label className="join-radio">
                                        <input type="radio" name="photo" value="No" onChange={e => setFormData({ ...formData, photographedConsent: e.target.value })} /> No
                                    </label>
                                </div>
                            </div>

                            <div className="join-form-group join-form-group--checkbox">
                                <label className="join-checkbox">
                                    <input
                                        type="checkbox"
                                        required
                                        checked={formData.confirmRules}
                                        onChange={e => setFormData({ ...formData, confirmRules: e.target.checked })}
                                    />
                                    <span>I confirm that I will follow the rules, code of conduct, and assigned responsibilities during the fest.*</span>
                                </label>
                            </div>

                            <div className="join-modal-footer">
                                <button type="button" className="join-cancel-btn" onClick={handleClose}>Cancel</button>
                                <button type="submit" className="join-submit-btn">Submit Application</button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }
        </div >
    )
}

export default Join
