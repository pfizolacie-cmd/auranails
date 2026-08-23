/**
 * AURA NAILS — Notifications System
 * Push + In-App Notifications Manager
 * 
 * Features:
 * - Push notifications (24h reminders, confirmations, alerts)
 * - In-app notification center
 * - Persistent storage (Firestore)
 * - Real-time sync with Firestore listeners
 */

class NotificationManager {
  constructor(db, auth, userId) {
    this.db = db;
    this.auth = auth;
    this.userId = userId;
    this.notifications = [];
    this.listeners = [];
  }

  /**
   * Initialize notifications listener
   */
  setupListener() {
    if (!this.userId) return;

    const unsub = this.db
      .collection('notifications')
      .where('userId', '==', this.userId)
      .limit(50)
      .onSnapshot((snap) => {
        this.notifications = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => {
          const at = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const bt = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return bt - at;
        });
        this.notifyListeners();
      });

    this.listeners.push(unsub);
  }

  /**
   * Subscribe to notification changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Notify all subscribers
   */
  notifyListeners() {
    this.listeners.forEach((callback) => {
      if (typeof callback === 'function') callback(this.notifications);
    });
  }

  /**
   * Send confirmation notification
   * Type: appointment_confirmed
   */
  async sendConfirmationNotification(appointment) {
    const notif = {
      userId: this.userId,
      type: 'appointment_confirmed',
      title: '✅ Termín potvrdený',
      message: `Tvoj termín ${appointment.service} je potvrdený na ${this.formatDate(appointment.date)} o ${appointment.time}.`,
      appointmentId: appointment.id,
      appointmentData: appointment,
      read: false,
      createdAt: new Date(),
      action: 'view_appointment',
      actionTarget: appointment.id,
    };

    await this.db.collection('notifications').add(notif);
    await this.sendPushNotification(
      '✅ Termín potvrdený',
      notif.message,
      { appointmentId: appointment.id }
    );
  }

  /**
   * Send 24h reminder notification
   * Type: appointment_reminder
   */
  async sendReminderNotification(appointment) {
    const notif = {
      userId: this.userId,
      type: 'appointment_reminder',
      title: '📅 Termín zajtra',
      message: `Nezabudni na termín ${appointment.service} zajtra o ${appointment.time}`,
      appointmentId: appointment.id,
      appointmentData: appointment,
      read: false,
      createdAt: new Date(),
      action: 'view_appointment',
      actionTarget: appointment.id,
    };

    await this.db.collection('notifications').add(notif);
    await this.sendPushNotification(
      '📅 Termín zajtra',
      notif.message,
      { appointmentId: appointment.id }
    );
  }

  /**
   * Send price change notification
   * Type: pricing_updated
   */
  async sendPriceChangeNotification(changes) {
    const notif = {
      userId: this.userId,
      type: 'pricing_updated',
      title: '💰 Cenník sa zmenil',
      message: `Zmenili sme ceny našich služieb. Pozri nové ceny v appke.`,
      read: false,
      createdAt: new Date(),
      action: 'view_pricing',
      changes,
    };

    await this.db.collection('notifications').add(notif);
    await this.sendPushNotification(
      '💰 Cenník aktualizovaný',
      notif.message
    );
  }

  /**
   * Send cancellation notification
   * Type: appointment_cancelled
   */
  async sendCancellationNotification(appointment, reason = '') {
    const notif = {
      userId: this.userId,
      type: 'appointment_cancelled',
      title: '⚠️ Termín bol zrušený',
      message: `Tvoj termín ${appointment.service} na ${this.formatDate(appointment.date)} bol zrušený. ${reason || 'Rezervuj si nový.'}`,
      appointmentId: appointment.id,
      read: false,
      createdAt: new Date(),
      action: 'new_appointment',
    };

    await this.db.collection('notifications').add(notif);
    await this.sendPushNotification(
      '⚠️ Termín bol zrušený',
      notif.message
    );
  }

  /**
   * Send Aura Pass notification
   * Type: aura_pass_milestone
   */
  async sendAuraPassNotification(stamps, totalStamps = 5) {
    const milestone = stamps >= totalStamps ? 'Máš plný Aura Pass!' : `Už máš ${stamps}/${totalStamps} pečiatok.`;
    const notif = {
      userId: this.userId,
      type: 'aura_pass_milestone',
      title: '⭐ Aura Pass progres',
      message: milestone,
      read: false,
      createdAt: new Date(),
      stamps,
      totalStamps,
      action: stamps >= totalStamps ? 'view_aura_pass' : null,
    };

    await this.db.collection('notifications').add(notif);
    if (stamps >= totalStamps) {
      await this.sendPushNotification(
        '🎉 Gratulujeme!',
        'Nazbierala si plný Aura Pass! Máš zľavu na ďalší termín.'
      );
    }
  }

  /**
   * Send custom notification
   */
  async sendCustomNotification(title, message, type = 'info', options = {}) {
    const notif = {
      userId: this.userId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date(),
      ...options,
    };

    await this.db.collection('notifications').add(notif);
    await this.sendPushNotification(title, message);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    await this.db
      .collection('notifications')
      .doc(notificationId)
      .update({ read: true });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    const unread = this.notifications.filter((n) => !n.read);
    const batch = this.db.batch();
    unread.forEach((n) => {
      batch.update(
        this.db.collection('notifications').doc(n.id),
        { read: true }
      );
    });
    await batch.commit();
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId) {
    await this.db
      .collection('notifications')
      .doc(notificationId)
      .delete();
  }

  /**
   * Get unread count
   */
  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  /**
   * Send push notification (Web Push API)
   */
  async sendPushNotification(title, message, data = {}) {
    // Check if browser supports notifications
    if (!('Notification' in window)) return;

    // Request permission if not already granted
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      await Notification.requestPermission();
    }

    if (Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification(title, {
            body: message,
            icon: '/icons/aura-192.png',
            badge: '/icons/aura-badge-72.png',
            tag: data.appointmentId || 'aura-notif',
            requireInteraction: false,
            data,
            actions: [
              { action: 'open', title: 'Otvoriť' },
              { action: 'close', title: 'Zavrieť' },
            ],
          });
        }
      } catch (error) {
        console.error('[Push] Error:', error);
      }
    }
  }

  /**
   * Format date in Slovak
   */
  formatDate(iso) {
    const SK_DOW = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
    const SK_MON = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
    
    const [y, m, d] = iso.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dow = SK_DOW[date.getDay()];
    const mon = SK_MON[m - 1];
    
    return `${dow} ${d}. ${mon}`;
  }

  /**
   * Cleanup: Remove all listeners
   */
  cleanup() {
    this.listeners.forEach((unsub) => {
      if (typeof unsub === 'function') unsub();
    });
    this.listeners = [];
  }
}

