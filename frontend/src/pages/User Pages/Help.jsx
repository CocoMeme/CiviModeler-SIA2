import React from 'react';

const Help = () => {
  return (
    <div className="bg-primary text-white min-h-screen p-6">
      {/* Image Section */}
      <div>
        <img className='rounded-lg' src="/project images/H4.png" alt="CiviModeler H1" />
      </div>

      {/* FAQ Section */}
      <div className="mt-6 bg-white text-black p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions (FAQ)</h2>
        
        <div className="border-b py-4">
          <h3 className="text-xl font-semibold text-primary">Q: Where do you base your material prices from?</h3>
          <p className="text-gray-700 mt-2">We base the prices of materials from Philcon Prices.</p>
        </div>

        <div className="border-b py-4">
          <h3 className="text-xl font-semibold text-primary">Q: What services are included in my membership?</h3>
          <p className="text-gray-700 mt-2">Your membership includes exclusive content, priority support, and access to premium features.</p>
        </div>

        <div className="py-4">
          <h3 className="text-xl font-semibold text-primary">Q: Can I cancel my subscription anytime?</h3>
          <p className="text-gray-700 mt-2">Yes, you can manage or cancel your subscription at any time through your account settings.</p>
        </div>
      </div>
    </div>
  );
};

export default Help;
