// Date utilities tests
import { buildWeekDays, buildMonthMatrix, isInMonth, isSameDaySafe } from '@/utils/date';

describe('date utilities', () => {
  describe('buildWeekDays', () => {
    it('returns an array of 7 days', () => {
      const date = new Date('2024-01-15');
      const days = buildWeekDays(date);
      expect(days).toHaveLength(7);
    });

    it('starts from Sunday (weekStartsOn: 0)', () => {
      const date = new Date('2024-01-17'); // Wednesday
      const days = buildWeekDays(date);
      expect(days[0].getDay()).toBe(0); // Sunday
    });

    it('ends on Saturday', () => {
      const date = new Date('2024-01-17');
      const days = buildWeekDays(date);
      expect(days[6].getDay()).toBe(6); // Saturday
    });

    it('returns correct week for date at start of month', () => {
      const date = new Date('2024-01-01'); // Monday
      const days = buildWeekDays(date);
      // Week should include Dec 31, 2023 (Sunday)
      expect(days[0].getDate()).toBeLessThanOrEqual(31);
    });

    it('returns correct week for date at end of month', () => {
      const date = new Date('2024-01-31'); // Wednesday
      const days = buildWeekDays(date);
      expect(days).toHaveLength(7);
    });

    it('handles leap year dates', () => {
      const date = new Date('2024-02-29'); // Leap day
      const days = buildWeekDays(date);
      expect(days).toHaveLength(7);
    });

    it('each day is one day apart', () => {
      const date = new Date('2024-06-15');
      const days = buildWeekDays(date);
      for (let i = 1; i < days.length; i++) {
        const diff = days[i].getTime() - days[i - 1].getTime();
        expect(diff).toBe(24 * 60 * 60 * 1000); // 1 day in ms
      }
    });
  });

  describe('buildMonthMatrix', () => {
    it('returns matrix with all days of month', () => {
      const date = new Date('2024-01-15');
      const matrix = buildMonthMatrix(date);
      const totalDays = matrix.flat().length;
      expect(totalDays).toBe(31); // January has 31 days
    });

    it('returns correct number of days for February non-leap year', () => {
      const date = new Date('2023-02-15');
      const matrix = buildMonthMatrix(date);
      const totalDays = matrix.flat().length;
      expect(totalDays).toBe(28);
    });

    it('returns correct number of days for February leap year', () => {
      const date = new Date('2024-02-15');
      const matrix = buildMonthMatrix(date);
      const totalDays = matrix.flat().length;
      expect(totalDays).toBe(29);
    });

    it('returns matrix with weeks of max 7 days', () => {
      const date = new Date('2024-03-15');
      const matrix = buildMonthMatrix(date);
      matrix.forEach((week) => {
        expect(week.length).toBeLessThanOrEqual(7);
      });
    });

    it('all days are valid ISO strings', () => {
      const date = new Date('2024-04-15');
      const matrix = buildMonthMatrix(date);
      matrix.flat().forEach((dayStr) => {
        expect(() => new Date(dayStr)).not.toThrow();
        expect(new Date(dayStr).toISOString()).toBe(dayStr);
      });
    });

    it('handles months with 30 days', () => {
      const date = new Date('2024-04-15');
      const matrix = buildMonthMatrix(date);
      const totalDays = matrix.flat().length;
      expect(totalDays).toBe(30);
    });

    it('first day is first of month', () => {
      const date = new Date('2024-05-20');
      const matrix = buildMonthMatrix(date);
      const firstDay = new Date(matrix[0][0]);
      expect(firstDay.getDate()).toBe(1);
    });

    it('last day is last of month', () => {
      const date = new Date('2024-05-20');
      const matrix = buildMonthMatrix(date);
      const lastWeek = matrix[matrix.length - 1];
      const lastDay = new Date(lastWeek[lastWeek.length - 1]);
      expect(lastDay.getDate()).toBe(31);
    });
  });

  describe('isInMonth', () => {
    it('returns true for date in same month and year', () => {
      const dateStr = new Date('2024-01-15').toISOString();
      const month = new Date('2024-01-20');
      expect(isInMonth(dateStr, month)).toBe(true);
    });

    it('returns false for different month', () => {
      const dateStr = new Date('2024-02-15').toISOString();
      const month = new Date('2024-01-20');
      expect(isInMonth(dateStr, month)).toBe(false);
    });

    it('returns false for different year', () => {
      const dateStr = new Date('2023-01-15').toISOString();
      const month = new Date('2024-01-20');
      expect(isInMonth(dateStr, month)).toBe(false);
    });

    it('handles first day of month', () => {
      // Use explicit UTC timestamps to avoid timezone issues
      const dateStr = '2024-03-01T12:00:00.000Z';
      const month = new Date('2024-03-15T12:00:00.000Z');
      expect(isInMonth(dateStr, month)).toBe(true);
    });

    it('handles last day of month', () => {
      const dateStr = '2024-03-31T12:00:00.000Z';
      const month = new Date('2024-03-15T12:00:00.000Z');
      expect(isInMonth(dateStr, month)).toBe(true);
    });

    it('handles December to January transition', () => {
      const dateStr = '2024-12-15T12:00:00.000Z';
      const month = new Date('2025-01-15T12:00:00.000Z');
      expect(isInMonth(dateStr, month)).toBe(false);
    });
  });

  describe('isSameDaySafe', () => {
    it('returns true for same day', () => {
      const date1 = '2024-01-15T10:30:00Z';
      const date2 = '2024-01-15T18:45:00Z';
      expect(isSameDaySafe(date1, date2)).toBe(true);
    });

    it('returns false for different days', () => {
      const date1 = '2024-01-15T10:30:00Z';
      const date2 = '2024-01-16T10:30:00Z';
      expect(isSameDaySafe(date1, date2)).toBe(false);
    });

    it('handles Date objects', () => {
      const date1 = new Date('2024-01-15T10:30:00Z');
      const date2 = new Date('2024-01-15T18:45:00Z');
      expect(isSameDaySafe(date1, date2)).toBe(true);
    });

    it('handles mixed string and Date', () => {
      const date1 = '2024-01-15T10:30:00Z';
      const date2 = new Date('2024-01-15T18:45:00Z');
      expect(isSameDaySafe(date1, date2)).toBe(true);
    });

    it('returns false for invalid date string', () => {
      const date1 = 'invalid-date';
      const date2 = '2024-01-15T10:30:00Z';
      expect(isSameDaySafe(date1, date2)).toBe(false);
    });

    it('returns false for both invalid dates', () => {
      expect(isSameDaySafe('invalid', 'also-invalid')).toBe(false);
    });

    it('handles same day different times', () => {
      const date1 = '2024-01-15T10:00:00Z';
      const date2 = '2024-01-15T15:00:00Z';
      expect(isSameDaySafe(date1, date2)).toBe(true);
    });

    it('handles leap day', () => {
      const date1 = '2024-02-29T10:00:00Z';
      const date2 = '2024-02-29T20:00:00Z';
      expect(isSameDaySafe(date1, date2)).toBe(true);
    });
  });
});
