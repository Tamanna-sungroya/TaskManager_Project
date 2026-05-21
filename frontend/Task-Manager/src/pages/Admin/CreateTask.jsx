import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from 'react-icons/lu';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAttachmentsInput from '../../components/Inputs/AddAttachmentsInput';

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    getTaskDetailsByID();
  }, [taskId]);

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    //reset form
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  // Create Task
  const createTask = async () => {
    setLoading(true);

    try{
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Created Successfully");

      clearData();
    } catch(error){
      console.error("Error creating task:", error);
      setLoading(false);
    } finally{
      setLoading(false);
    }
  };

  // Update Task
  const updateTask = async () => {
    setLoading(true);

    try{
      const todolist = taskData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todolist,
      });

      toast.success("Task Updated Successfully");

      navigate("/admin/tasks");
    } catch(error){
      console.error("Error updating task:", error);
      setLoading(false);
    } finally{
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    //Input validation
    if(!taskData.title.trim()){
      setError("Title is required.");
      return;
    }

    if(!taskData.description.trim()){
      setError("Description is required.");
      return;
    }

    if(!taskData.dueDate){
      setError("Due date is required.");
      return;
    }

    if(taskData.assignedTo?.length === 0){
      setError("Task not assigned to any member");
      return;
    }

    if(taskData.todoChecklist?.length === 0){
      setError("Add atleast one todo task");
      return;
    }

    if(taskId){
      updateTask();
      return;
    }

    createTask();
  };

  // get Task info by ID
  const getTaskDetailsByID = async () => {
    if (!taskId) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      const task = response.data.task;

      setTaskData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: moment(task.dueDate).format("YYYY-MM-DD"),
        assignedTo: task.assignedTo,
        todoChecklist: task.todoChecklist.map(item => item.text),
        attachments: task.attachments || [],
      });

      setCurrentTask(task);
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Task
  const deleteTask = async () => {
    setLoading(true);
    setOpenDeleteAlert(false);

    try {
      const response = await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

      setShowDeleteSuccess(true);
    } catch (error) {
      console.error("Error deleting task:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccessOk = () => {
    setShowDeleteSuccess(false);
    navigate("/admin/tasks");
  };

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Delete
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Task Title
              </label>

              <input
              placeholder="Create App UI"
              className="form-input"
              value={taskData.title}
              onChange={({ target }) =>
                handleValueChange("title", target.value) 
              }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>

              <textarea
              placeholder="Describe task"
              className="form-input"
              rows={4}
              value={taskData.description}
              onChange={({ target }) => 
                handleValueChange("description", target.value)
              }
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </label>

                <SelectDropdown
                options={PRIORITY_DATA}
                value={taskData.priority}
                onChange={(value) => handleValueChange("priority", value)}
                placeholder="Select Priority" 
                />
              </div>

              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>

                <input 
                placeholder="Create App UI"
                className="form-input"
                value={taskData.dueDate || ""}
                onChange={({ target }) => 
                  handleValueChange("dueDate", target.value)
                }
                type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Assign To
                </label>

                <SelectUsers
                selectedUsers={taskData.assignedTo}
                setSelectedUsers={(value) => {
                  handleValueChange("assignedTo", value);
                }}
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                TODO Checklist
              </label>

              <TodoListInput
              todoList={taskData?.todoChecklist}
              setTodoList={(value) =>
                handleValueChange("todoChecklist", value)
              }
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Add Attachments
              </label>

              <AddAttachmentsInput
              attachments={taskData?.attachments}
              setAttachments={(value) => 
                handleValueChange("attachments", value)
              } 
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
              className="add-btn"
              onClick={handleSubmit}
              disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {openDeleteAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Task</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpenDeleteAlert(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={deleteTask}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Task Deleted Successfully</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">The task has been deleted successfully.</p>
            <div className="flex justify-end">
              <button
                onClick={handleDeleteSuccessOk}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default CreateTask