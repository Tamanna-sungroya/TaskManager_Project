import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import TaskCard from '../../components/Cards/TaskCard';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
        setTask(response.data?.task || response.data);
      } catch (err) {
        console.error('Failed to load task details', err);
        setError('Unable to load task details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  return (
    <DashboardLayout activeMenu="Task Details">
      <div className="my-5">
        <button
          onClick={() => navigate('/user/tasks')}
          className="mb-4 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm"
        >
          Back to My Tasks
        </button>

        {loading && <div className="p-4">Loading task details...</div>}
        {error && <div className="p-4 text-red-500">{error}</div>}

        {!loading && !error && task && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Task Details</h2>
            <TaskCard
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
              onClick={() => {}}
            />

            <div className="mt-4 bg-white p-4 rounded shadow border border-gray-200">
              <p className="text-sm text-gray-500">Description</p>
              <p className="mt-1 text-gray-700">{task.description || 'No description provided.'}</p>
              <p className="mt-3 text-sm text-gray-500">Created By</p>
              <p className="mt-1 text-gray-700">{task.createdBy?.name || task.createdBy || 'N/A'}</p>
            </div>
          </div>
        )}

        {!loading && !error && !task && (
          <div className="p-4 text-gray-500">No task details available.</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;