import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import SquarePaymentForm from './UI/SquarePaymentForm';

export default function Payment({ amount }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handlePaymentSuccess = (success) => {
        if (success) { 
            message.success('Payment was successful!');
        } else {
            message.error('Payment failed.');
        }
        handleCloseModal();
    };

    // Format the amount to display in dollars
    const formattedAmount = (amount / 100).toFixed(2); 

    return (
        <div>
        <Button type="primary" onClick={handleOpenModal}>Proceed to Payment</Button>
        <Modal 
            title="Complete Your Payment" 
            open={isModalOpen} 
            footer={null} 
            onCancel={() => handleCloseModal(false)} 
            destroyOnClose={true}
        >
            <p>Amount: ${formattedAmount}</p> {/* Display the formatted amount */}
            <SquarePaymentForm amount={amount} onPaymentSuccess={handlePaymentSuccess} />
        </Modal>
        </div>
    );
}
