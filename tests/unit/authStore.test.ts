import { useAuthStore } from '@/state/authStore';

// Mock secureStorage
jest.mock('@/utils/secureStorage', () => ({
  secureStorage: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      session: null,
      member: null,
    });
  });

  it('initializes with null session and member', () => {
    const state = useAuthStore.getState();

    expect(state.session).toBeNull();
    expect(state.member).toBeNull();
  });

  it('sets session', () => {
    const mockSession = {
      access_token: 'test-token',
      refresh_token: 'refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
        id: 'user-1',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: '2024-01-01',
      },
    };

    useAuthStore.getState().setSession(mockSession as any);

    expect(useAuthStore.getState().session).toEqual(mockSession);
  });

  it('sets member', () => {
    const mockMember = {
      id: 'member-1',
      familyId: 'family-1',
      name: 'Test User',
      role: 'owner' as const,
      color: '#5E6AD2',
      emoji: '😊',
      avatarBackground: '#5E6AD2',
    };

    useAuthStore.getState().setMember(mockMember);

    expect(useAuthStore.getState().member).toEqual(mockMember);
  });

  it('signs out and clears state', async () => {
    // Set up initial state
    const mockMember = {
      id: 'member-1',
      familyId: 'family-1',
      name: 'Test User',
      role: 'owner' as const,
      color: '#5E6AD2',
      emoji: '😊',
      avatarBackground: '#5E6AD2',
    };

    useAuthStore.getState().setMember(mockMember);
    expect(useAuthStore.getState().member).not.toBeNull();

    // Sign out
    await useAuthStore.getState().signOut();

    // Verify cleared state
    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().member).toBeNull();
  });
});
