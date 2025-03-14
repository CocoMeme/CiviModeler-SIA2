import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_TO_DOWNLOAD = [
  {
    url: 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js',
    destination: '../public/js/three.min.js'
  },
  {
    url: 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js',
    destination: '../public/js/GLTFLoader.js'
  }
];

async function ensureDirectoryExists(dirPath) {
  try {
    const fullPath = path.join(__dirname, dirPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`Created directory: ${fullPath}`);
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    throw error;
  }
}

async function downloadFile(url, destination) {
  // Ensure the directory exists
  await ensureDirectoryExists(path.dirname(destination));
  
  const fullPath = path.join(__dirname, destination);
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${fullPath}...`);
    
    const file = fs.createWriteStream(fullPath);
    https.get(url, response => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${url} to ${fullPath}`);
        resolve();
      });
      
      file.on('error', err => {
        fs.unlink(fullPath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', err => {
      fs.unlink(fullPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function downloadAllFiles() {
  try {
    for (const file of FILES_TO_DOWNLOAD) {
      await downloadFile(file.url, file.destination);
    }
    console.log('All files downloaded successfully');
  } catch (error) {
    console.error('Error downloading files:', error);
  }
}

// Run the function when this script is executed directly
downloadAllFiles();

export { downloadAllFiles };
