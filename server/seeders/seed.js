const db = require('../config/connection');
const { User, Service } = require('../models');
const userSeeds = require('./userSeeds.json');
const serviceSeeds = require('./serviceSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
    try {
        await cleanDB('User', 'user');
        await cleanDB('Service', 'service');

        await User.create(userSeeds);
        await Service.create(serviceSeeds);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    console.log('Database seeded.  Great success!');
    process.exit(0);
})