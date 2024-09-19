import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';

const PROCESS_PAYMENT = gql`
  mutation ProcessPayment($sourceId: String!, $amount: Int!) {
    processPayment(sourceId: $sourceId, amount: $amount) {
      success
      transactionId
      errorMessage
    }
  }
`;

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
        console.log('Payment successful:', data.processPayment.transactionId);
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