import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import NewestContractors from './Home Page Components/NewestContractors';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaFacebook, FaBuilding, FaProjectDiagram } from 'react-icons/fa';

const ContractorProfile = () => {
  const { id } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractorDetails = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/contractor/${id}`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (data.success) {
          setContractor(data.contractor);
        } else {
          console.error('Error fetching contractor:', data.message);
        }
      } catch (error) {
        console.error('Error fetching contractor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractorDetails();
  }, [backendUrl, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Contractor not found</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl">
                  {contractor.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{contractor.name}</h1>
                  <p className="text-gray-600">General Contractor</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-400" />
                  <span>{contractor.contactNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <span>{contractor.email || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{contractor.officeAddress}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaGlobe className="text-gray-400" />
                  <a href={contractor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {contractor.website || 'Not provided'}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaFacebook className="text-gray-400" />
                  <a href={contractor.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {contractor.facebook || 'Not provided'}
                  </a>
                </div>
              </div>
            </div>

            {/* Notable Projects */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Notable Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contractor.notableProjects.map((project, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <FaProjectDiagram className="text-purple-500 mt-1" />
                    <span>{project}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Residential Construction', 'Commercial Projects', 'Renovation'].map((service, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <FaBuilding className="text-purple-500" />
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <NewestContractors />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorProfile;