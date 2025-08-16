import React from 'react';
import { Link } from 'react-router';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            About QckTlk
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Connecting people through meaningful conversations
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Founded in 2023, QckTlk was born out of a simple idea: to create a platform where people can connect instantly and meaningfully. 
                We believe in the power of real-time communication to bring people together, regardless of distance.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our mission is to provide a seamless, secure, and enjoyable messaging experience for everyone. 
                Whether you're connecting with friends, family, or colleagues, QckTlk makes it easy to stay in touch.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Privacy First',
                  description: 'We prioritize your privacy and security in every feature we build.'
                },
                {
                  title: 'User Experience',
                  description: 'Simple, intuitive design that just works, every time.'
                },
                {
                  title: 'Innovation',
                  description: 'Constantly evolving to bring you the best communication tools.'
                },
                {
                  title: 'Community',
                  description: 'Building connections that matter, one conversation at a time.'
                }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
