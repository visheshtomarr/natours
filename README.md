# Natours

Natours is a full-stack web application for booking and managing tours. It is designed for adventurous people who want to explore exciting destinations. The project includes a Node.js backend, MongoDB database, and a responsive frontend built with HTML, CSS, and JavaScript.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [License](#license)
- [Acknowledgement](#Acknowledgement)

## Features

- User authentication and authorization (login, signup, logout).
- Tour booking and payment integration using Stripe.
- Dynamic tour pages with reviews and ratings.
- Admin panel for managing tours, users, and reviews.
- Responsive design for mobile and desktop devices.
- Data import/export for development purposes.

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- Stripe API (for payments)

### Frontend

- HTML5, CSS3 (SASS)
- JavaScript (ES6+)
- Mapbox API (for interactive maps)

### Tools

- Babel (for transpiling ES6+)
- Parcel (for bundling assets)
- ESLint and Prettier (for code quality)
- Postman (for API testing)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/visheshtomarr/natours.git
   cd natours
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a config.env file in the root directory and add the following environment variables:

   ```
   NODE_ENV=development
   PORT=8000
   DATABASE=<your-database-connection-string>
   DATABASE_PASSWORD=<your-database-password>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   EMAIL_FROM=<your-email>
   SENDGRID_USERNAME=<your-sendgrid-username>
   SENDGRID_PASSWORD=<your-sendgrid-password>
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   ```

4. Import development data (optional):
   ```bash
   node dev-data/data/import-dev-data.js --import
   ```

## Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:

   ```bash
   http://localhost:8000
   ```

3. Explore the application:

- View tours on the homepage.
- Login or sign up to book tours.
- Manage your account settings.

## Scripts

- **Start Development Server**: `npm run dev`

- **Start Production Server**: `npm run prod`

- **Import Data**: `node dev-data/data/import-dev-data.js --import`

- **Delete Data**: `node dev-data/data/import-dev-data.js --delete`

## API Endpoints

### Authentication

- `POST /api/v1/users/signup` - Create a new user.
- `POST /api/v1/users/login` - Login a user.
- `GET /api/v1/users/logout` - Logout a user.

### Tours

- `GET /api/v1/tours` - Get all tours.
- `GET /api/v1/tours/:id` - Get a single tour.
- `POST /api/v1/tours` - Create a new tour (Admin only).
- `PATCH /api/v1/tours/:id` - Update a tour (Admin only).
- `DELETE /api/v1/tours/:id` - Delete a tour (Admin only).

### Reviews

- `GET /api/v1/reviews` - Get all reviews.
- `POST /api/v1/reviews` - Create a review.
- `PATCH /api/v1/reviews/:id` - Update a review.
- `DELETE /api/v1/reviews/:id` - Delete a review.

### Bookings

- `GET /api/v1/bookings` - Get all bookings (Admin only).
- `GET /api/v1/bookings/:id` - Get a single booking.
- `POST /api/v1/bookings` - Create a new booking.
- `PATCH /api/v1/bookings/:id` - Update a booking (Admin only).
- `DELETE /api/v1/bookings/:id` - Delete a booking (Admin only).
- `GET /api/v1/bookings/my-tours` - Get all bookings for the logged-in user.

## License 📄

This project is open-sourced under the [MIT license](https://opensource.org/licenses/MIT).

## Acknowledgement 🙏🏻

- This project is part of the online course I've taken at Udemy. Thanks to @[jonasschmedtmann](https://github.com/jonasschmedtmann) for creating this awesome course!
