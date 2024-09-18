// Import necessary dependencies from React and Ant Design
import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Layout } from 'antd';

// Destructure components from Ant Design
const { Title } = Typography;
const { Content } = Layout;

// Define the Reviews component
const Reviews = () => {
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
            const script = document.createElement('script');
            script.src = import.meta.env.VITE_SOCIABLEKIT_SCRIPT_URL;
            script.async = true;
            script.defer = true;

            // Get the container where the script will be embedded
            const widgetContainer = document.getElementById('widget-container');
            widgetContainer.setAttribute('data-embed-id', import.meta.env.VITE_SOCIABLEKIT_EMBED_ID);
            widgetContainer.className = import.meta.env.VITE_SOCIABLEKIT_CLASS_NAME;
            widgetContainer.appendChild(script);

            return () => {
                if (widgetContainer) {
                    widgetContainer.innerHTML = '';
                }
            };
        }
    }, [isModalOpen]);

    // Render the Reviews component
    return (
        <Layout style={{ padding: '20px' }}>
            <Content className="reviews-container" style={{ textAlign: 'center' }}>
                <Title level={2}>What Our Clients Are Saying</Title>
                
                {/* Button to open the modal */}
                <Button type="primary" onClick={handleOpenModal}>
                    Google Reviews
                </Button>

                {/* Modal component */}
                <Modal
                    title="Customer Reviews"
                    open={isModalOpen}
                    onCancel={handleCloseModal}
                    footer={null}
                    centered
                    width={700}
                >
                    {/* Container where the content will be loaded */}
                    <div 
                        id="widget-container" 
                        className={import.meta.env.VITE_SOCIABLEKIT_CLASS_NAME}
                        style={{
                            maxHeight: '500px',
                            overflowY: 'auto',
                        }}
                    ></div>

                    {/* Button for External Link */}
                    <a
                        href="https://search.google.com/local/writereview?placeid=ChIJ15vXhd5FyoARZ_NNeCWosD0"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button type="primary" style={{ marginTop: '20px' }}>
                            Leave a Review on Google
                        </Button>
                    </a>
                </Modal>
            </Content>
        </Layout>
    );
};

export default Reviews;