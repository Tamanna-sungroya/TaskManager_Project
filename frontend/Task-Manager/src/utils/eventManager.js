// Event Manager for cross-component communication
class TaskEventManager {
  constructor() {
    this.listeners = new Map();
  }

  // Subscribe to task updates
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Unsubscribe from task updates
  unsubscribe(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit task update event
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }
}

// Create singleton instance
const taskEventManager = new TaskEventManager();

export const TASK_EVENTS = {
  TASK_UPDATED: 'task_updated',
  TASK_STATUS_CHANGED: 'task_status_changed',
  TASK_CREATED: 'task_created',
  TASK_DELETED: 'task_deleted'
};

export default taskEventManager;
