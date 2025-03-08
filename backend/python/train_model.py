from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from estimation import estimate_materials
import os
import tempfile
import trimesh
from trimesh.exchange.gltf import export_gltf
import json

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

    # Format materials to be consistent with the frontend expectations
    formatted_materials = {}
    for material_name, details in result["materials"].items():
        formatted_materials[material_name] = {
            "quantity": details["quantity"],
            "unit_price": details["unit_price"],
            "total_price": details["total_price"]
        }

    return jsonify({
        "materials": formatted_materials,
        "total_cost": result["total_cost"],
        "budget_status": result["budget_status"]
    })

@app.route('/estimate-from-components', methods=['POST'])
def estimate_from_components():
    """
    Estimate materials based on model components.
    
    Expects JSON with:
    {
        "components": [
            {"name": "wall", "quantity": 5},
            {"name": "roof", "quantity": 1},
            ...
        ],
        "budget": 10000,
        "size": 100,
        "design_style": "Modern"
    }
    """
    data = request.get_json()
    components = data.get("components", [])
    budget = data.get("budget")
    size = data.get("size")
    design_style = data.get("design_style")
    
    if not all([budget, size, design_style]):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Get base estimation
    base_result = estimate_materials(budget, size, design_style)
    if "error" in base_result:
        return jsonify(base_result), 400
    
    # Adjust estimation based on components
    materials = base_result["materials"].copy()
    
    # Component to material mapping
    component_material_map = {
        "wall": "Bricks",
        "floor": "Cement",
        "roof": "Roofing",
        "window": "Glass",
        "door": "Wood",
        "beam": "Steel",
        "column": "Steel",
        "foundation": "Cement",
        "ceiling": "Wood",
        "tile": "Tiles",
        "paint": "Paint",
    }
    
    # Adjust quantities based on components
    for component in components:
        name = component.get("name", "").lower()
        quantity = component.get("quantity", 0)
        
        # Find what material this component impacts
        for key_word, material in component_material_map.items():
            if key_word in name and material in materials:
                # Adjust the material quantity based on component
                factor = 1.0
                if "added" in component:
                    factor = 1.0 + (component.get("added", 0) * 0.1)
                elif "removed" in component:
                    factor = 1.0 - min(0.9, (component.get("removed", 0) * 0.1))
                
                current_qty = materials[material]["quantity"]
                materials[material]["quantity"] = round(current_qty * factor, 2)
                materials[material]["total_price"] = round(materials[material]["quantity"] * materials[material]["unit_price"], 2)
                break
    
    # Recalculate total cost and format materials
    total_cost = sum(material["total_price"] for material in materials.values())
    
    # Format materials to be consistent with frontend expectations
    formatted_materials = {}
    for material_name, details in materials.items():
        formatted_materials[material_name] = {
            "quantity": details["quantity"],
            "unit_price": details["unit_price"],
            "total_price": details["total_price"]
        }
    
    return jsonify({
        "materials": formatted_materials,
        "total_cost": round(total_cost, 2),
        "budget_status": f"Total Cost: ₱{total_cost:,.2f}. " +
                       f"Status: {'Exceeds Budget' if total_cost > budget else 'Within Budget'}."
    })

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
