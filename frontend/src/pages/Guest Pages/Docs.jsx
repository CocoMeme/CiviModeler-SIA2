import React from "react";

const Docs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📖 System Documentation</h1>
      <p style={styles.subtext}>Welcome to the guide on how to use our system effectively.</p>

      <div style={styles.stepsContainer}>
        {["Register & Login", "Verify Your Account", "Create a Project", "View Material Estimation & Generate 3D Model", "Modify Your 3D Model"].map((step, index) => (
          <div key={index} style={styles.card}>
            <h2 style={styles.stepTitle}>{`Step ${index + 1}: ${step}`}</h2>
            <p>{descriptions[index]}</p>
            <img src={images[index]} alt={step} style={styles.image} />
            <ol style={styles.list}>{instructions[index].map((item, i) => <li key={i}>{item}</li>)}</ol>
          </div>
        ))}
      </div>
    </div>
  );
};

const descriptions = [
  "Before accessing the system, you need to create an account.",
  "To access all features, you must verify your email.",
  "Once logged in, you can start creating a new project.",
  "After entering project details, you will see estimated materials.",
  "Modify the 3D model to match your requirements."
];

const images = [
  "/images/RegisterScreenshot.png",
  "/images/OTPScreenshot.png",
  "/images/CreateAProjectScreenshot.png",
  "/images/MaterialScreenshot.png",
  "/images/tutorial/3d-model.png"
];

const instructions = [
  ["Go to the Register page.", "Fill in your details.", "Click Sign Up."],
  ["Check your email inbox.", "Enter the OTP received.", "Once verified, start using the system."],
  ["Go to My Dashboard.", "Click '+ Create Project'.", "Fill out the details and submit."],
  ["Choose a contractor.", "Review material estimation.", "Download as PDF or generate 3D model."],
  ["Click 'Go to 3D'.", "Modify the model using the editor.", "Save changes when done."]
];

const styles = {
    container: {
        padding: "40px",
        maxWidth: "1000px",
        margin: "auto",
        fontFamily: "'Arial', sans-serif",
        color: "#333",
        textAlign: "center",
        marginTop: "80px", // Added margin to move it lower
      },
      heading: {
        fontSize: "32px",
        color: "#2c3e50",
        marginTop: "20px", // Further adjust position if needed
      },
  subtext: {
    fontSize: "20px",
    marginBottom: "30px",
  },
  stepsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "30px",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: "30px",
    width: "45%",
    minWidth: "320px",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    textAlign: "left",
  },
  stepTitle: {
    color: "#800080",
    fontSize: "26px",
    marginBottom: "12px",
  },
  list: {
    paddingLeft: "25px",
    lineHeight: "1.8",
    fontSize: "18px",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: "15px",
  },
};

export default Docs;