import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import { FaHardHat, FaBuilding, FaStar, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const NewestContractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/contractor/get-contractors?limit=3&sort=newest`, {
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
    // Use the seed to deterministically select a color
    const index = seed.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Newest Contractors</h2>
        <Link to="/user/contractors" className="text-blue-600 hover:text-blue-800 text-xs font-medium">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : contractors.length > 0 ? (
        <div className="space-y-3">
          {contractors.map((contractor) => (
            <div key={contractor._id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${getRandomColor(contractor.name)} w-10 h-10 rounded-full flex items-center justify-center text-white mr-3`}>
                  {contractor.logo ? (
                    <img 
                      src={contractor.logo} 
                      alt={contractor.name} 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <FaHardHat size={20} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{contractor.name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <FaBuilding className="mr-1" /> 
                    <span>{contractor.specialization || 'General Contractor'}</span>
                    <div className="flex items-center ml-3">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{contractor.rating ? contractor.rating.toFixed(1) : '4.5'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-1 gap-1">
                <div className="flex items-center text-xs text-gray-600">
                  <FaPhoneAlt className="mr-2 text-gray-400" size={12} />
                  <span>{contractor.phone || 'Contact via platform'}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <FaEnvelope className="mr-2 text-gray-400" size={12} />
                  <span className="truncate">{contractor.email || 'contact@example.com'}</span>
                </div>
              </div>
              
              <div className="mt-2">
                <Link 
                  to={`/user/contractor/${contractor._id}`}
                  className="w-full block text-center bg-blue-50 text-blue-600 hover:bg-blue-100 rounded py-1 text-xs font-medium"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md p-4 text-center">
          <FaHardHat className="mx-auto text-gray-400 text-2xl mb-2" />
          <p className="text-sm text-gray-600">No contractors available</p>
        </div>
      )}
    </div>
  );
};

export default NewestContractors;