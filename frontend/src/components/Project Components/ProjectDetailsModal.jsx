import React from 'react'
import PropTypes from 'prop-types'
import '../../../public/styles/ProjectDetailsModal.css'; 

const ProjectDetailsModal = ({ project, onClose, view }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        {view === 'details' && (
          <>
            <h2>{project.projectName}</h2>
            <p>Material Estimation: {project.materialEstimation}</p>
          </>
        )}
        {view === 'materials' && (
          <>
            <h2>Materials</h2>
            {project.materials && project.materials.length > 0 ? (
              <div className="materials-list">
                <table>
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.materials.map((material, index) => (
                      <tr key={index}>
                        <td>{material.material}</td>
                        <td>{material.quantity}</td>
                        <td>₱{material.unitPrice.toLocaleString()}</td>
                        <td>₱{material.totalPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h3>Total Cost: ₱{project.materials.reduce((acc, material) => acc + material.totalPrice, 0).toLocaleString()}</h3>
              </div>
            ) : (
              <p>No materials available.</p>
            )}
          </>
        )}
        {view === '3d' && (
          <div className="view-3d">
            <iframe src="path/to/3d/viewer" title="3D Viewer" width="100%" height="400px"></iframe>
          </div>
        )}
      </div>
    </div>
  )
}

ProjectDetailsModal.propTypes = {
  project: PropTypes.shape({
    projectName: PropTypes.string.isRequired,
    author: PropTypes.string,
    materialEstimation: PropTypes.string,
    materials: PropTypes.arrayOf(
      PropTypes.shape({
        material: PropTypes.string,
        quantity: PropTypes.number,
        unitPrice: PropTypes.number,
        totalPrice: PropTypes.number,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
}

export default ProjectDetailsModal