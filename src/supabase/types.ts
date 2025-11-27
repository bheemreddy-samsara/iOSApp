export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          owner_id?: string;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      members: {
        Row: {
          id: string;
          family_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'child';
          color_hex: string;
          emoji: string;
          status: 'active' | 'invited' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'child';
          color_hex?: string;
          emoji?: string;
          status?: 'active' | 'invited' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member' | 'child';
          color_hex?: string;
          emoji?: string;
          status?: 'active' | 'invited' | 'suspended';
          created_at?: string;
          updated_at?: string;
        };
      };
      calendars: {
        Row: {
          id: string;
          family_id: string;
          provider: 'google' | 'outlook' | 'caldav' | 'internal';
          provider_id: string | null;
          name: string;
          emoji: string | null;
          color_hex: string;
          visibility: 'family' | 'private' | 'busy-only';
          sync_mode: 'read' | 'write';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_id: string;
          provider?: 'google' | 'outlook' | 'caldav' | 'internal';
          provider_id?: string | null;
          name: string;
          emoji?: string | null;
          color_hex: string;
          visibility?: 'family' | 'private' | 'busy-only';
          sync_mode?: 'read' | 'write';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          family_id?: string;
          provider?: 'google' | 'outlook' | 'caldav' | 'internal';
          provider_id?: string | null;
          name?: string;
          emoji?: string | null;
          color_hex?: string;
          visibility?: 'family' | 'private' | 'busy-only';
          sync_mode?: 'read' | 'write';
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          calendar_id: string;
          creator_id: string;
          title: string;
          description: string | null;
          location: string | null;
          category: string | null;
          privacy_mode: 'family' | 'private' | 'busy-only';
          start_at: string;
          end_at: string;
          all_day: boolean;
          status: 'confirmed' | 'cancelled';
          approval_state: 'pending' | 'approved' | 'rejected';
          is_busy_only: boolean;
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          calendar_id: string;
          creator_id: string;
          title: string;
          description?: string | null;
          location?: string | null;
          category?: string | null;
          privacy_mode?: 'family' | 'private' | 'busy-only';
          start_at: string;
          end_at: string;
          all_day?: boolean;
          status?: 'confirmed' | 'cancelled';
          approval_state?: 'pending' | 'approved' | 'rejected';
          is_busy_only?: boolean;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          calendar_id?: string;
          creator_id?: string;
          title?: string;
          description?: string | null;
          location?: string | null;
          category?: string | null;
          privacy_mode?: 'family' | 'private' | 'busy-only';
          start_at?: string;
          end_at?: string;
          all_day?: boolean;
          status?: 'confirmed' | 'cancelled';
          approval_state?: 'pending' | 'approved' | 'rejected';
          is_busy_only?: boolean;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          member_id: string;
          payload: Record<string, unknown>;
          channel: string;
          status: 'queued' | 'sent' | 'failed' | 'read';
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          payload: Record<string, unknown>;
          channel: string;
          status?: 'queued' | 'sent' | 'failed' | 'read';
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          payload?: Record<string, unknown>;
          channel?: string;
          status?: 'queued' | 'sent' | 'failed' | 'read';
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
