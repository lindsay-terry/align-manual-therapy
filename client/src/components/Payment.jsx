import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import SquarePaymentForm from './UI/SquarePaymentForm';

export default function PaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (wasPaymentSuccessful = false) => {
    setIsModalOpen(false);

    // Show success message only if payment was successful
    if (wasPaymentSuccessful) {
      message.success('Payment was successful!');
    }
  };

  const handlePaymentSuccess = (success) => {
    if (success) {
      setPaymentSuccessful(true);
      handleCloseModal(true);  // Pass true to indicate payment success
    } else {
      handleCloseModal(false); // Pass false to indicate payment failure
    }
  };

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
        <SquarePaymentForm amount={1000} onPaymentSuccess={handlePaymentSuccess} />
      </Modal>
    </div>
  );
}
