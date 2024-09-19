import React from 'react';
import { useMutation } from '@apollo/client';
import { PROCESS_PAYMENT } from '../../utils/mutations';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';

export default function SquarePaymentForm({ amount, onPaymentSuccess }) {
  const [processPayment] = useMutation(PROCESS_PAYMENT);

  const handlePayment = async (token) => {
    try {
      const { data } = await processPayment({
        variables: {
          sourceId: token,
          amount,
        },
      });

      if (data.processPayment.success) {
        console.log('Payment successful!');
        console.log('Transaction Id:', data.processPayment.transactionId);
        console.log('Amount of:', new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100));

        // Close the modal on successful payment
        onPaymentSuccess(true);
      } else {
        console.error('Payment failed:', data.processPayment.errorMessage);
        onPaymentSuccess(false);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      onPaymentSuccess(false);
    }
  };

  return (
    <PaymentForm
      applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID}
      locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
      cardTokenizeResponseReceived={async (token) => {
        if (token) {
          await handlePayment(token.token);
        }
      }}
    >
      <CreditCard />
    </PaymentForm>
  );
};