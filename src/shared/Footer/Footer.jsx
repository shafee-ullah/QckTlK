import React from 'react';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="hidden md:block bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                            About QckTlk
                        </h3>
                        <p className="text-base text-gray-600 dark:text-gray-300">
                            Connect with like-minded individuals and share your thoughts in real-time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                            Quick Links
                        </h3>
                        <div className="mt-4 space-y-2">
                            <Link to="/" className="block text-base text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                Home
                            </Link>
                            {/* <Link to="/membership" className="block text-base text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                Membership
                            </Link> */}
                            <Link to="/about" className="block text-base text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                About Us
                            </Link>
                            <Link to="/contact" className="block text-base text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                            Legal
                        </h3>
                        <div className="mt-4 space-y-2">
                            <Link to="/privacy" className="block text-base text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="block text-base text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                Terms of Service
                            </Link>
                            <Link to="/cookies" className="block text-base text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                            Contact Us
                        </h3>
                        <div className="mt-4 space-y-2">
                            <p className="text-base text-gray-600 dark:text-gray-300">
                                Email: support@qcktlk.com
                            </p>
                            <p className="text-base text-gray-600 dark:text-gray-300">
                                Phone: (123) 456-7890
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-base text-gray-500 dark:text-gray-400 text-center">
                        &copy; {new Date().getFullYear()} QckTlk. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;