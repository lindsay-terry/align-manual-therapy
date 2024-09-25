const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const expiration = '2h';

module.exports = {
    AuthenticationError: new GraphQLError('Could not authenticate user.', {
        extension: {
            code: 'UNAUTHENTICATED',
        },
    }),
    authMiddleware({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization;

        // ["Bearer", "<tokenvalue>"]
        if (req.headers.authorization) {
            token = token.split(' ').pop().trim();
        }
        
        if (!token) {
            return req;
        }

        try {
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch (error) {
            console.error('Error during the authMiddleware process:', error);
        }

        return req;
        },
        signToken({ firstName, email, _id, role }) {
            const payload = { firstName, email, _id, role };

            return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
        },
};