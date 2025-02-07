import { useState } from "react";

export default function ProjectManagement() {
  const [projects, setProjects] = useState([
    { id: 1, name: "Project Alpha", budget: 100000 },
    { id: 2, name: "Project Beta", budget: 50000 },
    { id: 3, name: "Project Gamma", budget: 75000 },
  ]);

  const updateProject = (id) => {
    const updatedName = prompt("Enter the new project name:");
    const updatedBudget = prompt("Enter the new budget:");
    if (updatedName && updatedBudget) {
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id
            ? { ...project, name: updatedName, budget: Number(updatedBudget) }
            : project
        )
      );
    }
  };

  const deleteProject = (id) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
  };

  const view3D = (id) => {
    const url = `/admin/project-management/${id}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Project Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Project ID</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Project Name</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Budget</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-gray-700">
                <td className="w-1/4 py-3 px-4 text-center">{project.id}</td>
                <td className="w-1/4 py-3 px-4 text-center">{project.name}</td>
                <td className="w-1/4 py-3 px-4 text-center">${project.budget.toLocaleString()}</td>
                <td className="w-1/4 py-3 px-2 text-center">
                  <button
                    className="mr-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => updateProject(project.id)}
                  >
                    Update
                  </button>
                  <button
                    className="mr-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => view3D(project.id)}
                  >
                    View 3D
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}