import { gql } from '@apollo/client';

export const QUERY_USERS = gql`
    query users {
        users {
            _id
            firstName
            lastName
            email
            phone
            birthdate
            role
            notes    
        }
    }
`

export const QUERY_SERVICES = gql`
    query getServices {
        services {
            _id
            name
            description
            options {
                duration
                cleanup
                price    
            }
            practitioner {
                _id
                firstName
                lastName
            }
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
            appointments {
                _id
                date
                time
                duration
                price
                service {
                    _id
                    name
                    description
                }
            }
        }
    }
`;

export const QUERY_APPOINTMENTS = gql`
    query getAppointments {
        appointments{
            _id
            date
            time
            duration
            cleanup
            price
            isPaid
            user {
                _id
                firstName
                lastName
                email
            }
            service {
                _id
                name
                description
                options {
                    duration
                    cleanup
                    price
                }
            }
        }
    }
`;

export const GET_CONTACTS = gql`
  query GetContacts {
    getContacts {
      name
      email
      message
    }
  }
`;