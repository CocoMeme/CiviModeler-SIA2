import React, { useEffect, useState } from "react";

const GeneratingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate a loading process
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          // Redirect or show completion message
          setTimeout(() => {
            alert("Generation complete! Redirecting...");
            window.location.href = "/model-generator"; // Replace with your actual redirect URL
          }, 500);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div style={styles.body}>
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <h1 style={styles.loadingTitle}>Generating Your Model</h1>
        <p style={styles.loadingText}>Please wait while we process your request...</p>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progress, width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

// CSS Styles (as JS objects)
const styles = {
  body: {
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    // backgroundColor: "#0a192f", // Dark navy blue
    color: "#f0f0f0", // Light text color
    fontFamily: "Arial, sans-serif",
  },
  loadingContainer: {
    textAlign: "center",
    backgroundColor: "#112240", // Slightly lighter navy blue
    padding: "40px",
    borderRadius: "15px",
    // boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  },
  loadingSpinner: {
    border: "6px solid #233554", // Medium navy blue
    borderTop: "6px solid #64ffda", // Teal accent color
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 1.5s linear infinite",
    margin: "0 auto 20px",
  },
  loadingTitle: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#64ffda", // Teal accent color
  },
  loadingText: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  progressBar: {
    width: "100%",
    height: "10px",
    backgroundColor: "#233554", // Medium navy blue
    borderRadius: "5px",
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#64ffda", // Teal accent color
    transition: "width 0.5s ease-in-out",
  },
};

// Keyframes for spinner animation
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject keyframes into the document
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(spinKeyframes, styleSheet.cssRules.length);

export default GeneratingPage;