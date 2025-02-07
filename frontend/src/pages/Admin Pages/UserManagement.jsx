import { useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ]);

  const updateUser = (id) => {
    const updatedName = prompt("Enter the new user name:");
    const updatedEmail = prompt("Enter the new email:");
    if (updatedName && updatedEmail) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id
            ? { ...user, name: updatedName, email: updatedEmail }
            : user
        )
      );
    }
  };

  const deleteUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">User ID</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">User Name</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Email</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="w-1/4 py-3 px-4 text-center">{user.id}</td>
                <td className="w-1/4 py-3 px-4 text-center">{user.name}</td>
                <td className="w-1/4 py-3 px-4 text-center">{user.email}</td>
                <td className="w-1/4 py-3 px-2 text-center">
                  <button
                    className="mr-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => updateUser(user.id)}
                  >
                    Update
                  </button>
                  <button
                    className="mr-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
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