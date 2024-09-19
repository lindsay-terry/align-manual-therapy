const { User, Service, Appointment } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const { Client, Environment, ApiError } = require("square");

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const resolvers = {
    Query: {
        // Find all users
        users: async () => {
            return User.find().populate('service');
        },
        // Find one user by email
        user: async (parent, { email } ) => {
            return User.findOne({ email }).populate('service');
        },
        // View own account
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('service');
            }
            throw AuthenticationError;
        },
        // Query a service -- not sure if we'll use
        // If we do, add to typeDefs and client side queries
        // service: async (parent, { name }) => {
        //     const params = name ? { name } : {};
        //     return Service.find(params);
        // },
        // Query all services
        services: async () => {
            try {
                return await Service.find().populate('practitioner');
            } catch (error) {
                console.error('Error fetching services', error);
                throw new Error('Failed to fetch services.');
            }
        },
        appointments: async () => {
          try {
              const appointments = await Appointment.find()
              .populate('user')
              .populate('service');

              return appointments.map(appointment => ({
                ...appointment.toObject(),
                date: appointment.date.toISOString(),
              }));
          } catch (error) {
              throw new Error('Failed to fetch appointment data.');
          }
      },
    }, 

    Mutation: {
        login: async (parent, { email, password }) => {
            try {
                const user = await User.findOne({ email });
  
                if (!user) {
                    throw new Error('Incorrect email or password.')
                }

                const correctPassword = await user.isCorrectPassword(password);

                if (!correctPassword) {
                    throw new Error('Incorrect email or password.');
                }

                const token = signToken(user);
    
                return { token, user };
            } catch (error) {
                console.error('Login error', error.message);
            }
        },
        createUser: async(parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        async processPayment(_, { sourceId, amount }) {
            try {
              const { paymentsApi } = client;
              const paymentResponse = await paymentsApi.createPayment({
                sourceId,
                idempotencyKey: new Date().getTime().toString(), // Prevent duplicate payments
                amountMoney: {
                  amount, // Amount in cents
                  currency: 'USD',
                },
              });
      
              return {
                success: true,
                transactionId: paymentResponse.result.payment.id,
                errorMessage: null,
              };
            } catch (error) {
              if (error instanceof ApiError) {
                return {
                  success: false,
                  transactionId: null,
                  errorMessage: error.result.errors[0].detail,
                };
              } else {
                return {
                  success: false,
                  transactionId: null,
                  errorMessage: "Unexpected error occurred",
                };
              }
            }
        
        },
        createAppointment: async(parent, args) => {
          try {
              const dateObject = new Date(args.date);
              const appointment = await Appointment.create({
                ...args,
                date: dateObject,
              });

              const newAppointment = await Appointment.findById(appointment._id)
                .populate('user')
                .populate('service');
                // Add appointment to user's appointment array
              const updateUser = await User.findByIdAndUpdate(args.user, {
                $addToSet: { appointments: newAppointment._id }}, { new: true });
                // console.log('UPDATED USER', updateUser);
              return newAppointment;
          } catch (error) {
              console.error('Error creating appointment', error);
          }
      },
    },
};

module.exports = resolvers;