import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
// Use the standard No Image file as default
const defaultImage = '/project images/No Image.png';
import '../../../public/styles/ProjectCard.css';
import { FaEye, FaCube, FaTrash, FaInfoCircle } from 'react-icons/fa';
import GuestProjectPreview from '../../pages/Guest Pages/GuestProjectPreview';

const Modal = ({ children }) => {
  return createPortal(
    children,
    document.getElementById('portal-root')
  );
};

const Card = ({ project, contractors, onClick, onPreview, onEdit, onDelete }) => {
  const { thumbnail, projectName, author, projectDescription, createdAt, contractorId } = project;
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${backendUrl}/api/project/${project._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        if (onDelete) {
          onDelete(project);
        }
        toast.success('Project deleted successfully');
      } else {
        toast.error(data.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false); // Always close the modal after operation completes
    }
  };

  const handlePreview = (e) => {
    e.stopPropagation();
    setShowPreview(true);
  };

  return (
    <>
      <div 
        className="card-container horizontal-card relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-thumbnail-container">
          <img
            src={thumbnail || defaultImage}
            alt={projectName}
            className="card-thumbnail"
            onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
          />
        </div>
        <div className="card-content">
          <div className='card-details' onClick={() => onClick(project)}>
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
          
          <div 
            className={`absolute right-0 top-0 h-full flex flex-col justify-between transition-transform duration-300 ${
              isHovered ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
            style={{ 
              background: 'linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1) 20%)',
              width: '40px'
            }}
          >
            <button
              onClick={handlePreview}
              className="w-full h-1/4 flex items-center justify-center bg-blue-400 hover:bg-blue-600 text-white transition-colors duration-200"
              title="Preview"
            >
              <FaEye size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/user/project-overview', { state: project });
              }}
              className="w-full h-1/4 flex items-center justify-center bg-purple-400 hover:bg-purple-600 text-white transition-colors duration-200"
              title="Overview"
            >
              <FaInfoCircle size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/project-viewer/work-station', { 
                  state: { 
                    modelUrl: project.sloyd?.modelUrl,
                    projectId: project._id 
                  } 
                });
              }}
              className="w-full h-1/4 flex items-center justify-center bg-green-400 hover:bg-green-600 text-white transition-colors duration-200"
              title="3D Editor"
            >
              <FaCube size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="w-full h-1/4 flex items-center justify-center bg-red-400 hover:bg-red-600 text-white transition-colors duration-200"
              title="Delete"
            >
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <Modal>
          <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[9999]">
            <div className="w-full h-full max-w-[95vw] max-h-[95vh] bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
              <GuestProjectPreview 
                project={project} 
                onClose={() => setShowPreview(false)} 
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      {showDeleteConfirm && (
        <Modal>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold border-b pb-2 text-gray-800">Delete Project</h2>
              <p className="mt-4 text-gray-600">
                Are you sure you want to delete <strong>{project.projectName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end mt-6 gap-3">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Project'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Loading Overlay */}
      {isDeleting && (
        <Modal>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
              <p className="text-white mt-4 font-semibold">Deleting project...</p>
            </div>
          </div>
        </Modal>
      )}
    </>
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
    _id: PropTypes.string.isRequired,
  }).isRequired,
  contractors: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  onClick: PropTypes.func,
  onPreview: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default Card;