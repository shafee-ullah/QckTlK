import React, { useEffect, useState } from "react";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import useAuth from "../../hooks/useAuth";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fake amount and request to backend for demo purpose
  const amount = 2000; // in cents ($20.00)

  useEffect(() => {
    // Fetch PaymentIntent client secret from your backend
    fetch("http://localhost:3000/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }), // Or use cart total, etc.
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);

    if (!card) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    const { paymentMethod, error: pmError } =
      await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: user?.displayName || "Anonymous",
          email: user?.email || "No Email",
        },
      });

    if (pmError) {
      setError(pmError.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      setSuccess("Payment successful!");
      // Optional: save payment info to DB here
    }

    setProcessing(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardElement
          className="p-4 border rounded"
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />

        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          className="btn-primary w-full"
        >
          {processing ? "Processing..." : "Pay $20.00"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
