import React from "react";

const Docs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📖 System Documentation</h1>
      <p style={styles.subtext}>Welcome to the guide on how to use our system effectively.</p>

      {/* Steps 1 to 3 in one row */}
      <div style={styles.rowContainer}>
        {[0, 1, 2].map((index) => (
          <div key={index} style={styles.card}>
            <h2 style={styles.stepTitle}>{`Step ${index + 1}: ${steps[index]}`}</h2>
            <p style={styles.description}>{descriptions[index]}</p>
            <img src={images[index]} alt={steps[index]} style={styles.image} />
            <ol style={styles.list}>
              {instructions[index].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Steps 4 and 5 in another row */}
      <div style={styles.rowContainer}>
        {[3, 4].map((index) => (
          <div key={index} style={styles.card}>
            <h2 style={styles.stepTitle}>{`Step ${index + 1}: ${steps[index]}`}</h2>
            <p style={styles.description}>{descriptions[index]}</p>
            <img src={images[index]} alt={steps[index]} style={styles.image} />
            <ol style={styles.list}>
              {instructions[index].map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
};

const steps = [
  "Register & Login",
  "Verify Your Account",
  "Create a Project",
  "View Material Estimation & Generate 3D Model",
  "Modify Your 3D Model"
];

const descriptions = [
  "Before accessing the system, you need to create an account.",
  "To access all features, you must verify your email.",
  "Once logged in, you can start creating a new project.",
  "After entering project details, you will see estimated materials.",
  "Modify the 3D model to match your requirements."
];

const images = [
  "/images/RegisterScreenshot.png",
  "/images/OTPScreenshot1.png",
  "/images/CreateAProjectScreenshot.png",
  "/images/MaterialScreenshot.png",
  "/images/3DModifyScreenshot.png"
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
    padding: "60px",
    maxWidth: "1400px",
    margin: "auto",
    fontFamily: "'Arial', sans-serif",
    color: "#333",
    textAlign: "center",
    marginTop: "100px",
  },
  heading: {
    fontSize: "42px",
    color: "#2c3e50",
    marginBottom: "30px",
  },
  subtext: {
    fontSize: "24px",
    marginBottom: "40px",
  },
  rowContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "40px",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: "40px",
    width: "48%",
    minWidth: "350px",
    borderRadius: "16px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    textAlign: "left",
  },
  stepTitle: {
    color: "#800080",
    fontSize: "30px",
    marginBottom: "15px",
  },
  description: {
    fontSize: "20px",
    marginBottom: "15px",
  },
  list: {
    paddingLeft: "30px",
    lineHeight: "1.8",
    fontSize: "18px",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "12px",
    marginBottom: "20px",
  },
};

export default Docs;
