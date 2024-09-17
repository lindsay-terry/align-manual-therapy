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

    type Service {
        _id: ID!
        name: String!
        description: String!
        duration: Int!
        cleanup: Int!
        price: Float!
        practitioner: [User]
    }

    type Auth {
        token: ID
        user: User
    }

    type Query {
        users: [User]
        user(email: String!): User
        services: [Service]
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        createUser( firstName: String!, lastName: String!, email: String!, password: String!, phone: String!, birthdate: String!): Auth
    }
`;

module.exports = typeDefs;