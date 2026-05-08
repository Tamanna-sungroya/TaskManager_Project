import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TaskCard from '../../components/Cards/TaskCard';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import KanbanBoard from '../../components/KanbanBoard';
import ForgeAssistant from '../../components/ForgeAssistant';
import toast from 'react-hot-toast';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === 'All' ? '' : filterStatus,
        },
      });

      const items = response.data?.tasks || [];
      setTasks(items);

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: 'All', count: statusSummary.all || items.length },
        { label: 'Pending', count: statusSummary.pendingTasks || 0 },
        { label: 'In Progress', count: statusSummary.inProgressTasks || 0 },
        { label: 'Completed', count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (err) {
      console.error('Failed to load tasks', err);
      setError('Unable to load tasks. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filterStatus]);

  const handleTaskClick = (task) => {
    navigate(`/user/task-details/${task._id}`);
  };

  const handleKanbanMove = async (taskId, status) => {
    const previous = tasks;
    const next = tasks.map((t) => (t._id === taskId ? { ...t, status } : t));
    setTasks(next);
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_STATUS(taskId), { status });
      toast.success('Task status updated');
    } catch (e) {
      setTasks(previous);
      toast.error('Could not move task');
    }
  };

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
          {tabs?.length > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        {loading && <div className="p-4">Loading tasks...</div>}
        {error && <div className="p-4 text-red-500">{error}</div>}
        {!loading && !error && tasks.length === 0 && (
          <div className="p-4 text-gray-500">No tasks found. Please check back later.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              status={task.status}
              progress={task.progress}
              createdAt={task.createdAt}
              dueDate={task.dueDate}
              assignedTo={task.assignedTo?.map((user) => user.profileImageUrl)}
              attachmentCount={task.attachments?.length || 0}
              completedTodoCount={task.completedTodoCount || 0}
              todoChecklist={task.todoChecklist || []}
              onClick={() => handleTaskClick(task)}
            />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Kanban Board</h3>
          <KanbanBoard tasks={tasks} onMove={handleKanbanMove} />
        </div>

        <ForgeAssistant />
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;