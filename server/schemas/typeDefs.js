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
        notes: [String]
    }

    input UpdateUserInput {
        firstName: String!
        lastName: String!
        email: String!
        phone: String!
        birthdate: String!
    }

    type Option {
        duration: Int!
        cleanup: Int! 
        price: Float!
    }

    input OptionInput {
        duration: Int!
        cleanup: Int!
        price: Float!
    }

    type Appointment {
        _id: ID!
        service: Service
        user: User
        date: String!
        time: String!
        duration: Int!
        cleanup: Int!
        price: Float!
        isPaid: Boolean!
    }

    type Service {
        _id: ID!
        name: String!
        description: String!
        options: [Option]
        practitioner: [User]
    }

    input UpdateServiceInput {
        name: String!
        description: String!
        options: [OptionInput]!
    }

    type Contact {
        name: String
        email: String
        message: String
        createdAt: String
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
        createAppointment(service: ID!, user: ID!, date: String!, time: String!, duration: Int!, cleanup: Int!, price: Float!): Appointment
        updateService(id: ID!, input: UpdateServiceInput!): Service
        submitContact(name: String!, email: String!, message: String!): String
        addNoteToUser(userId: ID!, note: String!): User
        deleteNote(userId: ID!, note: String!): User
        updateUserRole(userId: ID!, role: Int!): User
        deleteUser(userId: ID!): User
        markAsPaid(appointmentId: ID!): Appointment
        updateUser(id: ID!, input: UpdateUserInput!): User
    }

`;

module.exports = typeDefs;