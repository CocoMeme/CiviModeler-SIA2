import React from 'react';

const Help = () => {
  return (
    <div className="bg-primary text-white min-h-screen">
      {/* Image Section */}
      <div className="flex justify-center">
        <img className="rounded-lg shadow-lg" src="/project images/H4.png" alt="CiviModeler H1" />
      </div>

      {/* FAQ Section */}
      <div className="mt-6 bg-white text-black p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Frequently Asked Questions (FAQ)</h2>
        
        <div className="space-y-6">
          {/* FAQ Item */}
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-primary">Q: Where do you base your material prices from?</h3>
            <p className="text-gray-700 mt-2">We base the prices of materials from Philcon Prices.</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-primary">Q: What if the budget is too low?</h3>
            <p className="text-gray-700 mt-2">When your budget is too low, the material estimation will not proceed, instead there will be a prompt saying "Budget is not enough to cover the estimated total cost."</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-primary">Q: Can I save the 3D model?</h3>
            <p className="text-gray-700 mt-2">Yes, you can save the 3D model of the project you entered.</p>
          </div>

          {/* <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-primary">Q: Can I customize the material prices?</h3>
            <p className="text-gray-700 mt-2">Yes, you can manually adjust material prices in the settings to reflect current market values.</p>
          </div> */}

          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-primary">Q: Does the estimation include labor costs?</h3>
            <p className="text-gray-700 mt-2">By default, the estimation only includes material costs. However, you can know the cost of labor when you contacted your chosen contractor.</p>
          </div>

          {/* <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-primary">Q: Can I export my project report?</h3>
            <p className="text-gray-700 mt-2">Yes, you can export the material estimation and project details as a PDF or Excel file.</p>
          </div> */}

          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-primary">Q: Is there a limit to how many projects I can create?</h3>
            <p className="text-gray-700 mt-2">No, you can create and manage as many projects as you want.</p>
          </div>

          {/* <div className="pb-4">
            <h3 className="text-xl font-semibold text-primary">Q: Do you support different construction standards?</h3>
            <p className="text-gray-700 mt-2">Yes, you can select different standards such as U.S., European, or Philippine construction codes.</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Help;
