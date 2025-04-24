/**
 * Notification service for CRED-ABILITY
 * Handles system notifications, alerts, and user communications
 */

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  autoClose?: boolean;
  duration?: number;
}

class NotificationService {
  private static instance: NotificationService;
  private listeners: Array<(notification: Notification) => void> = [];
  private notifications: Notification[] = [];
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  
  // Add a notification listener
  public addListener(listener: (notification: Notification) => void): () => void {
    this.listeners.push(listener);
    
    // Return a function to remove this listener
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Show a notification
  public show(
    message: string, 
    type: NotificationType = 'info', 
    title?: string,
    autoClose: boolean = true,
    duration: number = 5000
  ): string {
    const id = this.generateId();
    
    const notification: Notification = {
      id,
      type,
      message,
      title,
      autoClose,
      duration
    };
    
    this.notifications.push(notification);
    this.notifyListeners(notification);
    
    // Auto-close if specified
    if (autoClose) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
    
    return id;
  }
  
  // Show a success notification
  public success(message: string, title?: string, autoClose: boolean = true): string {
    return this.show(message, 'success', title, autoClose);
  }
  
  // Show an error notification
  public error(message: string, title?: string, autoClose: boolean = true): string {
    return this.show(message, 'error', title, autoClose);
  }
  
  // Show a warning notification
  public warning(message: string, title?: string, autoClose: boolean = true): string {
    return this.show(message, 'warning', title, autoClose);
  }
  
  // Show an info notification
  public info(message: string, title?: string, autoClose: boolean = true): string {
    return this.show(message, 'info', title, autoClose);
  }
  
  // Dismiss a notification
  public dismiss(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      this.notifications = this.notifications.filter(n => n.id !== id);
      
      // Notify listeners of removal
      this.listeners.forEach(listener => {
        listener({
          ...notification,
          type: 'dismiss' as any
        });
      });
    }
  }
  
  // Dismiss all notifications
  public dismissAll(): void {
    this.notifications.forEach(notification => {
      this.dismiss(notification.id);
    });
  }
  
  // Get all active notifications
  public getAll(): Notification[] {
    return [...this.notifications];
  }
  
  // Private helper to generate unique IDs
  private generateId(): string {
    return `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  
  // Private helper to notify all listeners
  private notifyListeners(notification: Notification): void {
    this.listeners.forEach(listener => {
      listener(notification);
    });
  }
}

// Export a singleton instance
export default NotificationService.getInstance();
