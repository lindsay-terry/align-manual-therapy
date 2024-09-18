// Import necessary dependencies
import React, { useEffect, useState } from 'react';
import Modal from '../components/UI/Modal';

// Define the Reviews component
const Reviews = () => {
    const styles = {
        modalOverlay: {
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
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '700px',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative',
        },
        closeButton: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
        },
        reviewsContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
        },
    };

    // State to control the visibility of the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to handle opening the modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Effect hook to manage loading of the third-party script
    useEffect(() => {
        if (isModalOpen) {
            // Create a new script element for loading the SociableKIT script
            const script = document.createElement('script');
            script.src = import.meta.env.VITE_SOCIABLEKIT_SCRIPT_URL; // Use environment variable
            script.async = true;
            script.defer = true;

            // Get the container where the script will be embedded
            const widgetContainer = document.getElementById('widget-container');
            widgetContainer.setAttribute('data-embed-id', import.meta.env.VITE_SOCIABLEKIT_EMBED_ID);
            widgetContainer.className = import.meta.env.VITE_SOCIABLEKIT_CLASS_NAME;
            widgetContainer.appendChild(script);

            // Cleanup function to remove the script and its effects when the modal is closed or component unmounts
            return () => {
                if (widgetContainer) {
                    widgetContainer.innerHTML = '';
                }
            };
        }
    }, [isModalOpen]);

    // Render the Reviews component

    return (
        <div style={styles.reviewsContainer}>
            <h1>What Our Clients Are Saying</h1>
            <button onClick={handleOpenModal}>Google Reviews</button>

            <Modal show={isModalOpen} onClose={handleCloseModal}>
                <div style={styles.modalContent}>
                    <button style={styles.closeButton} onClick={handleCloseModal}>
                        X
                    </button>
                    <h3>Customer Reviews</h3>
                    {/* Container where the third-party script content will be loaded */}
                    <div id="widget-container"></div>
                </div>
            </Modal>
        </div>
    );
};

// Export the Reviews component as the default export
export default Reviews;