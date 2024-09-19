import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import SquarePaymentForm from './UI/SquarePaymentForm';

export default function PaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (paymentSuccessful = false) => {
    setIsModalOpen(false);
    if (paymentSuccessful) {
        message.success('Payment was successful!');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleOpenModal}>Proceed to Payment</Button>
      <Modal 
        title="Complete Your Payment" 
        open={isModalOpen} 
        footer={null} 
        onCancel={handleCloseModal} 
        destroyOnClose={true}
      >
        <SquarePaymentForm amount={1000} onPaymentSuccess={(success) => handleCloseModal(success)} />
      </Modal>
    </div>
  );
};