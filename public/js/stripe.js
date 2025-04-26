import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_51RHOpSIh9pWgSR9YMyHWapf1mjojx3Ys3fHoszySfcDMLmyP3H0K9g7e89t59weha8S3AnPrzTuOUClckdDjpb6p00JxFrqFNe');

export const bookTour = async tourId => {
    try {
        // Get checkout  session from the server
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        // console.log(session);

        // Create checkout form and charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (error) {
        showAlert('error', error);
    }
}