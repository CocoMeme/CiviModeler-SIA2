# Updated Material costs per unit (in PHP) based on real SRP in the Philippines
material_costs = {
    "Modern": {
        "Cement": 259,  # per 40kg bag
        "Sand": 1435,  # per cubic meter
        "Gravel": 1310,  # per cubic meter
        "Bricks": 12,  # per piece (4" CHB)
        "Steel": 156,  # per 6m (10mm rebar)
        "Wood": 656,  # per sheet (1/2" plywood)
        "Tiles": 300,  # estimated per sqm
        "Paint": 640,  # per gallon
        "Roofing": 400  # per piece (G.I. sheet)
    },
    "Classic": {
        "Cement": 259, "Sand": 1435, "Gravel": 1310, "Bricks": 12, 
        "Steel": 156, "Wood": 656, "Tiles": 350, "Paint": 640, "Roofing": 450
    },
    "Rustic": {
        "Cement": 259, "Sand": 1435, "Gravel": 1310, "Bricks": 12, 
        "Steel": 156, "Wood": 656, "Tiles": 400, "Paint": 640, "Roofing": 500
    }
}

# Material quantities per sqm based on design style
material_quantities = {
    "Modern": {
        "Cement": 3, "Sand": 0.14, "Gravel": 0.14, "Bricks": 55, 
        "Steel": 12, "Wood": 3, "Tiles": 1.5, "Paint": 0.6, "Roofing": 1
    },
    "Classic": {
        "Cement": 2.8, "Sand": 0.13, "Gravel": 0.13, "Bricks": 50, 
        "Steel": 10, "Wood": 4, "Tiles": 1.7, "Paint": 0.5, "Roofing": 1
    },
    "Rustic": {
        "Cement": 2.5, "Sand": 0.12, "Gravel": 0.12, "Bricks": 60, 
        "Steel": 9, "Wood": 6, "Tiles": 2, "Paint": 0.7, "Roofing": 1
    }
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
