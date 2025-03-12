# Updated Material costs per unit (in PHP) based on real SRP in the Philippines
material_costs = {
    "Modern": {
        "Cement": 259,  # per 40kg bag
        "Sand": 1435,  # per cubic meter
        "Gravel": 1310,  # per cubic meter
        "Bricks": 12,  # per piece (4" CHB)
        "Steel": 156,  # per 6m (10mm rebar)
        "Wood": 656,  # per sheet (1/2" plywood)
        "Tiles": 300,  # estimated per 12x12 tiles
        "Paint": 640,  # per gallon
        "Roofing": 400,  # per piece (G.I. sheet)
        "Glass": 850   # per sqm of clear glass
    },
    "Classic": {
        "Cement": 259, "Sand": 1435, "Gravel": 1310, "Bricks": 12, 
        "Steel": 156, "Wood": 656, "Tiles": 350, "Paint": 640, "Roofing": 450,
        "Glass": 950
    },
    "Rustic": {
        "Cement": 259, "Sand": 1435, "Gravel": 1310, "Bricks": 12, 
        "Steel": 156, "Wood": 656, "Tiles": 400, "Paint": 640, "Roofing": 500,
        "Glass": 750
    }
}

# Material quantities per sqm based on design style
material_quantities = {
    "Modern": {
        "Cement": 3, "Sand": 0.14, "Gravel": 0.14, "Bricks": 55, 
        "Steel": 12, "Wood": 3, "Tiles": 1.5, "Paint": 0.6, "Roofing": 1,
        "Glass": 0.2
    },
    "Classic": {
        "Cement": 2.8, "Sand": 0.13, "Gravel": 0.13, "Bricks": 50, 
        "Steel": 10, "Wood": 4, "Tiles": 1.7, "Paint": 0.5, "Roofing": 1,
        "Glass": 0.15
    },
    "Rustic": {
        "Cement": 2.5, "Sand": 0.12, "Gravel": 0.12, "Bricks": 60, 
        "Steel": 9, "Wood": 6, "Tiles": 2, "Paint": 0.7, "Roofing": 1,
        "Glass": 0.1
    }
}

# Component to material impact multipliers
# This defines how much a component impacts material quantities
component_impact_factors = {
    "wall": {"Bricks": 1.0, "Cement": 0.3, "Paint": 0.2},
    "floor": {"Cement": 1.0, "Tiles": 0.8},
    "ceiling": {"Wood": 1.0},
    "roof": {"Roofing": 1.0, "Wood": 0.5},
    "foundation": {"Cement": 1.5, "Sand": 0.8, "Gravel": 0.8, "Steel": 0.3},
    "beam": {"Cement": 0.3, "Steel": 1.0},
    "column": {"Cement": 0.5, "Steel": 0.7},
    "window": {"Glass": 1.0, "Wood": 0.2},
    "door": {"Wood": 1.0},
    "tile": {"Tiles": 1.0},
}

def estimate_materials(budget, size, design_style):
    if design_style not in material_costs:
        return {"error": "Invalid design style. Choose from Modern, Classic, or Rustic."}

    budget = int(budget)
    size = int(size)
    materials = {}
    total_cost = 0

    for material, cost_per_unit in material_costs[design_style].items():
        quantity = material_quantities[design_style][material] * size
        total_material_cost = quantity * cost_per_unit
        total_cost += total_material_cost

        materials[material] = {
            "quantity": round(quantity, 2),
            "unit_price": cost_per_unit,
            "total_price": round(total_material_cost, 2)
        }

    if total_cost > budget:
        return {"error": "Budget is not enough to cover the estimated total cost."}

    budget_status = f"Total Cost: ₱{total_cost:,.2f}. " \
                    f"Status: {'Exceeds Budget' if total_cost > budget else 'Within Budget'}."

    return {"materials": materials, "total_cost": round(total_cost, 2), "budget_status": budget_status}

def estimate_from_model_changes(base_materials, model_parts_changes, design_style="Modern"):
    """
    Update material estimates based on changes to the 3D model parts
    
    Parameters:
    - base_materials: dict - Current material quantities and prices
    - model_parts_changes: dict - Changes to model parts by material type
    - design_style: string - Modern, Classic, or Rustic
    
    Returns:
    - Updated materials dictionary
    """
    if design_style not in material_costs:
        return {"error": "Invalid design style. Choose from Modern, Classic, or Rustic."}
        
    # Create a deep copy to avoid modifying the original
    materials = {k: dict(v) for k, v in base_materials.items()}
    
    # Track total cost changes
    total_cost = 0
    
    # Apply changes from model parts
    for material_type, changes in model_parts_changes.items():
        if material_type in materials:
            # Calculate net change as a factor (added - removed)
            # Added parts increase quantities, removed parts decrease quantities
            net_change = changes.get("added", 0) - changes.get("removed", 0)
            
            # Apply a scaling factor to the impact (adjust as needed for realism)
            impact_factor = 0.05  # 5% change per component added/removed
            
            # Calculate the change factor (e.g., +0.15 for 3 added components)
            change_factor = 1 + (net_change * impact_factor)
            
            # Don't allow negative quantities
            change_factor = max(0.1, change_factor)
            
            # Update the quantity
            original_quantity = materials[material_type]["quantity"]
            new_quantity = original_quantity * change_factor
            materials[material_type]["quantity"] = round(new_quantity, 2)
            
            # Update total price
            unit_price = materials[material_type]["unit_price"]
            materials[material_type]["total_price"] = round(new_quantity * unit_price, 2)
        
    # Recalculate total cost
    for material_data in materials.values():
        total_cost += material_data["total_price"]
    
    return materials, round(total_cost, 2)
