import { useState, useEffect } from "react";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setAction(user.isAccountVerified ? "verify" : "not verify");
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const updateUser = async (id) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/update/${id}`, {
        name: selectedUser.name,
        email: selectedUser.email,
        isAccountVerified: action === 'verify'
      }, { withCredentials: true });

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id
              ? { ...user, name: selectedUser.name, email: selectedUser.email, isAccountVerified: action === 'verify' }
              : user
          )
        );
        setSelectedUser(null);
        setAction("");
        setIsUpdateModalOpen(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${id}`, { withCredentials: true });

      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        setSelectedUser(null);
        setIsDeleteModalOpen(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
      <div className="overflow-x-auto">
      <table className="min-w-full table-fixed bg-gray-800 shadow-md rounded-lg overflow-hidden">
  <thead className="bg-white text-black">
    <tr>
      <th className="w-1/4 py-4 px-6 uppercase font-semibold text-sm text-center">User Name</th>
      <th className="w-1/4 py-4 px-6 uppercase font-semibold text-sm text-center">Email</th>
      <th className="w-1/4 py-4 px-6 uppercase font-semibold text-sm text-center">Account Status</th>
      <th className="w-1/4 py-4 px-6 uppercase font-semibold text-sm text-center">Actions</th>
    </tr>
  </thead>
  <tbody className="text-gray-300">
    {users.map((user) => (
      <tr key={user._id} className="border-b border-gray-700">
        <td className="w-1/4 py-4 px-6 text-center">{user.name}</td>
        <td className="w-1/4 py-4 px-6 text-center">{user.email}</td>
        <td className="w-1/4 py-4 px-6 text-center">
          {user.isAccountVerified ? "Verified" : "Not Verified"}
        </td>
        <td className="w-1/4 py-4 px-6 text-center">
          <button
            className="mr-2 bg-blue-500 text-white px-5 py-3 text-lg rounded-lg hover:bg-blue-700"
            onClick={() => handleUpdateClick(user)}
          >
            Update
          </button>
          <button
            className="bg-red-500 text-white px-5 py-3 text-lg rounded-lg hover:bg-red-700"
            onClick={() => handleDeleteClick(user)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {isUpdateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-2xkl w-1/3 shadow-lg">
          <h2 className="text-4xl font-bold mb-6 text-center text-black">Update User</h2>
          <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">User Name</label>
              <input
                type="text"
                name="name"
                value={selectedUser.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={selectedUser.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Account Status</label>
              <select
                name="isAccountVerified"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="verify">Verify</option>
                <option value="not verify">Not Verify</option>
              </select>
            </div>
            <div className="mt-4">
              <button
                className="mr-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => updateUser(selectedUser._id)}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-2xl w-1/3 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-black text-center">Delete User</h2>
          <p className="text-lg text-black text-center">Are you sure you want to delete this user?</p>
          <div className="mt-6 flex justify-center space-x-4">
              <button
                className="mr-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => deleteUser(selectedUser._id)}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}