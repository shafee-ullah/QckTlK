import React from 'react';
import { Link } from 'react-router';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const BecomeMember = () => {
  const features = [
    'Exclusive access to premium content',
    'Ad-free browsing experience',
    'Early access to new features',
    'Priority customer support',
    'Member-only community access'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Become a Member
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Join our community and unlock exclusive benefits
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Join Us?
                </h2>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0 mr-3" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Get Started
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Create your account now to start your membership journey with us.
                </p>
                <div className="space-y-4">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Sign Up Now
                    <FaArrowRight className="ml-2 -mr-1 w-4 h-4" />
                  </Link>
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {[
                  {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major credit cards, PayPal, and bank transfers.'
                  },
                  {
                    question: 'Can I cancel my membership anytime?',
                    answer: 'Yes, you can cancel your membership at any time with no hidden fees.'
                  },
                  {
                    question: 'Is there a free trial available?',
                    answer: 'Yes, we offer a 14-day free trial for all new members.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">{faq.question}</h4>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeMember;
