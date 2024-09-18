const typeDefs =`
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        role: Int!
        phone: String!
        birthdate: String!
        services: [Service]
    }

    type Option {
        duration: Int!
        price: Float!
    }

    type Appointment {
        _id: ID!
        service: Service
        user: User
        date: String!
        time: String!
    }

    type Service {
        _id: ID!
        name: String!
        description: String!
        cleanup: Int!
        options: [Option]
        practitioner: [User]
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
        createAppointment(service: ID!, user: ID!, date: String!, time: String!): Appointment
    }
`;

module.exports = typeDefs;