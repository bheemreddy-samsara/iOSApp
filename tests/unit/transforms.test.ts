import {
  snakeToCamel,
  camelToSnake,
  fromDatabase,
  toDatabase,
} from '@/utils/transforms';

describe('transforms', () => {
  describe('snakeToCamel', () => {
    it('converts snake_case to camelCase', () => {
      expect(snakeToCamel('hello_world')).toBe('helloWorld');
      expect(snakeToCamel('user_id')).toBe('userId');
      expect(snakeToCamel('created_at')).toBe('createdAt');
      expect(snakeToCamel('start_at')).toBe('startAt');
    });

    it('handles multiple underscores', () => {
      expect(snakeToCamel('this_is_a_test')).toBe('thisIsATest');
    });

    it('handles strings without underscores', () => {
      expect(snakeToCamel('hello')).toBe('hello');
    });
  });

  describe('camelToSnake', () => {
    it('converts camelCase to snake_case', () => {
      expect(camelToSnake('helloWorld')).toBe('hello_world');
      expect(camelToSnake('userId')).toBe('user_id');
      expect(camelToSnake('createdAt')).toBe('created_at');
      expect(camelToSnake('startAt')).toBe('start_at');
    });

    it('handles multiple capital letters', () => {
      expect(camelToSnake('thisIsATest')).toBe('this_is_a_test');
    });

    it('handles strings without capitals', () => {
      expect(camelToSnake('hello')).toBe('hello');
    });
  });

  describe('fromDatabase', () => {
    it('converts database record to frontend format', () => {
      const dbRecord = {
        id: '123',
        user_id: 'user-1',
        family_id: 'family-1',
        created_at: '2024-01-01',
        is_active: true,
      };

      const result = fromDatabase<{
        id: string;
        userId: string;
        familyId: string;
        createdAt: string;
        isActive: boolean;
      }>(dbRecord);

      expect(result).toEqual({
        id: '123',
        userId: 'user-1',
        familyId: 'family-1',
        createdAt: '2024-01-01',
        isActive: true,
      });
    });

    it('handles nested objects', () => {
      const dbRecord = {
        id: '123',
        user_data: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      const result = fromDatabase<{
        id: string;
        userData: { firstName: string; lastName: string };
      }>(dbRecord);

      expect(result).toEqual({
        id: '123',
        userData: {
          firstName: 'John',
          lastName: 'Doe',
        },
      });
    });
  });

  describe('toDatabase', () => {
    it('converts frontend format to database record', () => {
      const frontendData = {
        id: '123',
        userId: 'user-1',
        familyId: 'family-1',
        createdAt: '2024-01-01',
        isActive: true,
      };

      const result = toDatabase(frontendData);

      expect(result).toEqual({
        id: '123',
        user_id: 'user-1',
        family_id: 'family-1',
        created_at: '2024-01-01',
        is_active: true,
      });
    });
  });
});
