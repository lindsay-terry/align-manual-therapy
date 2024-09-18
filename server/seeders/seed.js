const db = require('../config/connection');
const { User, Service, Appointment } = require('../models');
const userSeeds = require('./userSeeds.json');
const serviceSeeds = require('./serviceSeeds.json');
const appointmentSeeds = require('./appointmentSeeds.json');
const cleanDB = require('./cleanDb');

db.once('open', async () => {
    try {
        await cleanDB('User', 'users');
        await cleanDB('Service', 'services');
        await cleanDB('Appointment', 'appointments')
        console.log('Database cleaned')

        await User.create(userSeeds);
        await Service.create(serviceSeeds);
        await Appointment.create(appointmentSeeds)

    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    console.log('Database seeded.  Great success!');
    process.exit(0);
})