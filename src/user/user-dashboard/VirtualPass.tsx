import React from 'react';
import QRCode from 'react-qr-code';
import { motion, AnimatePresence } from 'framer-motion';
import './VirtualPass.css';

interface VirtualPassProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        firstName: string;
        lastName: string;
        college: string;
        avatar: string;
        nCode: string;
        email: string;
    };
}

const VirtualPass: React.FC<VirtualPassProps> = ({ isOpen, onClose, user }) => {
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
                        className="virtual-pass-chassis"
                        initial={{ scale: 0.8, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, y: 50, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/id-card/id-card-chasis.webp)` }}
                    >
                        {/* Profile Picture */}
                        <div className="chassis-avatar-container">
                            <img src={user.avatar} alt={user.firstName} className="chassis-avatar" />
                        </div>

                        {/* Name & College */}
                        <div className="chassis-user-details">
                            <h2 className="chassis-name">{user.firstName} {user.lastName}</h2>
                            <p className="chassis-group">{user.email}</p>
                            <p className="chassis-college">{user.college}</p>
                            <p className="chassis-validity">ID Valid Till: 12/04/2026</p> {/* TODO: Add dynamic date */}
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
                        <button className="pass-close-btn" onClick={onClose}>
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
