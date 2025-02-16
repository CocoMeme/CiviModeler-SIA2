import PropTypes from 'prop-types';
const defaultImage = '/project images/T2.png';
import '../../../../public/styles/ProjectCard.css';
import { TbEyeEdit } from "react-icons/tb";

const Card = ({ project }) => {
  const { thumbnail, projectName, author, projectDescription } = project;

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
          <button className="view-details-btn">
            <TbEyeEdit />
          </button>
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
