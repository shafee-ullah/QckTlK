import React from 'react';
import { Link } from 'react-router';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'We collect information that you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include:',
        [
          'Personal information such as your name, email address, and phone number',
          'Profile information including username and profile picture',
          'User-generated content such as messages and shared media',
          'Communications between you and QckTlk'
        ]
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'We use the information we collect to:',
        [
          'Provide, maintain, and improve our services',
          'Develop new features and functionality',
          'Send you technical notices and support messages',
          'Communicate with you about products, services, and events',
          'Monitor and analyze trends, usage, and activities'
        ]
      ]
    },
    {
      title: 'Information Sharing',
      content: [
        'We do not share your personal information with third parties except as described in this policy. We may share information:',
        [
          'With your consent or at your direction',
          'With service providers who perform services on our behalf',
          'When we believe in good faith that disclosure is necessary',
          'In connection with a merger, sale, or asset transfer'
        ]
      ]
    },
    {
      title: 'Data Security',
      content: [
        'We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.'
      ]
    },
    {
      title: 'Your Choices',
      content: [
        'You may update, correct, or delete information about you at any time by logging into your account. You may also contact us to request access to or deletion of your personal information.'
      ]
    },
    {
      title: 'Changes to This Policy',
      content: [
        'We may modify this Privacy Policy from time to time. If we make material changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide additional notice.'
      ]
    },
    {
      title: 'Contact Us',
      content: [
        'If you have any questions about this Privacy Policy, please contact us at privacy@qcktlk.com.'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                At QckTlk, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
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
                  This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.
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

export default PrivacyPolicy;
