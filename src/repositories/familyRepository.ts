import { getSupabaseClient, isSupabaseConfigured } from '@/services/supabase';

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

export const familyRepository = {
  async fetchFamilyById(familyId: string): Promise<Family | null> {
    if (!isSupabaseConfigured()) return null;
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('families')
      .select('*')
      .eq('id', familyId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch family: ${error.message}`);
    }

    return mapDatabaseToFamily(data as DatabaseFamily);
  },

  async fetchCurrentUserFamily(): Promise<Family | null> {
    if (!isSupabaseConfigured()) return null;
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Get family through member relationship
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .select('family_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (memberError || !memberData) {
      return null;
    }

    return this.fetchFamilyById((memberData as any).family_id);
  },

  async createFamily(
    name: string,
    timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
  ): Promise<Family> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User must be authenticated to create a family');
    }

    const { data, error } = await supabase
      .from('families')
      .insert({
        name,
        owner_id: user.id,
        timezone,
      } as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create family: ${error.message}`);
    }

    const familyData = data as any;

    // Create owner member record
    await supabase.from('members').insert({
      family_id: familyData.id,
      user_id: user.id,
      role: 'owner',
      status: 'active',
    } as any);

    // Create default calendar
    await supabase.from('calendars').insert({
      family_id: familyData.id,
      name: 'Family Calendar',
      color_hex: '#5E6AD2',
      emoji: '📅',
      visibility: 'family',
      provider: 'internal',
    } as any);

    return mapDatabaseToFamily(familyData as DatabaseFamily);
  },

  async updateFamily(
    familyId: string,
    updates: { name?: string; timezone?: string },
  ): Promise<Family> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('families')
      // @ts-expect-error - Supabase types are incomplete for update operations
      .update(updates)
      .eq('id', familyId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update family: ${error.message}`);
    }

    return mapDatabaseToFamily(data as DatabaseFamily);
  },

  async deleteFamily(familyId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('families')
      .delete()
      .eq('id', familyId);

    if (error) {
      throw new Error(`Failed to delete family: ${error.message}`);
    }
  },
};
