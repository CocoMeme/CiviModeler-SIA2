import PropTypes from 'prop-types';
import { useState } from 'react';
const defaultImage = '/project images/T3.png';
const defaultImage2 = '/project images/T2.png';
const defaultImage3 = '/project images/T3.png';
import '../../../public/styles/ProjectCard.css';
import '../../../public/styles/ProjectDetailsModal.css';
import { TbEyeEdit, TbListDetails, TbCube3dSphere } from "react-icons/tb";
import ProjectDetailsModal from './ProjectDetailsModal'; // Import the ProjectDetailsModal component

const Card = ({ project }) => {
  const { thumbnail, projectName, author } = project;
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [modalView, setModalView] = useState('details'); // State to manage modal view

  const getUserInitials = () => {
    const name = author ? author.trim() : "Unknown";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      return name.length >= 2 ? (name[0] + name[1]).toUpperCase() : name[0].toUpperCase();
    }
  };

  const handleProjectClick = (view) => {
    setModalView(view);
    setIsModalOpen(true); // Show the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Hide the modal
  };

  return (
    <div className="card-container">
      <img
        src={thumbnail || defaultImage}
        alt={projectName}
        className="card-thumbnail"
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
          {/* <button className="view-details-btn" onClick={() => handleProjectClick('details')}>
            <TbEyeEdit />
          </button> */}
          <button className="view-materials-btn" onClick={() => handleProjectClick('materials')}>
            <TbListDetails />
          </button>
          <button className="view-3d-btn" onClick={() => handleProjectClick('3d')}>
            <TbCube3dSphere />
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <ProjectDetailsModal project={project} onClose={handleCloseModal} view={modalView} />
        </div>
      )}
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