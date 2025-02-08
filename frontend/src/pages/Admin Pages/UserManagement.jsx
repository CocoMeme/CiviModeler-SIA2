import { useState, useEffect } from "react";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/all`, { withCredentials: true });
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">User Name</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Email</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Account Status</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="w-1/4 py-3 px-4 text-center">{user.name}</td>
                <td className="w-1/4 py-3 px-4 text-center">{user.email}</td>
                <td className="w-1/4 py-3 px-4 text-center">{user.isAccountVerified ? "Verified" : "Not Verified"}</td>
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