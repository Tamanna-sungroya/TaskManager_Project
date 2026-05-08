import React, { useMemo } from "react";
import { DndContext, closestCenter, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const statuses = ["Pending", "In Progress", "Completed"];

const TaskItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="card p-3 cursor-grab">
      <p className="font-medium text-sm">{task.title}</p>
      <p className="text-xs text-gray-500">{task.priority}</p>
    </div>
  );
};

const Column = ({ status, children }) => {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} id={status} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 min-h-40">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
