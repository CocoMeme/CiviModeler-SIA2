## Goal: Integrate Sloyd-AI API for generating 3D models into our MERN project (CiviModel) and store the resulting model file in Cloudinary.
We then need a frontend that renders the 3D model using Three.js.

Steps:

1. Cloudinary Setup:
   - Create a configuration file (e.g., config/cloudinary.js) that sets up Cloudinary using your cloud_name, api_key, and api_secret.
   - Use Cloudinary’s Node.js SDK and ensure that you can upload files as "raw" (so it accepts GLB files).

2. Update the project model (projectModel.js):
   - Modify the Mongoose schema to add a new nested field (e.g., "sloyd") to store details from the Sloyd API, such as:
       - interactionId (String)
       - confidenceScore (Number)
       - responseEncoding (String)
       - modelOutputType (String)
       - modelUrl (String) – to store the Cloudinary URL after upload
       - thumbnailPreview (String) – if needed
   - Ensure this field is optional and documented.

3. Create the controller function in projectController.js:
   - Create a new Express route handler function (e.g., create3DModel).
   - This function should:
       a. Accept a POST request with the necessary input (e.g., the text prompt).
       b. Make a POST request to the Sloyd API endpoint (https://api.sloyd.ai/create) with required credentials and prompt.
       c. Receive the API response and extract the model data (GLB) along with other response details.
       d. Save the generated model file to Cloudinary using the "raw" resource_type.
       e. Update the corresponding project document in MongoDB with the Cloudinary URL and Sloyd details.
       f. Send back a JSON response containing the updated project details or any relevant status.

4. Create a React component for displaying the 3D model:
   - Create a component (e.g., ProjectViewer.jsx) that:
       a. Fetches the project details (including the Cloudinary modelUrl) from your backend API.
       b. Initializes a Three.js scene, camera, and renderer.
       c. Uses the Three.js GLTFLoader to load the model from the Cloudinary URL.
       d. Renders the scene and handles basic user interactions (like orbit controls, if desired).
       e. Includes error handling in case the model fails to load.

Include inline comments to explain each step of the code, and ensure proper error handling is in place for network calls and file uploads.

Please generate:
- A Cloudinary configuration example.
- The updated projectModel.js with the new "sloyd" field.
- The create3DModel function in projectController.js.
- A React component code snippet (ProjectViewer.jsx) using Three.js and GLTFLoader to load and display the model.

