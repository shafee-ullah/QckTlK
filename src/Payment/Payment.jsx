import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import { Crown, Shield, Zap, CheckCircle } from "lucide-react";

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_payment_key);
const Payment = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade to Gold Membership
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Unlock unlimited posts and premium features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefits Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Crown className="w-6 h-6 text-yellow-500 mr-2" />
              Gold Member Benefits
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Unlimited Posts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No more 5-post limit
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Gold Badge
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Exclusive member badge
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Priority Support
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Faster response times
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Crown className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Premium Features
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Access to upcoming features
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-600 dark:to-yellow-300 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-">
                  $20.00
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-900">
                  One-time payment
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-900 mt-1">
                  Secure payment via Stripe
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-900 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Complete Payment
            </h2>
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
