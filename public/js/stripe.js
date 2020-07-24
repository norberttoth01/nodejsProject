/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51H849YGpdHjvhUWdL76NpH54Nao0eQqn62a7swiYpJvCIxfyn1URkD8r3gYj2uLoWHchdwTA4MM39VpN1LaOOdTg00KqrzoGBb'
);

export const bookTour = async (tourId) => {
  // 1) get checkout session from server
  try {
    const session = await axios(
      `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    //2) create checkout form + charge credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', 'Something went wrong...');
  }
};
