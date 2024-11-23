import React from 'react';

interface GCashPaymentProps {
  accountNumber: string;
  accountName: string;
  amount: string;
  reference: string;
}

export function GCashPayment({ accountNumber, accountName, amount, reference }: GCashPaymentProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">GCash Payment Details</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Account Number:</p>
          <p className="font-medium">{accountNumber}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Account Name:</p>
          <p className="font-medium">{accountName}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Amount to Send:</p>
          <p className="font-medium">₱{amount}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Reference Number:</p>
          <p className="font-medium">{reference}</p>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded">
        <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Open your GCash app</li>
          <li>Tap "Send Money"</li>
          <li>Enter the account number above</li>
          <li>Verify the account name matches exactly</li>
          <li>Enter the exact amount shown above</li>
          <li>Use the reference number as your message</li>
          <li>Complete the payment</li>
        </ol>
      </div>
      
      <p className="mt-6 text-sm text-gray-500">
        Please keep your payment receipt for reference. Your order will be processed once payment is confirmed.
      </p>
    </div>
  );
}
