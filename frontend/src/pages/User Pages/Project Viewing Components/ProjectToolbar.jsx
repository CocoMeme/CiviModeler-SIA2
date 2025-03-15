import React from 'react';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProjectToolbar = ({ isSaving, modelLoading, onSave, onSaveSuccess }) => {
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await onSave();
      toast.success('Changes saved successfully!');
      // Only call onSaveSuccess if it exists
      if (typeof onSaveSuccess === 'function') {
        onSaveSuccess();
      }
    } catch (error) {
      toast.error('Failed to save changes');
    }
  };

  return (
    <div style={{ 
      position: "absolute", 
      top: "10px", 
      left: "10px", 
      zIndex: 10, 
      display: 'flex', 
      gap: '10px' 
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "#333",
          color: "#fff",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
        }}
        className="flex items-center gap-2"
      >
        <FiArrowLeft size={18} />
        <span>Back</span>
      </button>
      
      <button
        onClick={handleSave}
        disabled={isSaving || modelLoading}
        style={{
          background: isSaving || modelLoading ? "#666" : "#22c55e",
          color: "#fff",
          padding: "10px 15px",
          border: "none",
          borderRadius: "5px",
          cursor: isSaving || modelLoading ? "not-allowed" : "pointer",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
        className="flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <AiOutlineLoading3Quarters className="animate-spin" size={18} />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <FiSave size={18} />
            <span>Save Changes</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ProjectToolbar;