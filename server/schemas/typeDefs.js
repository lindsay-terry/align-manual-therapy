const typeDefs =`
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        role: Int!
        phone: String!
        birthdate: String!
        appointments: [Appointment]
    }

    type Option {
        duration: Int!
        price: Float!
    }

    input OptionInput {
        duration: Int!
        price: Float!
    }

    type Appointment {
        _id: ID!
        service: Service
        user: User
        date: String!
        time: String!
        duration: Int!
        price: Float!
    }

    type Service {
        _id: ID!
        name: String!
        description: String!
        cleanup: Int!
        options: [Option]
        practitioner: [User]
    }

    input UpdateServiceInput {
        name: String!
        description: String!
        options: [OptionInput]!
        cleanup: Int!
    }

    type Contact {
        name: String
        email: String
        message: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]
        user(email: String!): User
        services: [Service]
        me: User
        appointments: [Appointment]
        getContacts: [Contact]
    }
    
    type PaymentResult {
        success: Boolean!
        transactionId: String
        errorMessage: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        createUser( firstName: String!, lastName: String!, email: String!, password: String!, phone: String!, birthdate: String!): Auth
        processPayment(sourceId: String!, amount: Int!): PaymentResult!
        createAppointment(service: ID!, user: ID!, date: String!, time: String!, duration: Int!, price: Float!): Appointment
        updateService(id: ID!, input: UpdateServiceInput!): Service
        submitContact(name: String!, email: String!, message: String!): String
    }
`;

module.exports = typeDefs;