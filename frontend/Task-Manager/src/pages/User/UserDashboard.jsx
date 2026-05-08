import React, { useContext, useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import TaskListTable from '../../components/TaskListTable';
import { addThousandsSeparator } from '../../utils/helper';

const UserDashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load user dashboard data.');
      console.error('User dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = dashboardData?.statistics || dashboardData?.stats || {};
  const tasks = dashboardData?.recentTasks || dashboardData?.tasks || [];

  if (loading) return <DashboardLayout activeMenu="Dashboard"><div className="p-5">Loading user dashboard...</div></DashboardLayout>;
  if (error) return <DashboardLayout activeMenu="Dashboard"><div className="p-5 text-red-500">{error}</div></DashboardLayout>;

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <h2 className="text-2xl font-semibold">Welcome, {user?.name || 'User'}!</h2>
        <p className="text-sm text-gray-500 mt-1">Your task summary</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Total Tasks</p>
          <p className="text-xl font-bold">{addThousandsSeparator(stats.totalTasks || 0)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Pending Tasks</p>
          <p className="text-xl font-bold">{addThousandsSeparator(stats.pendingTasks || 0)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">In Progress</p>
          <p className="text-xl font-bold">{addThousandsSeparator(stats.inProgressTasks || 0)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-xl font-bold">{addThousandsSeparator(stats.completedTasks || 0)}</p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-lg font-medium">My Recent Tasks</h3>
        <TaskListTable tableData={tasks} />
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;