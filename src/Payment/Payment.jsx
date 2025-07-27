import React from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./components/PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_stripe_pk);
const Payment = () => {
    return (
        <div>
            <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
        </div>
    );
};

export default Payment;