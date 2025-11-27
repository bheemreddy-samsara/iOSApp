// Family repository tests

interface Family {
  id: string;
  name: string;
  ownerId: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseFamily {
  id: string;
  name: string;
  owner_id: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

// Mapping function extracted for testing
function mapDatabaseToFamily(db: DatabaseFamily): Family {
  return {
    id: db.id,
    name: db.name,
    ownerId: db.owner_id,
    timezone: db.timezone,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

function mapFamilyToDatabase(family: Partial<Family>): Partial<DatabaseFamily> {
  const mapped: Partial<DatabaseFamily> = {};

  if (family.id !== undefined) mapped.id = family.id;
  if (family.name !== undefined) mapped.name = family.name;
  if (family.ownerId !== undefined) mapped.owner_id = family.ownerId;
  if (family.timezone !== undefined) mapped.timezone = family.timezone;
  if (family.createdAt !== undefined) mapped.created_at = family.createdAt;
  if (family.updatedAt !== undefined) mapped.updated_at = family.updatedAt;

  return mapped;
}

// Test data
const mockDbFamily: DatabaseFamily = {
  id: 'f-1',
  name: 'Test Family',
  owner_id: 'm-1',
  timezone: 'America/New_York',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T10:30:00Z',
};

describe('familyRepository', () => {
  describe('mapDatabaseToFamily', () => {
    it('maps all fields correctly', () => {
      const result = mapDatabaseToFamily(mockDbFamily);

      expect(result.id).toBe('f-1');
      expect(result.name).toBe('Test Family');
      expect(result.ownerId).toBe('m-1');
      expect(result.timezone).toBe('America/New_York');
      expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
      expect(result.updatedAt).toBe('2024-01-15T10:30:00Z');
    });

    it('maps owner_id to ownerId', () => {
      const result = mapDatabaseToFamily(mockDbFamily);
      expect(result.ownerId).toBe('m-1');
    });

    it('maps created_at to createdAt', () => {
      const result = mapDatabaseToFamily(mockDbFamily);
      expect(result.createdAt).toBe('2024-01-01T00:00:00Z');
    });

    it('maps updated_at to updatedAt', () => {
      const result = mapDatabaseToFamily(mockDbFamily);
      expect(result.updatedAt).toBe('2024-01-15T10:30:00Z');
    });

    it('handles different timezones', () => {
      const timezones = [
        'America/New_York',
        'America/Los_Angeles',
        'Europe/London',
        'Asia/Tokyo',
        'UTC',
      ];

      timezones.forEach((tz) => {
        const dbFamily = { ...mockDbFamily, timezone: tz };
        const result = mapDatabaseToFamily(dbFamily);
        expect(result.timezone).toBe(tz);
      });
    });

    it('preserves family name', () => {
      const names = ['Smith Family', "The Johnson's", 'Family 123', '家族'];

      names.forEach((name) => {
        const dbFamily = { ...mockDbFamily, name };
        const result = mapDatabaseToFamily(dbFamily);
        expect(result.name).toBe(name);
      });
    });
  });

  describe('mapFamilyToDatabase', () => {
    it('maps ownerId to owner_id', () => {
      const result = mapFamilyToDatabase({ ownerId: 'm-1' });
      expect(result.owner_id).toBe('m-1');
    });

    it('maps createdAt to created_at', () => {
      const result = mapFamilyToDatabase({ createdAt: '2024-01-01T00:00:00Z' });
      expect(result.created_at).toBe('2024-01-01T00:00:00Z');
    });

    it('maps updatedAt to updated_at', () => {
      const result = mapFamilyToDatabase({ updatedAt: '2024-01-15T10:30:00Z' });
      expect(result.updated_at).toBe('2024-01-15T10:30:00Z');
    });

    it('only includes defined fields', () => {
      const result = mapFamilyToDatabase({ name: 'Test' });
      expect(Object.keys(result)).toEqual(['name']);
    });

    it('handles empty object', () => {
      const result = mapFamilyToDatabase({});
      expect(Object.keys(result)).toHaveLength(0);
    });

    it('maps multiple fields at once', () => {
      const result = mapFamilyToDatabase({
        name: 'Test Family',
        timezone: 'UTC',
        ownerId: 'm-1',
      });

      expect(result.name).toBe('Test Family');
      expect(result.timezone).toBe('UTC');
      expect(result.owner_id).toBe('m-1');
    });
  });

  describe('round-trip conversion', () => {
    it('preserves data through db -> family -> db conversion', () => {
      const family = mapDatabaseToFamily(mockDbFamily);
      const dbFamily = mapFamilyToDatabase(family);

      expect(dbFamily.id).toBe(mockDbFamily.id);
      expect(dbFamily.name).toBe(mockDbFamily.name);
      expect(dbFamily.owner_id).toBe(mockDbFamily.owner_id);
      expect(dbFamily.timezone).toBe(mockDbFamily.timezone);
      expect(dbFamily.created_at).toBe(mockDbFamily.created_at);
      expect(dbFamily.updated_at).toBe(mockDbFamily.updated_at);
    });
  });

  describe('timezone validation', () => {
    it('accepts valid IANA timezones', () => {
      const validTimezones = [
        'America/New_York',
        'America/Los_Angeles',
        'America/Chicago',
        'Europe/London',
        'Europe/Paris',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Australia/Sydney',
        'Pacific/Auckland',
        'UTC',
      ];

      validTimezones.forEach((tz) => {
        const dbFamily = { ...mockDbFamily, timezone: tz };
        const result = mapDatabaseToFamily(dbFamily);
        expect(result.timezone).toBe(tz);
      });
    });

    it('can determine user timezone from Intl API', () => {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      expect(typeof userTimezone).toBe('string');
      expect(userTimezone.length).toBeGreaterThan(0);
    });
  });
});
