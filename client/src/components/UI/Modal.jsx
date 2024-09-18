// Modal.jsx
import React from 'react';

const Modal = ({ show, onClose, children }) => {
    // If 'show' is false, return null to prevent rendering the modal
    if (!show) return null;

    // Styles for the modal overlay and content
    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    };

    return (
        // Overlay for the modal; clicking on it will close the modal
        <div style={modalOverlayStyle} onClick={onClose}>
            {/* Main content area of the modal */}
            <div onClick={(e) => e.stopPropagation()}>
                {children} {/* Render any children passed to the Modal component */}
            </div>
        </div>
    );
};

export default Modal;