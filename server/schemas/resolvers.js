const { User, Service, Appointment, Contact } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const { Client, Environment, ApiError } = require("square");
const { randomUUID } = require('crypto');  // Import randomUUID for single use for payments

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const resolvers = {
    Query: {
        // Find all users
        users: async () => {
            return User.find();
        },
        // Find one user by email
        user: async (parent, { email } ) => {
            return User.findOne({ email });
        },
        // View own account
        me: async (parent, args, context) => {
            if (context.user) {
                try {
                    const user = await User.findOne({ _id: context.user._id }).populate({ path: 'appointments', populate: { path: 'service', model: 'Service'}});
                    return user;
                } catch (error) {
                    console.error('Error fetching user data', error);
                    throw new Error('Failed to fetch user data'); 
                }
            }
        },
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
        // Query single appointment
        appointment: async (parent, { appointmentId }) => {
            try {
                const appointment = await Appointment.findOne({ _id: appointmentId }).populate({ path: 'service' });
                if (!appointment) {
                    throw new Error('Appointment not found', error);
                }

                return appointment;
            } catch (error) {
                console.error('Error fetching appointment', error);
            }
        },

      getContacts: async () => {
            try {
            const contacts = await Contact.find();
            return contacts.map(contact => ({
                ...contact._doc,
                createdAt: contact.createdAt.toISOString()
            }));
            } catch (error) {
            console.error("Error fetching contacts:", error);
            throw new Error("Failed to fetch contacts.");
            }
        }
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
        createUser: async(parent, {firstName, lastName, phone, email, birthdate, password}) => {
            const user = await User.create({
                firstName, lastName, phone, email, birthdate, password
            });
            const token = signToken(user);

            return { token, user };
        },
        processPayment: async(_, { sourceId, amount }) => {
            try {
                const { paymentsApi } = client;
                const paymentResponse = await paymentsApi.createPayment({
                    idempotencyKey: randomUUID(),  // Use randomUUID for idempotency
                    sourceId,
                    amountMoney: {
                        currency: 'USD',
                        amount, // Amount in cents (e.g., 100 = $1.00)
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
                    errorMessage: error.result.errors[0].detail|| 'Payment failed.',
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

        updateAppointment: async(parent, { appointmentId, service, user, date, time, price, duration, cleanup }) => {
            try {
                const appointment = await Appointment.findById(appointmentId);
                if (!appointment) {
                    throw new Error('Appointment not found.');
                }
                const updateFields = {};
                if (service) updateFields.service = service;
                if (user) updateFields.user = user;
                if (date) updateFields.date = date;
                if (time) updateFields.time = time;
                if (price) updateFields.price = price;
                if (duration) updateFields.duration = duration;
                if (cleanup) updateFields.cleanup = cleanup;

                const updatedAppointment = await Appointment.findByIdAndUpdate(
                    appointmentId,
                    { $set: updateFields },
                    { new: true }
                );

                return updatedAppointment;
            } catch (error) {
                console.error('Error updating appiontment', error);
                throw new Error('Failed to update appointment.');
            }
        },

        submitContact: async (_, { name, email, message }) => {
            const newContact = new Contact({
            name,
            email,
            message
            });
            await newContact.save();
            return "Contact message received!";
        },
        updateService: async (parent, { id, input }) => {
            try {
                const updatedService = await Service.findByIdAndUpdate(id, input, {
                    new: true,
                    runValidators: true,
                });
                if (!updatedService) {
                    throw new Error('Service not found');
                    
                    
                }
                return updatedService;
            } catch (error) {
                console.error('Error updating service:', error);
                throw new Error(error.message);
            }
        },
        addNoteToUser: async (parent, { userId, note }) => {
            try {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {$push: { notes: note }},
                    { new: true }
                );
                return updatedUser;
            } catch (error) {
                console.error('Error adding note:', error);
                throw new Error(error.message);
            }
        },
        deleteNote: async (parent, { userId, note }) => {
            try {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    {$pull: { notes: note }},
                    { new: true }
                );
                return updatedUser;
            } catch (error) {
                console.error('Error deleting note:', error);
                throw new Error(error.message);
            }
        },
        updateUserRole: async (parent, { userId, role }) => {
            try {
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { role },
                    { new: true }
                );
                return updatedUser;
            } catch (error) {
                console.error('Error updating user role', error);
                throw new Error(error.message);
            }
        },
        deleteUser: async (parent, { userId }) => {
            try {
                const deletedUser = await User.findOneAndDelete({ _id: userId });
                if (!deletedUser) {
                    throw new Error('User not found');
                }
                return deletedUser;
            } catch (error) {
                console.error('Error deleting user', error);
                throw new Error(error.message);
            }
        },
        markAsPaid: async (parent, { appointmentId }) => {
            try {
                const appointment = await Appointment.findByIdAndUpdate(
                    appointmentId,
                    { isPaid: true },
                    { new: true },
                );
                return appointment;
            } catch (error) {
                console.error('Error updating appointment', error);
                throw new Error('Error updating appointment as paid.');
            }
        },
        updateUser: async (parent, { id, input }) => {
            try {
                const updatedUser = await User.findByIdAndUpdate(
                    id,
                    { $set: input },  // Only the provided fields will be updated
                    { new: true, runValidators: true }
                );
        
                if (!updatedUser) {
                    throw new Error('User not found');
                }
        
                return updatedUser;
            } catch (error) {
                console.error('Error updating user:', error);
                throw new Error(error.message);
            }
        },
    },
};

module.exports = resolvers;