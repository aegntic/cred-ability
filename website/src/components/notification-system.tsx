import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import notificationService from '../services/notificationService';

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'dismiss';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  autoClose?: boolean;
  duration?: number;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    // Subscribe to notifications
    const unsubscribe = notificationService.addListener((notification) => {
      if (notification.type === 'dismiss' as any) {
        // Remove the notification
        setNotifications((prevNotifications) => 
          prevNotifications.filter((n) => n.id !== notification.id)
        );
      } else {
        // Add the notification
        setNotifications((prevNotifications) => [...prevNotifications, notification]);
      }
    });
    
    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Get icon based on notification type
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <Icon icon="heroicons:check-circle" className="w-6 h-6 text-green-400" />;
      case 'error':
        return <Icon icon="heroicons:x-circle" className="w-6 h-6 text-red-400" />;
      case 'warning':
        return <Icon icon="heroicons:exclamation-triangle" className="w-6 h-6 text-amber-400" />;
      case 'info':
      default:
        return <Icon icon="heroicons:information-circle" className="w-6 h-6 text-electric-blue" />;
    }
  };
  
  // Get background color based on notification type
  const getBackgroundColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30';
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/30';
      case 'info':
      default:
        return 'bg-electric-blue/10 border-electric-blue/30';
    }
  };
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`p-4 backdrop-blur-lg rounded-lg border shadow-lg ${getBackgroundColor(notification.type)} flex items-start`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1">
              {notification.title && (
                <h4 className="font-semibold text-white">{notification.title}</h4>
              )}
              <p className="text-white/80">{notification.message}</p>
            </div>
            <button
              className="ml-3 text-white/60 hover:text-white/90 transition-colors"
              onClick={() => notificationService.dismiss(notification.id)}
              aria-label="Close notification"
            >
              <Icon icon="heroicons:x-mark" className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
