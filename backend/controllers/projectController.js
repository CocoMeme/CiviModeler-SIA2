import projectModel from '../models/projectModel.js';
import userModel from '../models/userModel.js';
import axios from 'axios';
import cloudinary from '../config/cloudinary.js';
import Project from '../models/projectModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import { downloadModelFile, ensureTempDirectory } from '../utils/modelUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define default thumbnail path
const DEFAULT_THUMBNAIL = path.join(__dirname, '../../frontend/public/project images/No Image.png');

// HTML template for rendering 3D model with Three.js
const getThreeJsTemplate = (modelPath, threejsPath, gltfLoaderPath) => {
  // Read the model file as a Buffer and convert to base64
  const modelBuffer = fs.readFileSync(modelPath);
  const modelBase64 = modelBuffer.toString('base64');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>3D Model Renderer</title>
  <style>
    body { margin: 0; overflow: hidden; background-color: #f0f0f0; }
    canvas { width: 100%; height: 100%; display: block; }
    #loading { 
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%); 
      font-family: Arial, sans-serif; 
      font-size: 20px; 
      color: #333;
    }
    #error {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: Arial, sans-serif;
      font-size: 18px;
      color: #ff3333;
      text-align: center;
      display: none;
    }
  </style>
  <script>${fs.readFileSync(threejsPath, 'utf8')}</script>
  <script>${fs.readFileSync(gltfLoaderPath, 'utf8')}</script>
</head>
<body>
  <div id="loading">Loading model...</div>
  <div id="error">Failed to load 3D model</div>
  
  <script>
    window.renderComplete = false;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Use orthographic camera for consistent sizing
    const frustumSize = 10;
    const aspect = 1; // Since we're using 600x600
    const camera = new THREE.OrthographicCamera(
      frustumSize * aspect / -2,
      frustumSize * aspect / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      2000
    );
    
    // Position camera to view from straight on
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      preserveDrawingBuffer: true,
      alpha: true 
    });
    renderer.setSize(600, 600);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
    // Add lights for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add fill light from opposite direction
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, -5, -5);
    scene.add(fillLight);
    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x049ef4 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    function animateCube() {
      if (cube.parent) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animateCube);
    }
    animateCube();

    function handleLoadError(error) {
      console.error('Error loading model:', error);
      document.getElementById('loading').style.display = 'none';
      document.getElementById('error').style.display = 'block';
      window.renderComplete = true;
    }

    setTimeout(() => {
      if (!window.renderComplete) {
        handleLoadError('Timeout');
      }
    }, 10000);
    
    try {
      // Convert base64 to array buffer
      const binaryString = atob('${modelBase64}');
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const loader = new THREE.GLTFLoader();
      loader.parse(
        bytes.buffer,
        '',
        function(gltf) {
          try {
            scene.remove(cube);
            const model = gltf.scene;
            
            // Calculate bounding box
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Calculate scale to fit in view
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = (frustumSize * 0.7) / maxDim; // Reduced scale for better fit
            
            // Create a container for the model
            const container = new THREE.Object3D();
            scene.add(container);
            
            // Add model to container
            container.add(model);
            
            // Scale and center the container
            container.scale.setScalar(scale);
            
            // Adjust vertical position to move model lower
            const verticalOffset = frustumSize * 0.2; // Move down by 20% of view size
            container.position.set(
              -center.x * scale,
              -center.y * scale - verticalOffset, // Add vertical offset here
              -center.z * scale
            );
            
            // Rotate for front view
            model.rotation.set(0, Math.PI, 0); // 180-degree rotation around Y axis
            
            // Tilt slightly for better perspective
            model.rotation.x = -0.2; // Slight tilt forward
            
            // Ensure transformations are applied
            container.updateMatrixWorld(true);
            
            // Adjust camera to look slightly downward
            camera.position.set(0, 2, 10); // Move camera up slightly
            camera.lookAt(0, -verticalOffset, 0); // Look at the offset position
            
            // Render the scene
            renderer.render(scene, camera);
            
            document.getElementById('loading').style.display = 'none';
            window.renderComplete = true;
          } catch (innerError) {
            console.error('Error processing loaded model:', innerError);
            handleLoadError(innerError);
          }
        },
        handleLoadError
      );
    } catch (error) {
      console.error('Error in model loading setup:', error);
      handleLoadError(error);
    }
  </script>
