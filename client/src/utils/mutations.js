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
    mutation createAppointment($service: ID!, $user: ID!, $date: String!, $time: String!, $duration: Int!, $cleanup: Int!, $price: Float!) {
        createAppointment(service: $service, user: $user, date: $date, time: $time, duration: $duration, cleanup: $cleanup, price: $price) {
            _id
            service {
                _id
                name
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
            cleanup
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

export const SUBMIT_CONTACT = gql`
  mutation SubmitContact($name: String!, $email: String!, $message: String!) {
    submitContact(name: $name, email: $email, message: $message)
  }
`;

export const UPDATE_SERVICE = gql`
    mutation updateService($id: ID!, $input: UpdateServiceInput!) {
        updateService(id: $id, input: $input) {
            _id
            name
            description
            options{
                price
                cleanup
                duration
            }
        }
    }
`;

export const ADD_NOTE_TO_USER = gql`
    mutation addNoteToUser($userId: ID!, $note: String!) {
        addNoteToUser(userId: $userId, note: $note) {
            _id
            notes    
        }
    }
`;

export const DELETE_NOTE = gql`
    mutation deleteNote($userId: ID!, $note: String!) {
        deleteNote(userId: $userId, note: $note) {
            _id
            notes
        }
    }
`;

export const UPDATE_USER_ROLE = gql`
    mutation updateUserRole($userId: ID!, $role: Int!) {
        updateUserRole(userId: $userId, role: $role) {
            _id
            role
        }
    }
`;

export const DELETE_USER = gql`
    mutation deleteUser($userId: ID!) {
        deleteUser(userId: $userId) {
            _id
        }
    }
`;

export const MARK_AS_PAID = gql`
    mutation markAsPaid($appointmentId: ID!) {
        markAsPaid(appointmentId: $appointmentId) {
            _id
            isPaid
        }
    }    
`;

export const UPDATE_USER = gql`
    mutation updateUser($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) {
            _id
            firstName
            lastName
            email
            phone
            birthdate
        }
    }
`;