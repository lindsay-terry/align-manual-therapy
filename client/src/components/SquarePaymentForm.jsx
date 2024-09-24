import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { PROCESS_PAYMENT } from '../utils/mutations';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';

export default function SquarePaymentForm({ amount, onPaymentSuccess }) {
  const [processPayment] = useMutation(PROCESS_PAYMENT);
  const [retryCount, setRetryCount] = useState(0); // Track retry count

  const maxRetries = 3; // Number of retry attempts

  // Helper function to delay retries
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Retry logic for payment process
  const handlePaymentWithRetry = async (token, retries = 0) => {
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

      // Retry if the error is transient and retry count hasn't exceeded max retries
      if (retries < maxRetries) {
        console.log(`Retrying payment... (${retries + 1}/${maxRetries})`);
        await delay(1000); // Delay for 1 second before retrying
        setRetryCount(retries + 1);
        await handlePaymentWithRetry(token, retries + 1);
      } else {
        console.error('Max retries reached. Payment failed.');
        onPaymentSuccess(false);
      }
    }
  };

  return (
    <PaymentForm
      applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID}
      locationId={import.meta.env.VITE_SQUARE_LOCATION_ID}
      cardTokenizeResponseReceived={async (token) => {
        if (token) {
          await handlePaymentWithRetry(token.token); // Use retry function
        }
      }}
    >
      <CreditCard />
    </PaymentForm>
  );
};
