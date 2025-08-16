import React from 'react';
import { Link } from 'react-router';

const TermsOfService = () => {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: [
        'By accessing or using the QckTlk service ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.'
      ]
    },
    {
      title: '2. Description of Service',
      content: [
        'QckTlk provides a platform for users to communicate in real-time through text, images, and other content. The Service may be modified, updated, or discontinued at our discretion.'
      ]
    },
    {
      title: '3. User Accounts',
      content: [
        'To use certain features of the Service, you must create an account. You are responsible for:',
        [
          'Maintaining the confidentiality of your account credentials',
          'All activities that occur under your account',
          'Ensuring that your use of the Service complies with all applicable laws',
          'Providing accurate and complete information when creating an account'
        ]
      ]
    },
    {
      title: '4. User Conduct',
      content: [
        'You agree not to use the Service to:',
        [
          'Violate any laws or regulations',
          'Infringe on the rights of others',
          'Post or share harmful, abusive, or inappropriate content',
          'Impersonate any person or entity',
          'Interfere with the operation of the Service'
        ]
      ]
    },
    {
      title: '5. Intellectual Property',
      content: [
        'The Service and its original content, features, and functionality are owned by QckTlk and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our Service without our express written permission.'
      ]
    },
    {
      title: '6. Termination',
      content: [
        'We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.'
      ]
    },
    {
      title: '7. Limitation of Liability',
      content: [
        'In no event shall QckTlk, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.'
      ]
    },
    {
      title: '8. Changes to Terms',
      content: [
        'We reserve the right to modify these Terms at any time. We will provide notice of any changes by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.'
      ]
    },
    {
      title: '9. Contact Us',
      content: [
        'If you have any questions about these Terms, please contact us at legal@qcktlk.com.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please read these Terms of Service ("Terms") carefully before using the QckTlk website (the "Service") operated by QckTlk ("us", "we", or "our").
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
                  These Terms of Service are effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
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

export default TermsOfService;
