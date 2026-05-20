import React, { useMemo } from "react";
import { DndContext, closestCenter, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const statuses = ["Pending", "In Progress", "Completed"];

const TaskItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="card p-4 cursor-grab hover:shadow-md transition-shadow">
      {/* Header with title and priority */}
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-sm text-gray-900 dark:text-white flex-1 pr-2">{task.title}</h4>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded whitespace-nowrap">
          {task.priority}
        </span>
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-900 dark:text-white mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {/* Assigned Users Section */}
      {task.assignedTo && task.assignedTo.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-gray-900 dark:text-white mb-2 font-medium">Assigned to:</div>
          <div className="flex flex-wrap gap-1">
            {task.assignedTo.slice(0, 4).map((user, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">
                <img
                  src={user.profileImageUrl || '/default-avatar.png'}
                  alt={user.name}
                  className="w-5 h-5 rounded-full border border-white shadow-sm"
                  title={user.name}
                />
                <span className="text-xs text-gray-700 truncate max-w-[80px]">{user.name}</span>
              </div>
            ))}
            {task.assignedTo.length > 4 && (
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 border border-white text-xs font-medium">
                +{task.assignedTo.length - 4}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Bottom Section with Attachments and Progress */}
      <div className="flex justify-between items-center gap-3">
        {task.attachments && task.attachments.length > 0 && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 00-.586.586l1.414 1.414a2 2 0 00.586.586L15.172 17M5 12a2 2 0 110-4 0 4 0 110-4 0z" />
            </svg>
            <span className="text-xs text-gray-600 font-medium">{task.attachments.length}</span>
          </div>
        )}
        
        {task.todoChecklist && task.todoChecklist.length > 0 && (
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">
              {task.completedTodoCount || 0}/{task.todoChecklist.length}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((task.completedTodoCount || 0) / task.todoChecklist.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Column = ({ status, children }) => {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} id={status} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 min-h-[60vh]">
      <h4 className="font-semibold mb-3">{status}</h4>
      {children}
    </div>
  );
};

const KanbanBoard = ({ tasks, onMove }) => {
  const grouped = useMemo(
    () =>
      statuses.reduce((acc, s) => {
        acc[s] = tasks.filter((t) => t.status === s);
        return acc;
      }, {}),
    [tasks]
  );

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;
    const targetStatus = over.id;
    if (!statuses.includes(targetStatus)) return;
    onMove(active.id, targetStatus);
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[70vh]">
        {statuses.map((status) => (
          <Column key={status} status={status}>
            <SortableContext items={grouped[status].map((t) => t._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {grouped[status].map((task) => (
                  <TaskItem key={task._id} task={task} />
                ))}
              </div>
            </SortableContext>
          </Column>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
