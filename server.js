const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Handle any uncaught exception that occurs in synchronous code.
process.on('uncaughtException', err => {
    console.log('Uncaught Exception! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
})

// Read the environment variable file.
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<db_password>', process.env.DATABASE_PASSWORD);

// Returns a promise.
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'));

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`Listening on port number: ${port}`);
});

// Handle unhandled promise rejection.
process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