</body>
</html>
`};

// Helper function to generate thumbnail from 3D model using Puppeteer and Three.js
const generateThumbnailFromModel = async (modelPath, projectName, version) => {
  let browser;
  try {
    // Get paths to Three.js files
    const threejsPath = path.join(__dirname, '..', 'public', 'js', 'three.min.js');
    const gltfLoaderPath = path.join(__dirname, '..', 'public', 'js', 'GLTFLoader.js');
    
    // Ensure Three.js files exist
    if (!fs.existsSync(threejsPath) || !fs.existsSync(gltfLoaderPath)) {
      throw new Error('Required Three.js files are missing');
    }
    
    // Verify the model file exists
    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model file not found at path: ${modelPath}`);
    }

    // Launch browser with required flags
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--enable-webgl',
        '--disable-web-security'
      ],
      headless: 'new'
    });
    
    const page = await browser.newPage();
    
    // Set up error handling and logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      console.log(`Browser console [${type}]: ${text}`);
      
      if (type === 'error' || text.includes('Error')) {
        console.error('Detailed browser console error:', {
          type,
          text,
          location: msg.location(),
          stackTrace: msg.stackTrace()
        });
      }
    });
    
    page.on('pageerror', err => {
      console.error('Browser page error:', {
        message: err.message,
        stack: err.stack
      });
    });
    
    // Set viewport
    await page.setViewport({ width: 600, height: 600, deviceScaleFactor: 1 });
    
    // Generate and load the HTML
    const html = getThreeJsTemplate(modelPath, threejsPath, gltfLoaderPath);
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'load', 'domcontentloaded']
    });
    
    // Wait for rendering to complete
    await page.waitForFunction('window.renderComplete === true', { 
      timeout: 15000,
      polling: 100
    });
    
    // Small delay to ensure the render is complete
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'base64',
      omitBackground: true
    });
    
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/png;base64,${screenshot}`,
      {
        folder: 'model_thumbnails/rendered',
        public_id: `${projectName.replace(/\s+/g, '_')}_v${version}`,
        resource_type: 'image',
        access_mode: 'public',
        type: 'upload',
        overwrite: true,
        invalidate: true
      }
    );
    
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Error in thumbnail generation:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

// Helper function to generate and upload thumbnail
const generateAndUploadThumbnail = async (modelData, projectName, version = 1) => {
  try {
    const tempDir = ensureTempDirectory();
    const tempFileName = `${projectName.replace(/\s+/g, '_')}_v${version}.glb`;
    const tempFilePath = path.join(tempDir, tempFileName);
    
    // Save the model data to a temporary file
    if (typeof modelData === 'string' && modelData.startsWith('http')) {
      try {
        await downloadModelFile(modelData, tempFilePath);
      } catch (downloadError) {
        console.error('Error downloading model from URL:', downloadError);
        throw downloadError;
      }
    } else if (Buffer.isBuffer(modelData)) {
      fs.writeFileSync(tempFilePath, modelData);
    } else if (typeof modelData === 'string') {
      if (modelData.startsWith('data:image')) {
        const thumbnailUploadResponse = await cloudinary.uploader.upload(modelData, {
          folder: 'model_thumbnails',
        });
        
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
        
        return thumbnailUploadResponse.secure_url;
      } else {
        fs.writeFileSync(tempFilePath, Buffer.from(modelData, 'base64'));
      }
    } else {
      throw new Error('Invalid model data format');
    }
    
    try {
      const thumbnailUrl = await generateThumbnailFromModel(tempFilePath, projectName, version);
      
      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      return thumbnailUrl;
    } catch (renderError) {
      console.error('Error rendering model with Three.js:', renderError);
      
      // Fall back to creating a colored placeholder
      const text = `${projectName} v${version}`;
      const hash = text.split('').reduce((acc, char) => {
        return (acc << 5) - acc + char.charCodeAt(0) | 0;
      }, 0);
      
      const r = Math.abs(hash % 200); 
      const g = Math.abs((hash >> 8) % 200);
      const b = Math.abs((hash >> 16) % 200);
      
      const bgColor = `rgb:${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      
      try {
        const thumbnailUploadResponse = await cloudinary.uploader.upload(DEFAULT_THUMBNAIL, {
          folder: 'model_thumbnails/generated',
          transformation: [
            { width: 300, height: 300, crop: 'fill', background: bgColor }
          ]
        });
        
        // Now add text overlays in separate transformations
        const textOverlayUrl = cloudinary.url(thumbnailUploadResponse.public_id, {
          transformation: [
            { width: 300, height: 300 },
            { overlay: { font_family: "Arial", font_size: 30, text: encodeURIComponent(projectName.substring(0, 15)) }, 
              color: "white", gravity: "north", y: 40 },
            { overlay: { font_family: "Arial", font_size: 16, text: encodeURIComponent(`Version ${version}`) }, 
              color: "white", gravity: "south", y: 40 }
          ]
        });
        
        return textOverlayUrl;
      } catch (cloudinaryError) {
        console.error('Error creating Cloudinary placeholder:', cloudinaryError);
        
        const simpleUpload = await cloudinary.uploader.upload(DEFAULT_THUMBNAIL, {
          folder: 'model_thumbnails/simple'
        });
        return simpleUpload.secure_url;
      }
    }
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    
    // Upload default image as absolute last resort
    try {
      const defaultUpload = await cloudinary.uploader.upload(DEFAULT_THUMBNAIL, {
        folder: 'model_thumbnails/defaults',
      });
      return defaultUpload.secure_url;
    } catch (fallbackError) {
      console.error('Error uploading default thumbnail:', fallbackError);
      return null;
    }
  }
};

