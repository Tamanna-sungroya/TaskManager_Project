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
import { IoChatbubbleEllipses } from 'react-icons/io5';
import taskEventManager, { TASK_EVENTS } from '../../utils/eventManager';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hi, I am Forge AI. Ask me to plan your day." }
  ]);
  const [chatQuery, setChatQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
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
      // Emit event for cross-component synchronization
      taskEventManager.emit(TASK_EVENTS.TASK_STATUS_CHANGED, { taskId, status });
      // Refresh tasks to ensure all components have latest data
      fetchTasks();
    } catch (e) {
      setTasks(previous);
      toast.error('Could not move task');
    }
  };

  const handleChatSend = async () => {
    if (!chatQuery.trim()) return;
    
    const userMessage = { role: "user", text: chatQuery };
    setChatMessages((m) => [...m, userMessage]);
    setChatQuery("");
    setChatLoading(true);
    
    try {
      const response = await axiosInstance.post(API_PATHS.AI.ASK, { query: userMessage.text });
      const aiText = response.data?.data?.advice || response.data?.data?.response || "Could not generate advice right now.";
      const assistantMessage = { role: "assistant", text: aiText };
      setChatMessages((m) => [...m, assistantMessage]);
    } catch (error) {
      setChatMessages((m) => [...m, { role: "assistant", text: "Could not generate advice right now." }]);
    } finally {
      setChatLoading(false);
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

        {/* Full Kanban Board as main view */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Kanban Board</h3>
          <KanbanBoard tasks={tasks} onMove={handleKanbanMove} />
        </div>

        {/* Floating Chat Icon */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Toggle Chat"
        >
          <IoChatbubbleEllipses size={24} />
        </button>

        {/* Chat Assistant - Conditionally Rendered */}
        {showChat && (
          <div className="fixed bottom-20 right-6 z-40 w-80 max-h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Forge AI Assistant</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-auto mb-3">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className={`p-2 rounded ${m.role === "assistant" ? "bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-gray-100" : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  value={chatQuery}
                  onChange={(e) => setChatQuery(e.target.value)}
                  placeholder="What should I do now?" 
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSend();
                    }
                  }}
                />
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" 
                  onClick={handleChatSend}
                  disabled={chatLoading}
                >
                  {chatLoading ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;