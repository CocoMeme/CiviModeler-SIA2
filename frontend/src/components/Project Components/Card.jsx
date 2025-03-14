import PropTypes from 'prop-types';
import { useState } from 'react';
// Use the standard No Image file as default
const defaultImage = '/project images/No Image.png';
import '../../../public/styles/ProjectCard.css';

const Card = ({ project }) => {
  const { thumbnail, projectName, author } = project;

  const getUserInitials = () => {
    const name = author ? author.trim() : "Unknown";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      return name.length >= 2 ? (name[0] + name[1]).toUpperCase() : name[0].toUpperCase();
    }
  };

  return (
    <div className="card-container">
      <img
        src={thumbnail || defaultImage}
        alt={projectName}
        className="card-thumbnail"
        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
      />
      <div className="card-content">
        <div className='card-leftside'>
          <h3 className="card-title">{projectName}</h3>
          <div className="card-author">
            <div className="author-initials-circle">
              {getUserInitials()}
            </div>
            <span>{author || "Unknown"}</span>
          </div>
        </div>
        <div className='card-rightside'>
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
  }).isRequired,
};

export default Card;