// Update an existing project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // If there's a 3D model URL in the request or in the existing project, generate a new thumbnail
    if (req.body.sloyd && req.body.sloyd.modelUrl) {
      try {
        const thumbnailUrl = await generateAndUploadThumbnail(
          req.body.sloyd.modelUrl, 
          project.projectName,
          project.currentVersion + 1
        );
        
        if (thumbnailUrl) {
          req.body.thumbnail = thumbnailUrl;
        }
      } catch (thumbnailError) {
        console.error('Error generating thumbnail during update:', thumbnailError);
        // Continue with the update even if thumbnail generation fails
      }
    }

    const updatedProject = await projectModel.findByIdAndUpdate(projectId, req.body, { new: true });
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error });
  }
};

// Create a new project
export const createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };
    
    // Set default thumbnail if not provided
    if (!projectData.thumbnail) {
      try {
        const defaultUpload = await cloudinary.uploader.upload(DEFAULT_THUMBNAIL, {
          folder: 'model_thumbnails/defaults',
        });
        projectData.thumbnail = defaultUpload.secure_url;
      } catch (thumbnailError) {
        console.error('Error uploading default thumbnail during creation:', thumbnailError);
        // Continue with project creation even if default thumbnail upload fails
      }
    }
    
    const project = new projectModel(projectData);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Error creating project', error });
  }
};

// Fetch all projects
export const getAllProject = async (req, res) => {
  try {
    const projects = await projectModel.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};

// Fetch all projects created by the specified user
export const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameter
    const userProjects = await projectModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects: userProjects });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user projects', error });
  }
};

