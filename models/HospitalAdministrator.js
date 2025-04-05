const User = require('./User');
const mongoose = require('mongoose');

const HospitalAdministratorSchema = new mongoose.Schema({
    hospitalID: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true }
});

const HospitalAdministrator = User.discriminator('HospitalAdministrator', HospitalAdministratorSchema);
module.exports = HospitalAdministrator;