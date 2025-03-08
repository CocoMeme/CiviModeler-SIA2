import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';

const ProjectShortcuts = () => {
  const showShortcutsHelp = () => {
    alert(`
Keyboard Shortcuts:

Material Controls:
- Ctrl + Z: Undo material change
- Ctrl + Shift + Z: Redo material change

Transform Controls:
Position:
- Arrow Keys: Move in X/Y plane
- [ and ]: Move in Z axis
- Hold Shift for larger steps

Rotation (Hold Alt):
- Q/E: Rotate around X axis
- A/D: Rotate around Y axis
- W/S: Rotate around Z axis
- Hold Shift for larger angles

Scale (Hold Ctrl):
- X: Scale X axis
- Y: Scale Y axis
- Z: Scale Z axis
- Hold Shift to decrease
- Delete/Backspace: Delete selected parts
    `);
  };

  return (
    <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
      <button
        onClick={showShortcutsHelp}
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
        <FiHelpCircle size={18} />
        {/* <span>Keyboard Shortcuts</span> */}
      </button>
    </div>
  );
};

export default ProjectShortcuts;