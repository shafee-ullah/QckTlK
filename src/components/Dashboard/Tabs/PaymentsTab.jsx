import React from 'react';
import { CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';

export const PaymentsTab = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment history</h3>
        <p className="text-gray-600 dark:text-gray-400">
          You haven't made any payments yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment History</h2>
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {payments.map((payment) => (
              <li key={payment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.planName} Plan
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{new Date(payment.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${payment.amount}
                      </span>
                      {payment.status === 'succeeded' ? (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="-ml-0.5 mr-1.5 h-4 w-4 text-green-500" />
                          Paid
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          <XCircle className="-ml-0.5 mr-1.5 h-4 w-4 text-red-500" />
                          {payment.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-right">
                      Transaction: {payment.id}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;
