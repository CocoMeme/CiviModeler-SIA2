import React, { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { FiTrash2 } from 'react-icons/fi';

const Modal = ({ children }) => {
  return createPortal(
    children,
    document.getElementById('portal-root')
  );
};

const DeleteProject = ({ projectId, projectName, className }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`${backendUrl}/api/project/${projectId}`);
      toast.success('Project deleted successfully');
      navigate('/user/home');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className={className || "px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-all"}
      >
        <div className="flex items-center justify-center">
          <FiTrash2 className="mr-2 group-hover:scale-110 transition-transform" />
          Delete Project
        </div>
      </button>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <Modal>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold border-b pb-2 text-gray-800">Delete Project</h2>
              <p className="mt-4 text-gray-600">
                Are you sure you want to delete <strong>{projectName}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end mt-6 gap-3">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                  onClick={() => setShowConfirmation(false)}
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

export default DeleteProject;