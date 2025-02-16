from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from estimation import estimate_materials
import os
import tempfile
import trimesh
from trimesh.exchange.gltf import export_gltf

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

@app.route('/estimate', methods=['POST'])
def estimate():
    data = request.get_json()
    budget = data.get("budget")
    size = data.get("size")
    design_style = data.get("design_style")

    if not all([budget, size, design_style]):
        return jsonify({"error": "Missing required fields"}), 400

    result = estimate_materials(budget, size, design_style)
    if "error" in result:
        return jsonify(result), 400

    return jsonify(result)

@app.route('/generate-model', methods=['POST'])
def generate_model():
    data = request.get_json()
    size = data.get("size")
    design_style = data.get("design_style")
    
    mesh = trimesh.creation.box(extents=[float(size), float(size), float(size)])
    
    with tempfile.NamedTemporaryFile(delete=False,suffix=".gltf") as temp_file:
        export_gltf(mesh, temp_file.name)
        model_path = temp_file.name
    
    return jsonify({"model_url": f"http://localhost:5001/download-model/{os.path.basename(model_path)}"})

@app.route('/download-model/<filename>', methods=['GET'])
def download_model(filename):
    return send_file(os.path.join(tempfile.gettempdir(),filename))


if __name__ == '__main__':
    app.run(debug=True, port=5001)
    