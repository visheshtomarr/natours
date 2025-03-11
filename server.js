const dotenv = require('dotenv');

// Read the environment variable file.
dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on port number: ${port}`);
})