import React from 'react';
import { Link } from 'react-router';

const CookiePolicy = () => {
  const sections = [
    {
      title: 'What Are Cookies',
      content: [
        'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.'
      ]
    },
    {
      title: 'How We Use Cookies',
      content: [
        'We use cookies for several purposes:',
        [
          'To enable certain functions of the Service',
          'To provide analytics on how you use our Service',
          'To store your preferences',
          'To enable advertisements delivery, including behavioral advertising',
          'To improve and personalize your experience on our Service'
        ]
      ]
    },
    {
      title: 'Types of Cookies We Use',
      content: [
        'We use the following types of cookies on our Service:',
        [
          'Essential Cookies: These are necessary for the website to function and cannot be switched off.',
          'Performance Cookies: These allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
          'Functionality Cookies: These enable the website to provide enhanced functionality and personalization.',
          'Targeting Cookies: These cookies may be set through our site by our advertising partners.'
        ]
      ]
    },
    {
      title: 'Third-Party Cookies',
      content: [
        'We may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. These cookies may be used by these companies to build a profile of your interests and show you relevant advertisements on other sites.'
      ]
    },
    {
      title: 'Your Choices Regarding Cookies',
      content: [
        'You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by clicking on the appropriate opt-out links provided in the cookie banner or by updating your browser settings.',
        'Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of the Service.'
      ]
    },
    {
      title: 'Changes to This Cookie Policy',
      content: [
        'We may update this Cookie Policy from time to time to reflect changes to our use of cookies or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Cookie Policy on this page.'
      ]
    },
    {
      title: 'Contact Us',
      content: [
        'If you have any questions about our use of cookies or other technologies, please contact us at privacy@qcktlk.com.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This Cookie Policy explains how QckTlk ("we", "us", or "our") uses cookies and similar technologies when you use our website and services (collectively, the "Service").
              </p>

              {sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  
                  {section.content.map((content, i) => (
                    <React.Fragment key={i}>
                      {Array.isArray(content) ? (
                        <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-600 dark:text-gray-300">
                          {content.map((item, j) => (
                            <li key={j} className="text-gray-600 dark:text-gray-300">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {content}
                        </p>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ))}

              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This Cookie Policy was last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
                </p>
              </div>

              <div className="mt-8 flex justify-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
