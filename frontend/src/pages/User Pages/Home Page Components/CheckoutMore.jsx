import React from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaRegBuilding, FaUsers, FaUserCog, FaQuestionCircle, FaCommentDots } from 'react-icons/fa';

const CheckoutMore = () => {
  const resources = [
    {
      title: 'Documentation',
      icon: <FaBook className="text-xl mr-2" />,
      description: 'Learn how to use our design tools',
      path: '/user/docs',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800',
    },
    {
      title: 'Templates',
      icon: <FaRegBuilding className="text-xl mr-2" />,
      description: 'Browse pre-designed templates',
      path: '/user/templates',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-800',
    },
    {
      title: 'Community',
      icon: <FaUsers className="text-xl mr-2" />,
      description: 'Connect with other designers',
      path: '/user/community',
      bgColor: 'bg-violet-100',
      textColor: 'text-violet-800',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-3">Resources</h2>
      
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <Link 
            key={index}
            to={resource.path}
            className={`block ${resource.bgColor} ${resource.textColor} rounded-lg p-3 transition-all hover:shadow-md`}
          >
            <div className="flex items-center">
              {resource.icon}
              <div>
                <h3 className="font-medium text-sm">{resource.title}</h3>
                <p className="text-xs opacity-80">{resource.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <h3 className="text-sm font-medium mb-2">Quick Links</h3>
        <ul className="space-y-1">
          <li>
            <Link to="/user/settings" className="text-xs text-blue-600 hover:underline flex items-center py-1">
              <FaUserCog className="mr-1" /> Account Settings
            </Link>
          </li>
          <li>
            <Link to="/user/help" className="text-xs text-blue-600 hover:underline flex items-center py-1">
              <FaQuestionCircle className="mr-1" /> Help & Support
            </Link>
          </li>
          <li>
            <Link to="/user/feedback" className="text-xs text-blue-600 hover:underline flex items-center py-1">
              <FaCommentDots className="mr-1" /> Send Feedback
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CheckoutMore;