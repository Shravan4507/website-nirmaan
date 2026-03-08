import React from 'react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import './VirtualPass.css';

interface VirtualPassProps {
    isOpen: boolean;
    onClose: () => void;
    isStatic?: boolean;
    user: {
        firstName: string;
        lastName: string;
        college: string;
        avatar: string;
        nCode: string;
        email: string;
    };
}

const VirtualPass: React.FC<VirtualPassProps> = ({ isOpen, onClose, isStatic = false, user }) => {
    // Static mode for PDF/PNG download
    if (isStatic) {
        return (
            <div 
                id="virtual-pass-static-capture"
                style={{ 
                    position: 'fixed',
                    left: '-2000px', // Less extreme
                    top: '0',
                    width: '450px',
                    height: '700px',
                    backgroundColor: '#000',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: -999,
                    fontFamily: 'Outfit, sans-serif'
                }}
            >
                {/* Background Image as <img> for better capture */}
                <img 
                    src={`${import.meta.env.BASE_URL}assets/id-card/id-card-chasis-1.webp`} 
                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                    crossOrigin="anonymous"
                    alt="chassis"
                />

                {/* Profile Picture */}
                <div style={{ position: 'absolute', top: '196px', left: '78px', width: '146px', height: '146px', borderRadius: '50%', overflow: 'hidden', zIndex: 10, backgroundColor: '#222' }}>
                    <img 
                        src={user.avatar} 
                        alt={user.firstName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        crossOrigin="anonymous" 
                    />
                </div>

                {/* Name & Details */}
                <div style={{ position: 'absolute', top: '378px', left: '56px', width: '247px', zIndex: 10, color: '#fff', textAlign: 'left' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 12px 0', lineHeight: 1.1 }}>{user.firstName} {user.lastName}</h2>
                    <p style={{ fontSize: '13px', margin: '0 0 6px 0', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>{user.email}</p>
                    <p style={{ fontSize: '13px', margin: '0 0 6px 0', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>{user.college}</p>
                    <p style={{ fontSize: '12px', marginTop: '35px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>ID Valid Till: 11/04/2026</p>
                </div>

                {/* QR Section */}
                <div style={{ position: 'absolute', bottom: '15px', left: '22px', zIndex: 10 }}>
                    <div style={{ width: '100px', height: '100px', backgroundColor: '#fff', padding: '5px', borderRadius: '8px' }}>
                        <QRCode 
                            value={user.nCode || "NIRMAAN-26"} 
                            size={90}
                            level="H"
                            fgColor="#000000"
                            bgColor="#ffffff"
                        />
                    </div>
                </div>

                {/* Visitor Text */}
                <div className="chassis-side-text"><span>VISITOR</span></div>
                <div className="chassis-id-string">{user.nCode}</div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="virtual-pass-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div 
                        id="virtual-pass-download-area"
                        className="virtual-pass-chassis"
                        initial={{ scale: 0.8, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, y: 50, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/id-card/id-card-chasis-1.webp)` }}
                    >
                        {/* Profile Picture */}
                        <div className="chassis-avatar-container">
                            <img src={user.avatar} alt={user.firstName} className="chassis-avatar" crossOrigin="anonymous" />
                        </div>

                        {/* Name & College */}
                        <div className="chassis-user-details">
                            <h2 className="chassis-name">{user.firstName} {user.lastName}</h2>
                            <p className="chassis-group">{user.email}</p>
                            <p className="chassis-college">{user.college}</p>
                            <p className="chassis-validity">ID Valid Till: 11/04/2026</p>
                        </div>

                        {/* QR Code Section */}
                        <div className="chassis-qr-section">
                            <div className="chassis-qr-wrapper">
                                <QRCode 
                                    value={user.nCode || "NIRMAAN-26"} 
                                    size={100}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 100 100`}
                                    level="M"
                                    fgColor="#000000"
                                    bgColor="transparent"
                                />
                            </div>
                        </div>

                        {/* Side Branding */}
                        <div className="chassis-side-text">
                            <span>VISITOR</span>
                        </div>

                        {/* ID Code */}
                        <div className="chassis-id-string">
                            {user.nCode}
                        </div>

                        {/* Close Action */}
                        <button className="pass-close-btn" onClick={onClose} data-html2canvas-ignore>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VirtualPass;
