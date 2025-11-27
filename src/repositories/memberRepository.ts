import { getSupabaseClient, isSupabaseConfigured } from '@/services/supabase';
import { Member, MemberRole } from '@/types';

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

export const memberRepository = {
  async fetchMembersByFamily(familyId: string): Promise<Member[]> {
    if (!isSupabaseConfigured()) return [];
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('members')
      .select(
        `
        *,
        users:user_id (
          email,
          raw_user_meta_data
        )
      `,
      )
      .eq('family_id', familyId)
      .eq('status', 'active');

    if (error) {
      throw new Error(`Failed to fetch members: ${error.message}`);
    }

    return (data as DatabaseMember[]).map(mapDatabaseToMember);
  },

  async fetchCurrentMember(): Promise<Member | null> {
    if (!isSupabaseConfigured()) return null;
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('members')
      .select(
        `
        *,
        users:user_id (
          email,
          raw_user_meta_data
        )
      `,
      )
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch current member: ${error.message}`);
    }

    return mapDatabaseToMember(data as DatabaseMember);
  },

  async fetchMemberById(memberId: string): Promise<Member | null> {
    if (!isSupabaseConfigured()) return null;
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('members')
      .select(
        `
        *,
        users:user_id (
          email,
          raw_user_meta_data
        )
      `,
      )
      .eq('id', memberId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch member: ${error.message}`);
    }

    return mapDatabaseToMember(data as DatabaseMember);
  },

  async createMember(
    familyId: string,
    userId: string,
    role: MemberRole = 'member',
    color: string = '#5E6AD2',
    emoji: string = '😊',
  ): Promise<Member> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('members')
      .insert({
        family_id: familyId,
        user_id: userId,
        role,
        color_hex: color,
        emoji,
        status: 'active',
      } as any)
      .select(
        `
        *,
        users:user_id (
          email,
          raw_user_meta_data
        )
      `,
      )
      .single();

    if (error) {
      throw new Error(`Failed to create member: ${error.message}`);
    }

    return mapDatabaseToMember(data as DatabaseMember);
  },

  async updateMemberRole(memberId: string, role: MemberRole): Promise<Member> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('members')
      // @ts-expect-error - Supabase types are incomplete for update operations
      .update({ role })
      .eq('id', memberId)
      .select(`*, users:user_id (email, raw_user_meta_data)`)
      .single();

    if (error) {
      throw new Error(`Failed to update member role: ${error.message}`);
    }

    return mapDatabaseToMember(data as DatabaseMember);
  },

  async updateMemberAppearance(
    memberId: string,
    color: string,
    emoji: string,
  ): Promise<Member> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('members')
      // @ts-expect-error - Supabase types are incomplete for update operations
      .update({ color_hex: color, emoji })
      .eq('id', memberId)
      .select(`*, users:user_id (email, raw_user_meta_data)`)
      .single();

    if (error) {
      throw new Error(`Failed to update member appearance: ${error.message}`);
    }

    return mapDatabaseToMember(data as DatabaseMember);
  },

  async removeMember(memberId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('members')
      // @ts-expect-error - Supabase types are incomplete for update operations
      .update({ status: 'suspended' })
      .eq('id', memberId);

    if (error) {
      throw new Error(`Failed to remove member: ${error.message}`);
    }
  },
};