// Fetch specific project data
export const getProjectData = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project data', error });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalProjects = await projectModel.countDocuments();
    const totalCost = await projectModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);

    res.status(200).json({
      totalUsers,
      totalProjects,
      totalCost: totalCost[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
};


export const getProjectReportsData = async (req, res) => {
  try {
    const projects = await projectModel.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          totalProjects: { $sum: 1 },
          totalBudget: { $sum: { $ifNull: ["$budget", 0] } },
          totalCost: { $sum: { $ifNull: ["$totalCost", 0] } }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    const contractorProjects = await projectModel.aggregate([
      {
        $group: {
          _id: "$contractorId",
          totalProjects: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "contractors", // Ensure this matches your contractors collection name
          localField: "_id",
          foreignField: "_id",
          as: "contractor"
        }
      },
      {
        $unwind: "$contractor"
      },
      {
        $project: {
          _id: 0,
          contractorName: "$contractor.name",
          totalProjects: 1
        }
      }
    ]);

    res.status(200).json({ projects, contractorProjects });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports data', error });
  }
};

// Fetch top 5 recent projects --- this is for the admin dashboard
export const getRecentProjects = async (req, res) => {
  try {
    const projects = await projectModel.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent projects', error });
  }
};


export const create3DModel = async (req, res) => {
  try {
    const { prompt, projectId, description } = req.body;

    // Make a POST request to the Sloyd API with the required fields
    const sloydResponse = await axios.post(process.env.SLOYD_API_URL, {
      Prompt: prompt,
      ClientId: process.env.SLOYD_CLIENT_ID,
      ClientSecret: process.env.SLOYD_CLIENT_SECRET,
      ModelOutputType: "glb",
      ResponseEncoding: "json"
    });

    // Destructure the Sloyd API response
    const {
      InteractionId,
      ConfidenceScore,
      ResponseEncoding: SloydResponseEncoding,
      ModelOutputType: SloydModelOutputType,
      ModelData,
      ThumbnailPreview
    } = sloydResponse.data;

    // Retrieve the project document from MongoDB
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Ensure the temp directory exists
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Save the model data to a temporary file using the project name and version
    const nextVersion = (project.currentVersion || 0) + 1;
    const tempFileName = `${project.projectName.replace(/\s+/g, '_')}_v${nextVersion}.glb`;
    const tempFilePath = path.join(tempDir, tempFileName);
    fs.writeFileSync(tempFilePath, Buffer.from(ModelData, 'base64'));

    // Upload the model file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'raw',
    });

    // Generate a thumbnail from the model
    let thumbnailUrl = ThumbnailPreview;
    if (!thumbnailUrl) {
      try {
        thumbnailUrl = await generateAndUploadThumbnail(
          Buffer.from(ModelData, 'base64'),
          project.projectName,
          nextVersion
        );
      } catch (thumbnailError) {
        console.error('Error generating thumbnail during model creation:', thumbnailError);
      }
    }

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    // Create the new version data
    const newVersion = {
      interactionId: InteractionId,
      confidenceScore: ConfidenceScore,
      responseEncoding: SloydResponseEncoding,
      modelOutputType: SloydModelOutputType,
      modelUrl: uploadResponse.secure_url,
      thumbnailPreview: thumbnailUrl || uploadResponse.secure_url,
      version: nextVersion,
      description: description || `Version ${nextVersion}`,
      createdAt: new Date()
    };

    // Update current sloyd data and add to versions array
    project.sloyd = { ...newVersion };
    if (!project.modelVersions) {
      project.modelVersions = [];
    }
    project.modelVersions.push(newVersion);
    project.currentVersion = nextVersion;
    
    // Update project thumbnail with the new model's thumbnail
    if (thumbnailUrl) {
      project.thumbnail = thumbnailUrl;
    }

    await project.save();

    res.json({ 
      currentVersion: project.sloyd,
      allVersions: project.modelVersions,
      versionNumber: nextVersion
    });
  } catch (error) {
    console.error("Error creating 3D model:", error);
    res.status(500).send("Server Error");
  }
};

