import PropTypes from 'prop-types';
import { useState } from 'react';
// Use the standard No Image file as default
const defaultImage = '/project images/No Image.png';
import '../../../public/styles/ProjectCard.css';

const Card = ({ project, contractors, onClick }) => {
  const { thumbnail, projectName, author, projectDescription, createdAt, contractorId } = project;

  const getUserInitials = () => {
    const name = author ? author.trim() : "Unknown";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      return name.length >= 2 ? (name[0] + name[1]).toUpperCase() : name[0].toUpperCase();
    }
  };

  const getContractorName = () => {
    if (!contractorId || !contractors) return null;
    const contractor = contractors.find(c => c._id === contractorId);
    return contractor ? contractor.name : null;
  };

  // Format the date if available
  const formatDate = () => {
    if (!createdAt) return "No date";
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Truncate description if too long
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return "No description available";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="card-container horizontal-card" onClick={() => onClick(project)}>
      <div className="card-thumbnail-container">
        <img
          src={thumbnail || defaultImage}
          alt={projectName}
          className="card-thumbnail"
          onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
        />
      </div>
      <div className="card-content">
        <div className='card-details'>
          <h3 className="card-title">{projectName}</h3>
          <div className="card-date">{formatDate()}</div>
          {getContractorName() && (
            <div className="card-contractor text-sm text-gray-600">
              Contractor: {getContractorName()}
            </div>
          )}
          <p className="card-description">{truncateDescription(projectDescription)}</p>
          <div className="card-author">
            <div className="author-initials-circle">
              {getUserInitials()}
            </div>
            <span>{author || "Unknown"}</span>
          </div>
        </div>
        <div className='card-actions'>
          {/* You can add action buttons here if needed */}
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  project: PropTypes.shape({
    thumbnail: PropTypes.string,
    projectName: PropTypes.string.isRequired,
    author: PropTypes.string,
    projectDescription: PropTypes.string,
    createdAt: PropTypes.string,
    contractorId: PropTypes.string,
  }).isRequired,
  contractors: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  onClick: PropTypes.func
};

export default Card;