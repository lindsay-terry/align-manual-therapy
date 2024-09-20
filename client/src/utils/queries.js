import { gql } from '@apollo/client';

export const QUERY_USER = gql`
    query user($email: String!) {
        user(email: $email) {
            _id
            email
            firstName
            lastName
            phone
            birthdate
            services {
                _id
                name
                description
                options {
                    duration
                    price
                }
            cleanup
            practitioner {
                _id
                firstName
                lastName
                }
            }
        }     
    }  
`;

export const QUERY_SERVICES = gql`
    query getServices {
        services {
            _id
            name
            description
            cleanup
            options {
                duration
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
            services {
                _id
                name
                description
                options {
                    duration
                    price
                }
                cleanup
                practitioner {
                    _id
                    firstName
                    lastName
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
            price
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
                cleanup
                options {
                    duration
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