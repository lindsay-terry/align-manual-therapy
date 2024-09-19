import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
            }
        }
    }
`;

export const CREATE_USER = gql `
    mutation createUser($firstName: String!, $lastName: String!, $email: String!, $password: String!, $phone: String!, $birthdate: String!) {
        createUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, phone: $phone, birthdate: $birthdate) {
            token
            user {
                _id
            }
        }
    }    
`;

export const CREATE_APPOINTMENT = gql`
    mutation createAppointment($service: ID!, $user: ID!, $date: String!, $time: String!, $duration: Int!, $price: Float!) {
        createAppointment(service: $service, user: $user, date: $date, time: $time, duration: $duration, price: $price) {
            _id
            service {
                _id
                name
                cleanup
            }
            user {
                _id
                firstName
                lastName
                email
                phone
            }
            date
            time
            duration
            price
        }
    }
`;

export const PROCESS_PAYMENT = gql`
  mutation ProcessPayment($sourceId: String!, $amount: Int!) {
    processPayment(sourceId: $sourceId, amount: $amount) {
      success
      transactionId
      errorMessage
    }
  }
`;