import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabaseClient, isSupabaseConfigured } from '@/services/supabase';
import { useAuthStore } from '@/state/authStore';
import { Notification } from '@/types';

interface DbNotification {
  id: string;
  member_id: string;
  payload: {
    type?: string;
    title?: string;
    body?: string;
    event_id?: string;
  };
  channel: string;
  status: 'queued' | 'sent' | 'failed' | 'read';
  delivered_at: string | null;
  created_at: string;
}

function transformNotification(db: DbNotification): Notification {
  return {
    id: db.id,
    memberId: db.member_id,
    type: (db.payload.type || 'reminder') as Notification['type'],
    title: db.payload.title || 'Notification',
    message: db.payload.body || '',
    createdAt: db.created_at,
    readAt: db.status === 'read' ? db.delivered_at ?? db.created_at : undefined,
  };
}

export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
};

export function useNotifications() {
  const { member } = useAuthStore();

  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async (): Promise<Notification[]> => {
      if (!member?.id || !isSupabaseConfigured()) return [];

      const supabase = getSupabaseClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('member_id', member.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data || []).map(transformNotification);
    },
    enabled: Boolean(member?.id) && isSupabaseConfigured(),
    staleTime: 30_000,
  });
}

export function useUnreadCount() {
  const { member } = useAuthStore();

  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: async (): Promise<number> => {
      if (!member?.id || !isSupabaseConfigured()) return 0;

      const supabase = getSupabaseClient();
      if (!supabase) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('member_id', member.id)
        .neq('status', 'read');

      if (error) throw error;
      return count || 0;
    },
    enabled: Boolean(member?.id) && isSupabaseConfigured(),
    staleTime: 30_000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!isSupabaseConfigured()) return;

      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { error } = await supabase
        .from('notifications')
        // @ts-expect-error - Supabase type inference issue with update
        .update({ status: 'read' })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
