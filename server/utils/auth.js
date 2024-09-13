const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const expiration = '2h';