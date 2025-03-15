import React from 'react';
import { FiSettings, FiSave, FiBox, FiCpu, FiFileText } from 'react-icons/fi';
import DeleteProject from './DeleteProject';

const ProjectConfiguration = ({
  projectDetailsState,
  handleGenerate3D,
  handleGoTo3D,
  setOpenDialog,
  handleGeneratePDF,
  setInfoDialog
}) => {
  const buttonBaseStyle = "w-full flex items-center justify-center px-4 py-3 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg group";

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg mb-4 transform transition-all duration-200 hover:shadow-xl">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <FiSettings className="w-6 h-6 text-gray-800" />
          <h2 className="text-xl font-bold text-gray-800">Project Configuration</h2>
        </div>
        <button 
          onClick={() => setInfoDialog({ 
            open: true, 
            content: 'Configure your project settings before generating a model or confirming the project.' 
          })}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ⋮
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-6 bg-purple-50 p-3 rounded-lg border border-purple-100">
        Update, generate, or manage your project's configuration using the options below.
      </p>

      <div className="grid grid-cols-1 gap-1">
        <div className="flex flex-col gap-2">
          {/* Primary Actions */}
          <button
            onClick={() => setOpenDialog(true)}
            className={`${buttonBaseStyle} bg-purple-600 hover:bg-purple-700`}
          >
            <FiSave className="mr-2 group-hover:scale-110 transition-transform" />
            Update Project
          </button>

          <button
            onClick={handleGenerate3D}
            className={`${buttonBaseStyle} bg-cyan-600 hover:bg-cyan-700`}
          >
            <FiBox className="mr-2 group-hover:scale-110 transition-transform" />
            Generate 3D Model
          </button>

          <button
            onClick={handleGoTo3D}
            className={`${buttonBaseStyle} bg-green-600 hover:bg-green-700`}
          >
            <FiCpu className="mr-2 group-hover:scale-110 transition-transform" />
            Go to 3D Editor
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={handleGeneratePDF}
            className={`${buttonBaseStyle} bg-blue-600 hover:bg-blue-700`}
          >
            <FiFileText className="mr-2 group-hover:scale-110 transition-transform" />
            Generate PDF
          </button>
          
          <DeleteProject 
            projectId={projectDetailsState._id} 
            projectName={projectDetailsState.projectName}
            className={`${buttonBaseStyle} bg-red-600 hover:bg-red-700`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectConfiguration;
