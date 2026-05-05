import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuPlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(response.data.users);
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
            onClick={() => navigate('/admin/create-user')}
          >
            <LuPlus className="text-lg" />
            Add User
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {users.map((user) => (
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
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;