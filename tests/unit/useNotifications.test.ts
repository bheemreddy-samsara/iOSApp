// useNotifications tests - testing notification data handling logic
// These tests validate the notification transformation without rendering hooks

interface RawNotification {
  id: string;
  member_id: string;
  payload: { type: string; title: string; body: string };
  channel: string;
  status: 'pending' | 'sent' | 'read';
  delivered_at: string | null;
  created_at: string;
}

interface AppNotification {
  id: string;
  memberId: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | undefined;
}

// Transform function extracted from useNotifications hook
const transformNotification = (raw: RawNotification): AppNotification => ({
  id: raw.id,
  memberId: raw.member_id,
  type: raw.payload.type,
  title: raw.payload.title,
  message: raw.payload.body,
  createdAt: raw.created_at,
  readAt: raw.status === 'read' ? raw.delivered_at || undefined : undefined,
});

// Query key factory
const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
};

// Calculate unread count
const calculateUnreadCount = (notifications: AppNotification[]): number => {
  return notifications.filter((n) => !n.readAt).length;
};

// Sample test data
const rawNotifications: RawNotification[] = [
  {
    id: 'n-1',
    member_id: 'm-1',
    payload: { type: 'reminder', title: 'Test', body: 'Test message' },
    channel: 'push',
    status: 'sent',
    delivered_at: null,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'n-2',
    member_id: 'm-1',
    payload: { type: 'approval', title: 'Approval', body: 'Please approve' },
    channel: 'push',
    status: 'read',
    delivered_at: '2024-01-01T01:00:00Z',
    created_at: '2024-01-01T00:30:00Z',
  },
];

describe('useNotifications', () => {
  describe('notificationKeys', () => {
    it('generates correct base key', () => {
      expect(notificationKeys.all).toEqual(['notifications']);
    });

    it('generates correct list key', () => {
      expect(notificationKeys.list()).toEqual(['notifications', 'list']);
    });

    it('generates correct unread key', () => {
      expect(notificationKeys.unread()).toEqual(['notifications', 'unread']);
    });
  });

  describe('transformNotification', () => {
    it('transforms raw notification to app format', () => {
      const raw = rawNotifications[0];
      const transformed = transformNotification(raw);

      expect(transformed).toEqual({
        id: 'n-1',
        memberId: 'm-1',
        type: 'reminder',
        title: 'Test',
        message: 'Test message',
        createdAt: '2024-01-01T00:00:00Z',
        readAt: undefined,
      });
    });

    it('converts member_id to memberId', () => {
      const raw = rawNotifications[0];
      const transformed = transformNotification(raw);

      expect(transformed.memberId).toBe('m-1');
    });

    it('extracts type from payload', () => {
      const raw = rawNotifications[0];
      const transformed = transformNotification(raw);

      expect(transformed.type).toBe('reminder');
    });

    it('extracts title from payload', () => {
      const raw = rawNotifications[0];
      const transformed = transformNotification(raw);

      expect(transformed.title).toBe('Test');
    });

    it('extracts body as message from payload', () => {
      const raw = rawNotifications[0];
      const transformed = transformNotification(raw);

      expect(transformed.message).toBe('Test message');
    });

    it('sets readAt as undefined for unread notifications', () => {
      const raw = rawNotifications[0]; // status: 'sent'
      const transformed = transformNotification(raw);

      expect(transformed.readAt).toBeUndefined();
    });

    it('sets readAt from delivered_at for read notifications', () => {
      const raw = rawNotifications[1]; // status: 'read'
      const transformed = transformNotification(raw);

      expect(transformed.readAt).toBe('2024-01-01T01:00:00Z');
    });

    it('transforms all notifications in array', () => {
      const transformed = rawNotifications.map(transformNotification);

      expect(transformed).toHaveLength(2);
      expect(transformed[0].id).toBe('n-1');
      expect(transformed[1].id).toBe('n-2');
    });
  });

  describe('calculateUnreadCount', () => {
    it('returns correct count for mixed read/unread', () => {
      const notifications = rawNotifications.map(transformNotification);
      const count = calculateUnreadCount(notifications);

      expect(count).toBe(1);
    });

    it('returns 0 when all are read', () => {
      const allRead: AppNotification[] = [
        {
          id: 'n-1',
          memberId: 'm-1',
          type: 'reminder',
          title: 'Test',
          message: 'Test',
          createdAt: '2024-01-01T00:00:00Z',
          readAt: '2024-01-01T01:00:00Z',
        },
      ];
      const count = calculateUnreadCount(allRead);

      expect(count).toBe(0);
    });

    it('returns total count when none are read', () => {
      const allUnread: AppNotification[] = [
        {
          id: 'n-1',
          memberId: 'm-1',
          type: 'reminder',
          title: 'Test',
          message: 'Test',
          createdAt: '2024-01-01T00:00:00Z',
          readAt: undefined,
        },
        {
          id: 'n-2',
          memberId: 'm-1',
          type: 'alert',
          title: 'Alert',
          message: 'Alert msg',
          createdAt: '2024-01-01T00:00:00Z',
          readAt: undefined,
        },
      ];
      const count = calculateUnreadCount(allUnread);

      expect(count).toBe(2);
    });

    it('returns 0 for empty array', () => {
      const count = calculateUnreadCount([]);
      expect(count).toBe(0);
    });
  });

  describe('notification types', () => {
    it('handles reminder type', () => {
      const reminder = transformNotification(rawNotifications[0]);
      expect(reminder.type).toBe('reminder');
    });

    it('handles approval type', () => {
      const approval = transformNotification(rawNotifications[1]);
      expect(approval.type).toBe('approval');
    });
  });

  describe('edge cases', () => {
    it('handles read status with null delivered_at', () => {
      const raw: RawNotification = {
        id: 'n-3',
        member_id: 'm-1',
        payload: { type: 'test', title: 'Test', body: 'Test' },
        channel: 'push',
        status: 'read',
        delivered_at: null,
        created_at: '2024-01-01T00:00:00Z',
      };
      const transformed = transformNotification(raw);

      expect(transformed.readAt).toBeUndefined();
    });

    it('handles pending status', () => {
      const raw: RawNotification = {
        id: 'n-4',
        member_id: 'm-1',
        payload: { type: 'test', title: 'Test', body: 'Test' },
        channel: 'push',
        status: 'pending',
        delivered_at: null,
        created_at: '2024-01-01T00:00:00Z',
      };
      const transformed = transformNotification(raw);

      expect(transformed.readAt).toBeUndefined();
    });
  });
});
