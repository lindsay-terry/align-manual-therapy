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