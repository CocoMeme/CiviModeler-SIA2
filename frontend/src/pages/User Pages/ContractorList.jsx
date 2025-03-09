import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaHardHat, FaBuilding, FaPhoneAlt, FaEnvelope, FaSearch } from 'react-icons/fa';

const ContractorList = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/contractor/get-contractors?limit=5`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (data.success) {
          setContractors(data.contractors);
        } else {
          console.error('Error fetching contractors:', data.message);
        }
      } catch (error) {
        console.error('Error fetching contractors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, [backendUrl]);

  // Function to generate a random bright color for contractor avatars
  const getRandomColor = (seed) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-yellow-500', 'bg-teal-500'
    ];
    const index = seed.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const filteredContractors = contractors.filter(contractor =>
    contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contractor.specialization && contractor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contractors by name or specialization..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredContractors.length > 0 ? (
          <div className="space-y-4">
            {filteredContractors.map((contractor) => (
              <div key={contractor._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-6">
                  <div className={`${getRandomColor(contractor.name)} w-24 h-24 rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                    {contractor.logo ? (
                      <img 
                        src={contractor.logo} 
                        alt={contractor.name} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <FaHardHat size={40} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">{contractor.name}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                          <FaBuilding className="mr-2" />
                          <span>{contractor.specialization || 'General Contractor'}</span>
                        </div>
                      </div>
                      <Link 
                        to={`/user/contractor/${contractor._id}`}
                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 text-sm font-medium transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaPhoneAlt className="mr-3 text-gray-400" />
                        <span>{contractor.contactNumber || 'Contact via platform'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaEnvelope className="mr-3 text-gray-400" />
                        <span className="truncate">{contractor.email || 'contact@example.com'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaHardHat className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600">No contractors found matching your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorList;