import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const amount = 2000; // $20.00 in cents

  // Fetch clientSecret using useQuery
  const { data: clientSecret, isLoading } = useQuery({
    queryKey: ["clientSecret", amount],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const result = await res.json();
      return result.clientSecret;
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    setError("");
    setSuccess("");

    try {   
      // Create payment method
      const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: user?.displayName || 'Anonymous',
          email: user?.email || '',
        },
      });

      if (paymentMethodError) {
        throw paymentMethodError;
      }

      // Confirm the payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setSuccess("Payment successful! Upgrading your membership...");
        try {
          // Upgrade membership
          await fetch("http://localhost:3000/api/users/upgrade", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          });

          // Record payment
          await fetch("http://localhost:3000/api/payments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              amount,
              status: paymentIntent.status,
              paymentIntentId: paymentIntent.id,
              date: new Date().toISOString(),
            }),
          });

          setSuccess("Payment successful! You are now a Gold member. Redirecting...");
          setTimeout(() => navigate("/dashboard"), 3000);
        } catch (err) {
          setError("Payment succeeded, but failed to upgrade membership or record payment.");
        }
      }
    } catch (error) {
      setError(error.message || 'An error occurred during payment processing');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>

      {isLoading ? (
        <p>Loading payment info...</p>
      ) : (
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
          {success && (
            <div className="text-green-500 text-sm flex flex-col items-center gap-2">
              <span>{success}</span>
              <button
                className="btn-primary mt-2"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default PaymentForm;
