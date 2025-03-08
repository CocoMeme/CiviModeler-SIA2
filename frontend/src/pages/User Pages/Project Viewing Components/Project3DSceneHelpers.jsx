import React, { useEffect } from 'react';
import * as THREE from 'three';

// Custom grid with glowing blue lines
export const CustomGrid = () => {
  const gridRef = React.useRef();

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.7; // Make grid slightly transparent
      gridRef.current.material.transparent = true;
    }
  }, []);

  return <gridHelper ref={gridRef} args={[50, 50, "#1e90ff", "#1e90ff"]} />;
};

// A placeholder cube while loading or if there's an issue
export const PlaceholderModel = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="orange" />
  </mesh>
);

// Component to display version information
export const VersionInfo = ({ currentVersion }) => {
  if (!currentVersion) return null;
  
  return (
    <div style={{ 
      position: "absolute", 
      top: "10px", 
      left: "50%", 
      transform: "translateX(-50%)",
      zIndex: 10, 
      background: "rgba(0, 0, 0, 0.6)",
      color: "#fff",
      padding: "5px 10px",
      borderRadius: "5px",
      fontSize: "14px"
    }}>
      Version {currentVersion.version} 
      {currentVersion.description && ` - ${currentVersion.description}`}
    </div>
  );
};