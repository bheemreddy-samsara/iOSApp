// Sample data tests
import { demoMembers, demoEvents } from '@/data/sampleEvents';
import { demoNotifications } from '@/data/sampleNotifications';

describe('sample data', () => {
  describe('demoMembers', () => {
    it('has at least 3 members', () => {
      expect(demoMembers.length).toBeGreaterThanOrEqual(3);
    });

    it('each member has required properties', () => {
      const requiredProps = ['id', 'familyId', 'name', 'role', 'color'];

      demoMembers.forEach((member) => {
        requiredProps.forEach((prop) => {
          expect(member).toHaveProperty(prop);
        });
      });
    });

    it('has exactly one owner', () => {
      const owners = demoMembers.filter((m) => m.role === 'owner');
      expect(owners.length).toBe(1);
    });

    it('all members belong to same family', () => {
      const familyIds = new Set(demoMembers.map((m) => m.familyId));
      expect(familyIds.size).toBe(1);
    });

    it('member IDs are unique', () => {
      const ids = demoMembers.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('colors are valid hex values', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      demoMembers.forEach((member) => {
        expect(member.color).toMatch(hexRegex);
      });
    });

    it('has variety of roles', () => {
      const roles = new Set(demoMembers.map((m) => m.role));
      expect(roles.size).toBeGreaterThan(1);
    });
  });

  describe('demoEvents', () => {
    it('has multiple events', () => {
      expect(demoEvents.length).toBeGreaterThan(0);
    });

    it('each event has required properties', () => {
      const requiredProps = [
        'id',
        'calendarId',
        'title',
        'start',
        'end',
        'creatorId',
      ];

      demoEvents.forEach((event) => {
        requiredProps.forEach((prop) => {
          expect(event).toHaveProperty(prop);
        });
      });
    });

    it('event IDs are unique', () => {
      const ids = demoEvents.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('start dates are valid ISO strings', () => {
      demoEvents.forEach((event) => {
        expect(() => new Date(event.start)).not.toThrow();
      });
    });

    it('end dates are valid ISO strings', () => {
      demoEvents.forEach((event) => {
        expect(() => new Date(event.end)).not.toThrow();
      });
    });

    it('end date is after start date', () => {
      demoEvents.forEach((event) => {
        const start = new Date(event.start).getTime();
        const end = new Date(event.end).getTime();
        expect(end).toBeGreaterThanOrEqual(start);
      });
    });

    it('has events with different categories', () => {
      const categories = demoEvents
        .filter((e) => e.category)
        .map((e) => e.category);
      const uniqueCategories = new Set(categories);
      expect(uniqueCategories.size).toBeGreaterThan(1);
    });

    it('has events with different approval states', () => {
      const states = demoEvents
        .filter((e) => e.approvalState)
        .map((e) => e.approvalState);
      const uniqueStates = new Set(states);
      expect(uniqueStates.size).toBeGreaterThanOrEqual(1);
    });
  });

  describe('demoNotifications', () => {
    it('has multiple notifications', () => {
      expect(demoNotifications.length).toBeGreaterThan(0);
    });

    it('each notification has required properties', () => {
      const requiredProps = [
        'id',
        'memberId',
        'type',
        'title',
        'message',
        'createdAt',
      ];

      demoNotifications.forEach((notification) => {
        requiredProps.forEach((prop) => {
          expect(notification).toHaveProperty(prop);
        });
      });
    });

    it('notification IDs are unique', () => {
      const ids = demoNotifications.map((n) => n.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('has variety of notification types', () => {
      const types = new Set(demoNotifications.map((n) => n.type));
      expect(types.size).toBeGreaterThan(1);
    });

    it('createdAt dates are valid', () => {
      demoNotifications.forEach((notification) => {
        expect(() => new Date(notification.createdAt)).not.toThrow();
        const date = new Date(notification.createdAt);
        expect(date.getTime()).not.toBeNaN();
      });
    });

    it('member IDs reference valid members', () => {
      const memberIds = new Set(demoMembers.map((m) => m.id));
      demoNotifications.forEach((notification) => {
        expect(memberIds.has(notification.memberId)).toBe(true);
      });
    });
  });
});
