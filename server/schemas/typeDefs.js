const typeDefs =`
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        role: Int!
    }

    type Auth {
        token: ID
        user: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        createUser( firstName: String!, lastName: String!, email: String!, password: String!): Auth
    }
`;

module.exports = typeDefs;