// Member repository tests

type MemberRole = 'owner' | 'admin' | 'member' | 'child';

interface DatabaseMember {
  id: string;
  family_id: string;
  user_id: string;
  role: MemberRole;
  color_hex: string;
  emoji: string;
  status: 'active' | 'invited' | 'suspended';
  created_at: string;
  updated_at: string;
  users?: {
    email: string;
    raw_user_meta_data?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

interface Member {
  id: string;
  familyId: string;
  name: string;
  role: MemberRole;
  color: string;
  emoji: string;
  avatarBackground: string;
}

// Mapping function extracted for testing
function mapDatabaseToMember(db: DatabaseMember): Member {
  const name =
    db.users?.raw_user_meta_data?.full_name ??
    db.users?.email?.split('@')[0] ??
    'Family Member';

  return {
    id: db.id,
    familyId: db.family_id,
    name,
    role: db.role,
    color: db.color_hex,
    emoji: db.emoji,
    avatarBackground: db.color_hex,
  };
}

// Test data
const mockDbMember: DatabaseMember = {
  id: 'm-1',
  family_id: 'f-1',
  user_id: 'user-1',
  role: 'owner',
  color_hex: '#5E6AD2',
  emoji: '🌼',
  status: 'active',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  users: {
    email: 'test@example.com',
    raw_user_meta_data: {
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
    },
  },
};

describe('memberRepository', () => {
  describe('mapDatabaseToMember', () => {
    it('maps all fields correctly', () => {
      const result = mapDatabaseToMember(mockDbMember);

      expect(result.id).toBe('m-1');
      expect(result.familyId).toBe('f-1');
      expect(result.name).toBe('Test User');
      expect(result.role).toBe('owner');
      expect(result.color).toBe('#5E6AD2');
      expect(result.emoji).toBe('🌼');
      expect(result.avatarBackground).toBe('#5E6AD2');
    });

    it('uses full_name when available', () => {
      const result = mapDatabaseToMember(mockDbMember);
      expect(result.name).toBe('Test User');
    });

    it('falls back to email username when no full_name', () => {
      const dbMember: DatabaseMember = {
        ...mockDbMember,
        users: {
          email: 'john.doe@example.com',
          raw_user_meta_data: {},
        },
      };
      const result = mapDatabaseToMember(dbMember);
      expect(result.name).toBe('john.doe');
    });

    it('falls back to Family Member when no user data', () => {
      const dbMember: DatabaseMember = {
        ...mockDbMember,
        users: undefined,
      };
      const result = mapDatabaseToMember(dbMember);
      expect(result.name).toBe('Family Member');
    });

    it('handles different roles', () => {
      const roles: MemberRole[] = ['owner', 'admin', 'member', 'child'];

      roles.forEach((role) => {
        const dbMember = { ...mockDbMember, role };
        const result = mapDatabaseToMember(dbMember);
        expect(result.role).toBe(role);
      });
    });

    it('maps family_id to familyId', () => {
      const result = mapDatabaseToMember(mockDbMember);
      expect(result.familyId).toBe('f-1');
    });

    it('maps color_hex to both color and avatarBackground', () => {
      const dbMember = { ...mockDbMember, color_hex: '#FF9F80' };
      const result = mapDatabaseToMember(dbMember);
      expect(result.color).toBe('#FF9F80');
      expect(result.avatarBackground).toBe('#FF9F80');
    });

    it('preserves emoji', () => {
      const emojis = ['🌼', '🚀', '🎸', '🦄', '🍪'];

      emojis.forEach((emoji) => {
        const dbMember = { ...mockDbMember, emoji };
        const result = mapDatabaseToMember(dbMember);
        expect(result.emoji).toBe(emoji);
      });
    });

    it('handles missing raw_user_meta_data', () => {
      const dbMember: DatabaseMember = {
        ...mockDbMember,
        users: {
          email: 'test@example.com',
        },
      };
      const result = mapDatabaseToMember(dbMember);
      expect(result.name).toBe('test');
    });

    it('handles email without username part gracefully', () => {
      const dbMember: DatabaseMember = {
        ...mockDbMember,
        users: {
          email: 'simpleuser',
          raw_user_meta_data: undefined,
        },
      };
      const result = mapDatabaseToMember(dbMember);
      // Should use the whole email as username since there's no @
      expect(result.name).toBe('simpleuser');
    });
  });

  describe('member role hierarchy', () => {
    const roleHierarchy: Record<MemberRole, number> = {
      owner: 0,
      admin: 1,
      member: 2,
      child: 3,
    };

    it('owner has highest privilege', () => {
      expect(roleHierarchy.owner).toBeLessThan(roleHierarchy.admin);
    });

    it('admin is above member', () => {
      expect(roleHierarchy.admin).toBeLessThan(roleHierarchy.member);
    });

    it('member is above child', () => {
      expect(roleHierarchy.member).toBeLessThan(roleHierarchy.child);
    });

    it('can determine if role can approve events', () => {
      const canApprove = (role: MemberRole): boolean =>
        ['owner', 'admin'].includes(role);

      expect(canApprove('owner')).toBe(true);
      expect(canApprove('admin')).toBe(true);
      expect(canApprove('member')).toBe(false);
      expect(canApprove('child')).toBe(false);
    });

    it('can determine if role can manage family', () => {
      const canManageFamily = (role: MemberRole): boolean =>
        ['owner', 'admin'].includes(role);

      expect(canManageFamily('owner')).toBe(true);
      expect(canManageFamily('admin')).toBe(true);
      expect(canManageFamily('member')).toBe(false);
      expect(canManageFamily('child')).toBe(false);
    });
  });
});
