import { gql } from '@apollo/client';

export const QUERY_USER = gql`
    query users($email: String!) {
        users(email: $email) {
            _id
            email
            firstName
            lastName
            phone
            birthdate
        }     
    }  
`;

export const QUERY_SERVICES = gql`
    query getServices {
        services {
            name
            description
            duration
            cleanup
            price
            practitioner
        }
    }
`;

export const QUERY_ME = gql`
    query me {
        me {
            _id
            email
            firstName
            lastName
            phone
            birthdate
        }
    }
`;