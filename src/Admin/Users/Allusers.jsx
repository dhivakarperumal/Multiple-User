import React, { useEffect, useState } from "react";
import { db } from "../../Componets/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Fetch all users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "users", id));
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Open popup for view/edit
  const openPopup = (user, editMode = false) => {
    setSelectedUser({ ...user });
    setIsEdit(editMode);
  };

  // Close popup
  const closePopup = () => {
    setSelectedUser(null);
    setIsEdit(false);
  };

  // Handle edit field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));
  };

  // Save user changes
  const handleSave = async () => {
    if (!selectedUser.id) return;
    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, {
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
      });
      toast.success("User updated successfully");
      fetchUsers();
      closePopup();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Users</h2>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="py-3 px-4 ">Name</th>
                <th className="py-3 px-4 ">Email</th>
                <th className="py-3 px-4 ">Phone</th>
                <th className="py-3 px-4 ">Role</th>
                <th className="py-3 px-4  text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 ">{user.name || "N/A"}</td>
                  <td className="py-4 px-4 ">{user.email || "N/A"}</td>
                  <td className="py-4 px-4 ">{user.phone || "N/A"}</td>
                  <td className="py-4 px-4 ">{user.role || "Customer"}</td>
                  <td className="py-4 px-4  text-center flex justify-center gap-3">
                    <button
                      onClick={() => openPopup(user, false)}
                      className="text-blue-500 hover:text-blue-700"
                      title="View User"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => openPopup(user, true)}
                      className="text-green-500 hover:text-green-700"
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative">
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={18} />
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {isEdit ? "Edit User" : "View User"}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedUser.name || ""}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email || ""}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={selectedUser.phone || ""}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  name="role"
                  value={selectedUser.role || "Customer"}
                  onChange={handleChange}
                  disabled={!isEdit}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
                >
                  <option value="user">User</option>
                  <option value="dealer">Dealer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {isEdit && (
              <button
                onClick={handleSave}
                className="mt-5 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
