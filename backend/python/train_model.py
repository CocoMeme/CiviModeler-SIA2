from flask import Flask, request, jsonify
from flask_cors import CORS
from estimation import estimate_materials

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

if __name__ == '__main__':
    app.run(debug=True, port=5001)