export const getMaterialData = async (req, res) => {
  try {
    console.log("Fetching material data...");
    const materialData = await projectModel.aggregate([
      { $unwind: "$materials" },
      {
        $group: {
          _id: "$materials.material",
          totalQuantity: { $sum: "$materials.quantity" }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    console.log("Material data fetched:", materialData);
    res.status(200).json(materialData);
  } catch (error) {
    console.error('Error fetching material data:', error);
    res.status(500).json({ message: 'Error fetching material data', error });
  }
};

// Add a new controller to get all versions of a model
export const getModelVersions = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({
      currentVersion: project.sloyd,
      allVersions: project.modelVersions,
      currentVersionNumber: project.currentVersion
    });
  } catch (error) {
    console.error("Error fetching model versions:", error);
    res.status(500).send("Server Error");
  }
};

export const saveModel = async (req, res) => {
  try {
    const { projectId, description } = req.body;
    const updatedMaterialsJson = req.body.updatedMaterials;
    const modelFile = req.files?.model;

    if (!modelFile) {
      return res.status(400).json({ error: "No model file provided" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Upload the model file to Cloudinary first
    const uploadResponse = await cloudinary.uploader.upload(modelFile.tempFilePath, {
      resource_type: 'raw',
      folder: 'model_versions',
      use_filename: true,
      unique_filename: true
    });

    // Download the uploaded model to generate thumbnail
    const nextVersion = (project.currentVersion || 0) + 1;
    let thumbnailUrl = null;
    
    try {
      thumbnailUrl = await generateAndUploadThumbnail(
        uploadResponse.secure_url, // Use the Cloudinary URL
        project.projectName,
        nextVersion
      );
    } catch (thumbnailError) {
      console.error('Error generating thumbnail during manual model save:', thumbnailError);
      // Continue without thumbnail if generation fails
    }

    // Create the new version data
    const newVersion = {
      interactionId: `manual_update_${Date.now()}`,
      confidenceScore: 1.0,
      responseEncoding: "binary",
      modelOutputType: "glb",
      modelUrl: uploadResponse.secure_url,
      thumbnailPreview: thumbnailUrl || project.sloyd?.thumbnailPreview || project.thumbnail,
      version: nextVersion,
      description: description || `Manual update - Version ${nextVersion}`,
      createdAt: new Date()
    };

    // Update current sloyd data and add to versions array
    project.sloyd = { ...newVersion };
    if (!project.modelVersions) {
      project.modelVersions = [];
    }
    project.modelVersions.push(newVersion);
    project.currentVersion = nextVersion;
    
    // Update project thumbnail with the new model's thumbnail if available
    if (thumbnailUrl) {
      project.thumbnail = thumbnailUrl;
    }

    // Handle material updates if provided
    if (updatedMaterialsJson) {
      try {
        const parsedMaterials = typeof updatedMaterialsJson === 'string' 
          ? JSON.parse(updatedMaterialsJson) 
          : updatedMaterialsJson;
        
        if (parsedMaterials) {
          let totalCost = 0;
          
          const materialArray = Array.isArray(parsedMaterials) 
            ? parsedMaterials 
            : Object.entries(parsedMaterials).map(([name, details]) => ({
                material: name,
                quantity: details.quantity,
                unitPrice: details.unit_price || details.unitPrice,
                totalPrice: details.total_price || details.totalPrice
              }));
          
          project.materials = materialArray.map(material => {
            const totalPrice = material.quantity * material.unitPrice;
            totalCost += totalPrice;
            return {
              material: material.material,
              quantity: material.quantity,
              unitPrice: material.unitPrice,
              totalPrice
            };
          });
          
          project.totalCost = totalCost;
        }
      } catch (error) {
        console.error("Error processing material updates:", error);
      }
    }

    project.updatedAt = new Date();
    await project.save();

    // Clean up the temporary file after successful processing
    if (fs.existsSync(modelFile.tempFilePath)) {
      fs.unlinkSync(modelFile.tempFilePath);
    }

    res.json({
      success: true,
      newVersion,
      projectDetails: {
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        author: project.author,
        size: project.size,
        budget: project.budget,
        style: project.style,
        clientDetails: project.clientDetails,
        materials: project.materials,
        totalCost: project.totalCost,
        updatedAt: project.updatedAt,
        createdAt: project.createdAt,
        thumbnail: project.thumbnail
      },
      message: "Model and materials updated successfully"
    });
  } catch (error) {
    // Clean up temporary file in case of error
    if (modelFile && fs.existsSync(modelFile.tempFilePath)) {
      fs.unlinkSync(modelFile.tempFilePath);
    }
    console.error("Error saving model:", error);
    res.status(500).json({ error: "Failed to save model" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete any associated model files or thumbnails from Cloudinary
    if (project.sloyd && project.sloyd.modelUrl) {
      const publicId = project.sloyd.modelUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    }

    if (project.thumbnail) {
      const publicId = project.thumbnail.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete project from database
    await projectModel.findByIdAndDelete(projectId);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project', error });
  }
};