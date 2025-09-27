import { Notification } from '@/types';

export const demoNotifications: Notification[] = [
  {
    id: 'notif-1',
    memberId: 'm-ava',
    type: 'approval',
    title: 'Zoe requested approval for Art Showcase',
    message: 'Review Zoe\'s showcase details before Friday 5pm.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'notif-2',
    memberId: 'm-oliver',
    type: 'conflict',
    title: 'Conflict detected',
    message: 'Jamie\'s soccer overlaps with pediatric checkup. Suggest sending reschedule note.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'notif-3',
    memberId: 'm-ava',
    type: 'reminder',
    title: 'Family dinner prep reminder',
    message: 'Start prepping dinner at 4:30pm so everything is ready by 6:00.',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  }
];
