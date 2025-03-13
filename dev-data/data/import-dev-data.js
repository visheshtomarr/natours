const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

// Read the environment variable file.
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD);

// Returns a promise.
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'));

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data imported successfully!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

// Delete data from DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data deleted successfully!');
    } catch (error) {
        console.log(error);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete') {
    deleteData();
}