/**
 * React Hook: useNotifications
 * Usage: const { notifications, unreadCount } = useNotifications();
 */
function useNotifications(db, auth, userId) {
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const managerRef = React.useRef(null);

  React.useEffect(() => {
    if (!userId || !db) return;

    // Initialize manager
    const manager = new NotificationManager(db, auth, userId);
    managerRef.current = manager;

    // Subscribe to changes
    manager.subscribe((notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    });

    // Setup listener
    manager.setupListener();

    return () => {
      manager.cleanup();
    };
  }, [userId, db, auth]);

  return {
    notifications,
    unreadCount,
    manager: managerRef.current,
  };
}

/**
 * Notification UI Component
 */
function NotificationItem({ notif, onMarkRead, onDelete }) {
  const getTypeIcon = (type) => {
    const icons = {
      appointment_confirmed: '✅',
      appointment_reminder: '📅',
      appointment_cancelled: '⚠️',
      pricing_updated: '💰',
      aura_pass_milestone: '⭐',
      info: 'ℹ️',
    };
    return icons[type] || '🔔';
  };

  const getTypeClass = (type) => {
    const classes = {
      appointment_confirmed: 'success',
      appointment_reminder: 'info',
      appointment_cancelled: 'warning',
      pricing_updated: 'info',
      aura_pass_milestone: 'success',
      info: 'info',
    };
    return classes[type] || 'info';
  };

  return (
    <div
      className={`notification notification-${getTypeClass(notif.type)} ${notif.read ? 'read' : 'unread'}`}
      style={{
        opacity: notif.read ? 0.6 : 1,
      }}
    >
      <div className="notification-icon">{getTypeIcon(notif.type)}</div>
      <div className="notification-content">
        <div className="notification-title">{notif.title}</div>
        <div className="notification-text">{notif.message}</div>
        <div style={{ marginTop: 8, fontSize: '11px', color: 'currentColor', opacity: 0.6 }}>
          {formatTimeAgo(notif.createdAt)}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '6px',
          flexShrink: 0,
          alignItems: 'center',
        }}
      >
        {!notif.read && (
          <button
            onClick={() => onMarkRead(notif.id)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '12px',
              opacity: 0.6,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '1')}
            onMouseLeave={(e) => (e.target.style.opacity = '0.6')}
          >
            ✓
          </button>
        )}
        <button
          onClick={() => onDelete(notif.id)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '14px',
            opacity: 0.4,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.target.style.opacity = '0.4')}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Notification Center Modal
 */
function NotificationCenter({ isOpen, onClose, notifications = [], onMarkRead, onDelete, onMarkAllRead }) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>
            🔔 Notifikácie {unreadCount > 0 && `(${unreadCount})`}
          </h2>
          <button
            onClick={onClose}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: '20px',
              opacity: 0.5,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '1')}
            onMouseLeave={(e) => (e.target.style.opacity = '0.5')}
          >
            ✕
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#9d8b7e',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 12,
              fontWeight: 500,
            }}
          >
            Označiť všetky ako prečítané
          </button>
        )}

        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9d8b7e', padding: '40px 20px' }}>
              Žiadne notifikácie
            </p>
          ) : (
            notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notif={notif}
                onMarkRead={onMarkRead}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Helper: Format time ago
 */
function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Práve teraz';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString('sk-SK');
}

// Export for use in app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NotificationManager,
    useNotifications,
    NotificationItem,
    NotificationCenter,
  };
}
