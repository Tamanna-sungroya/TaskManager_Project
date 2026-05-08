import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Manage Users">
      <div className="my-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Manage Users</h2>
          <button 
            className="add-btn"
            onClick={async () => {
              const name = prompt('Name');
              const email = prompt('Email');
              if (!name || !email) return;
              await axiosInstance.post(API_PATHS.USERS.CREATE_USER, { name, email, password: "Password@123" });
              toast.success("User created");
              getAllUsers();
            }}
          >
            <LuPlus className="text-lg" />
            Add User
          </button>
        </div>

        <div className="mt-4">
          <input
            className="form-input"
            placeholder="Search users by name/email"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {users
            .filter((u) => [u.name, u.email].join(' ').toLowerCase().includes(query.toLowerCase()))
            .slice((page - 1) * pageSize, page * pageSize)
            .map((user) => (
            <div key={user._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <img 
                  src={user.profileImageUrl || '/default-avatar.png'} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="card-btn"
                  onClick={async () => {
                    const name = prompt('Update name', user.name);
                    if (!name) return;
                    await axiosInstance.put(API_PATHS.USERS.UPDATE_USER(user._id), { name });
                    toast.success("User updated");
                    getAllUsers();
                  }}
                >
                  Update
                </button>
                <button
                  className="card-btn"
                  onClick={async () => {
                    if (!confirm('Delete this user?')) return;
                    await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(user._id));
                    toast.success("User deleted");
                    getAllUsers();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button className="card-btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <span className="text-sm">Page {page}</span>
          <button className="card-btn" onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;