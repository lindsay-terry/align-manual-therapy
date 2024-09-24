import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useMutation } from '@apollo/client';
import { MARK_AS_PAID } from '../utils/mutations';
import SquarePaymentForm from './SquarePaymentForm';

export default function Payment({ amount, appointmentId, onPaymentSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mark appointment associated with payment as paid
    const [markPaid, { loading, error }] = useMutation(MARK_AS_PAID);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdateAppointment = async () => {
        try {
            const result = await markPaid({
                variables: { appointmentId },
            });
        } catch (error) {
            console.error('Error updating appointment', error);
        }
    };

    const handlePaymentSuccess = (success) => {
        if (success) { 
            message.success('Payment was successful!');
            handleUpdateAppointment();
            onPaymentSuccess();
            
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